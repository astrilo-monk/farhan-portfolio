import { useEffect, useRef, useState } from "react";

const P5_CDN_URL = "https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/p5.min.js";

function loadP5FromCdn() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window is not available"));
  }

  if (window.p5) {
    return Promise.resolve(window.p5);
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-p5-cdn='true']");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.p5), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load p5")), {
        once: true
      });
      return;
    }

    const script = document.createElement("script");
    script.src = P5_CDN_URL;
    script.async = true;
    script.defer = true;
    script.dataset.p5Cdn = "true";
    script.onload = () => {
      if (window.p5) {
        resolve(window.p5);
      } else {
        reject(new Error("p5 loaded but not found on window"));
      }
    };
    script.onerror = () => reject(new Error("Failed to load p5"));
    document.head.appendChild(script);
  });
}

export function ForceFieldBackground({
  imageUrl = "https://cdn.pixabay.com/photo/2024/12/13/20/29/alps-9266131_1280.jpg",
  hue = 210,
  saturation = 100,
  threshold = 255,
  minStroke = 2,
  maxStroke = 6,
  spacing = 10,
  noiseScale = 0,
  density = 2,
  invertImage = true,
  invertWireframe = true,
  magnifierEnabled = true,
  magnifierRadius = 150,
  forceStrength = 10,
  friction = 0.9,
  restoreSpeed = 0.05,
  className = ""
}) {
  const containerRef = useRef(null);
  const p5InstanceRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const propsRef = useRef({
    hue,
    saturation,
    threshold,
    minStroke,
    maxStroke,
    spacing,
    noiseScale,
    density,
    invertImage,
    invertWireframe,
    magnifierEnabled,
    magnifierRadius,
    forceStrength,
    friction,
    restoreSpeed
  });

  useEffect(() => {
    propsRef.current = {
      hue,
      saturation,
      threshold,
      minStroke,
      maxStroke,
      spacing,
      noiseScale,
      density,
      invertImage,
      invertWireframe,
      magnifierEnabled,
      magnifierRadius,
      forceStrength,
      friction,
      restoreSpeed
    };
  }, [
    hue,
    saturation,
    threshold,
    minStroke,
    maxStroke,
    spacing,
    noiseScale,
    density,
    invertImage,
    invertWireframe,
    magnifierEnabled,
    magnifierRadius,
    forceStrength,
    friction,
    restoreSpeed
  ]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    let disposed = false;
    let instance = null;

    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
    }

    setError(null);
    setIsLoading(true);

    const start = async () => {
      let P5;
      try {
        P5 = await loadP5FromCdn();
      } catch {
        if (!disposed) {
          setError("Failed to load p5 runtime");
          setIsLoading(false);
        }
        return;
      }

      if (disposed || !containerRef.current) {
        return;
      }

      const sketch = (p) => {
      let originalImg;
      let img;
      let palette = [];
      let points = [];

      let lastHue = -1;
      let lastSaturation = -1;
      let lastSpacing = -1;
      let lastNoiseScale = -1;
      let lastDensity = -1;
      let lastInvertImage = null;
      let magnifierX = 0;
      let magnifierY = 0;
      const magnifierInertia = 0.1;

      p.preload = () => {
        p.loadImage(
          imageUrl,
          (loadedImg) => {
            originalImg = loadedImg;
            setIsLoading(false);
          },
          () => {
            setError("Failed to load image");
            setIsLoading(false);
          }
        );
      };

      p.setup = () => {
        if (!originalImg) {
          return;
        }

        const { clientWidth, clientHeight } = containerRef.current;
        p.createCanvas(clientWidth, clientHeight);

        magnifierX = p.width / 2;
        magnifierY = p.height / 2;

        processImage();
        generatePalette(propsRef.current.hue, propsRef.current.saturation);
        generatePoints();
      };

      p.windowResized = () => {
        if (!containerRef.current || !originalImg) {
          return;
        }

        const { clientWidth, clientHeight } = containerRef.current;
        p.resizeCanvas(clientWidth, clientHeight);
        processImage();
        generatePoints();
      };

      function processImage() {
        if (!originalImg) {
          return;
        }

        img = originalImg.get();
        if (p.width > 0 && p.height > 0) {
          img.resize(p.width, p.height);
        }
        img.filter(p.GRAY);

        if (propsRef.current.invertImage) {
          img.loadPixels();
          for (let i = 0; i < img.pixels.length; i += 4) {
            img.pixels[i] = 255 - img.pixels[i];
            img.pixels[i + 1] = 255 - img.pixels[i + 1];
            img.pixels[i + 2] = 255 - img.pixels[i + 2];
          }
          img.updatePixels();
        }

        lastInvertImage = propsRef.current.invertImage;
      }

      function generatePalette(h, s) {
        palette = [];
        p.push();
        p.colorMode(p.HSL);
        for (let i = 0; i < 12; i += 1) {
          const lightness = p.map(i, 0, 11, 95, 5);
          palette.push(p.color(h, s, lightness));
        }
        p.pop();
      }

      function generatePoints() {
        if (!img) {
          return;
        }

        points = [];
        const { spacing: pointSpacing, density: pointDensity, noiseScale: pointNoise } = propsRef.current;
        const safeSpacing = Math.max(2, pointSpacing);

        for (let y = 0; y < img.height; y += safeSpacing) {
          for (let x = 0; x < img.width; x += safeSpacing) {
            if (p.random() > pointDensity) {
              continue;
            }

            const nx = p.noise(x * pointNoise, y * pointNoise) - 0.5;
            const ny = p.noise((x + 500) * pointNoise, (y + 500) * pointNoise) - 0.5;
            const px = x + nx * safeSpacing;
            const py = y + ny * safeSpacing;

            points.push({
              pos: p.createVector(px, py),
              originalPos: p.createVector(px, py),
              vel: p.createVector(0, 0)
            });
          }
        }

        lastSpacing = pointSpacing;
        lastNoiseScale = pointNoise;
        lastDensity = pointDensity;
      }

      function applyForceField(mx, my) {
        const current = propsRef.current;
        if (!current.magnifierEnabled) {
          return;
        }

        for (const pt of points) {
          const dir = P5.Vector.sub(pt.pos, p.createVector(mx, my));
          const d = dir.mag();

          if (d < current.magnifierRadius) {
            dir.normalize();
            const force = dir.mult(current.forceStrength / Math.max(1, d));
            pt.vel.add(force);
          }

          pt.vel.mult(current.friction);
          const restore = P5.Vector.sub(pt.pos, pt.originalPos).mult(-current.restoreSpeed);
          pt.vel.add(restore);
          pt.pos.add(pt.vel);
        }
      }

      p.draw = () => {
        if (!img) {
          return;
        }

        p.background(0);
        const current = propsRef.current;

        if (current.hue !== lastHue || current.saturation !== lastSaturation) {
          generatePalette(current.hue, current.saturation);
          lastHue = current.hue;
          lastSaturation = current.saturation;
        }

        if (current.invertImage !== lastInvertImage) {
          processImage();
        }

        if (
          current.spacing !== lastSpacing ||
          current.noiseScale !== lastNoiseScale ||
          current.density !== lastDensity
        ) {
          generatePoints();
        }

        magnifierX = p.lerp(magnifierX, p.mouseX, magnifierInertia);
        magnifierY = p.lerp(magnifierY, p.mouseY, magnifierInertia);

        applyForceField(magnifierX, magnifierY);

        img.loadPixels();
        p.noFill();

        for (const pt of points) {
          const x = pt.pos.x;
          const y = pt.pos.y;
          const d = p.dist(x, y, magnifierX, magnifierY);

          const px = p.constrain(p.floor(x), 0, img.width - 1);
          const py = p.constrain(p.floor(y), 0, img.height - 1);
          const index = (px + py * img.width) * 4;
          const brightness = img.pixels[index];

          if (brightness === undefined) {
            continue;
          }

          const condition = current.invertWireframe
            ? brightness < current.threshold
            : brightness > current.threshold;

          if (!condition) {
            continue;
          }

          let shadeIndex = Math.floor(p.map(brightness, 0, 255, 0, palette.length - 1));
          shadeIndex = p.constrain(shadeIndex, 0, palette.length - 1);

          let strokeSize = p.map(brightness, 0, 255, current.minStroke, current.maxStroke);
          if (current.magnifierEnabled && d < current.magnifierRadius) {
            const factor = p.map(d, 0, current.magnifierRadius, 2, 1);
            strokeSize *= factor;
          }

          if (palette[shadeIndex]) {
            p.stroke(palette[shadeIndex]);
            p.strokeWeight(strokeSize);
            p.point(x, y);
          }
        }
      };
      };

      instance = new P5(sketch, containerRef.current);
      p5InstanceRef.current = instance;
    };

    start();

    return () => {
      disposed = true;
      if (instance) {
        instance.remove();
      }
    };
  }, [imageUrl]);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black ${className}`} ref={containerRef}>
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center text-white/50 text-xs tracking-widest uppercase">
          Initializing Force Field...
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-red-500/50 text-xs tracking-widest uppercase">
          {error}
        </div>
      )}
    </div>
  );
}

export default ForceFieldBackground;
