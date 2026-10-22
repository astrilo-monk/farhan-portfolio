import { useEffect, useRef } from "react";

// Background: a faint field of code glyphs that lights up around the cursor,
// with slow ripples and occasional twinkles, over two drifting aurora washes.
// Pauses when the tab is hidden; static for reduced-motion users; lighter on touch.

const GLYPHS = "0101010{}<>/=;()[]#$*+-_|&%~".split("");
const GREEN = "74,222,128";
const AMBER = "245,185,66";

export default function AmbientBackground() {
  const rootRef = useRef(null);
  const baseRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const baseCanvas = baseRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;

    let dpr = 1;
    let w = 0;
    let h = 0;
    let cell = 28;
    let cols = 0;
    let rows = 0;
    let glyphs = new Uint8Array(0);
    let raf = 0;
    let last = 0;

    const pointer = { x: -999, y: -999, tx: -999, ty: -999, active: false };
    const ripples = [];
    const twinkles = [];
    let nextRipple = 1200;
    let nextTwinkle = 0;

    const fontFor = () => `${touch ? 12 : 13}px "JetBrains Mono", ui-monospace, monospace`;

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      cell = touch ? 34 : 28;
      cols = Math.ceil(w / cell) + 1;
      rows = Math.ceil(h / cell) + 1;
      glyphs = new Uint8Array(cols * rows);
      for (let i = 0; i < glyphs.length; i += 1) glyphs[i] = Math.floor(Math.random() * GLYPHS.length);

      // Static layer on its own canvas: every glyph at a very low alpha, drawn
      // once per resize (never per frame).
      baseCanvas.width = canvas.width;
      baseCanvas.height = canvas.height;
      const b = baseCanvas.getContext("2d");
      b.setTransform(dpr, 0, 0, dpr, 0, 0);
      b.clearRect(0, 0, w, h);
      b.font = fontFor();
      b.textAlign = "center";
      b.textBaseline = "middle";
      b.fillStyle = "rgba(170,185,200,0.075)";
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          b.fillText(GLYPHS[glyphs[r * cols + c]], c * cell + cell / 2, r * cell + cell / 2);
        }
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawCell(c, r, alpha, rgb) {
      if (c < 0 || r < 0 || c >= cols || r >= rows || alpha < 0.012) return;
      ctx.fillStyle = `rgba(${rgb},${Math.min(alpha, 0.5).toFixed(3)})`;
      ctx.fillText(GLYPHS[glyphs[r * cols + c]], c * cell + cell / 2, r * cell + cell / 2);
    }

    function frame(t) {
      raf = requestAnimationFrame(frame);
      if (t - last < 33) return; // ~30fps is plenty for ambient motion
      const dt = t - last;
      last = t;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = fontFor();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Cursor light with a smooth trail.
      if (pointer.active) {
        pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 0.014);
        pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 0.014);
        const radius = 150;
        const c0 = Math.floor((pointer.x - radius) / cell);
        const c1 = Math.ceil((pointer.x + radius) / cell);
        const r0 = Math.floor((pointer.y - radius) / cell);
        const r1 = Math.ceil((pointer.y + radius) / cell);
        for (let r = r0; r <= r1; r += 1) {
          for (let c = c0; c <= c1; c += 1) {
            const d = Math.hypot(c * cell + cell / 2 - pointer.x, r * cell + cell / 2 - pointer.y);
            if (d < radius) drawCell(c, r, (1 - d / radius) ** 2 * 0.42, GREEN);
          }
        }
      }

      // Ripples: expanding rings that brighten the glyphs they cross.
      if (t > nextRipple && ripples.length < 2) {
        ripples.push({ x: Math.random() * w, y: Math.random() * h * 0.85, t0: t });
        nextRipple = t + 5200 + Math.random() * 3800;
      }
      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const rp = ripples[i];
        const radius = (t - rp.t0) * 0.2;
        const maxR = 460;
        if (radius > maxR) {
          ripples.splice(i, 1);
          continue;
        }
        const life = 1 - radius / maxR;
        const band = 54;
        const c0 = Math.floor((rp.x - radius - band) / cell);
        const c1 = Math.ceil((rp.x + radius + band) / cell);
        const r0 = Math.floor((rp.y - radius - band) / cell);
        const r1 = Math.ceil((rp.y + radius + band) / cell);
        for (let r = r0; r <= r1; r += 1) {
          for (let c = c0; c <= c1; c += 1) {
            const d = Math.hypot(c * cell + cell / 2 - rp.x, r * cell + cell / 2 - rp.y);
            const off = Math.abs(d - radius);
            if (off < band) drawCell(c, r, (1 - off / band) * life * 0.34, GREEN);
          }
        }
      }

      // Twinkles: single glyphs that swell and fade.
      if (t > nextTwinkle && twinkles.length < 26) {
        twinkles.push({
          c: Math.floor(Math.random() * cols),
          r: Math.floor(Math.random() * rows),
          t0: t,
          dur: 1400 + Math.random() * 1800,
          rgb: Math.random() < 0.18 ? AMBER : GREEN
        });
        nextTwinkle = t + 170 + Math.random() * 260;
      }
      for (let i = twinkles.length - 1; i >= 0; i -= 1) {
        const tw = twinkles[i];
        const p = (t - tw.t0) / tw.dur;
        if (p >= 1) {
          twinkles.splice(i, 1);
          continue;
        }
        drawCell(tw.c, tw.r, Math.sin(p * Math.PI) * 0.3, tw.rgb);
      }
    }

    const start = () => {
      if (!raf && !reduced) raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (event) => {
      pointer.tx = event.clientX;
      pointer.ty = event.clientY;
      if (!pointer.active) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
        pointer.active = true;
      }
      root.style.setProperty("--mx", `${event.clientX}px`);
      root.style.setProperty("--my", `${event.clientY}px`);
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 150);
    };

    build();
    if (document.fonts?.ready) document.fonts.ready.then(build);
    start();

    if (!touch && !reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="ambient" ref={rootRef} aria-hidden="true">
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <canvas className="ambient-canvas" ref={baseRef} />
      <canvas className="ambient-canvas" ref={canvasRef} />
      <div className="ambient-glow" />
    </div>
  );
}
