import { useEffect, useMemo, useRef, useState } from "react";
import {
  Droplets,
  FolderOpen,
  Github,
  Linkedin,
  Send,
  Sparkles
} from "lucide-react";

const profile = {
  name: "ASTRILO",
  role: "College Student Developer",
  experience: "No Professional Experience Yet",
  location: "BP Poddar Institute of Management and Technology",
  status: "Open to Internships",
  stack: "React / Node / Python / AWS",
  github: "https://github.com/astrilo-monk",
  linkedin: "https://www.linkedin.com/in/astrilo/",
  email: "astrilo@dev.io"
};

const projects = [
  {
    title: "ascii-art-js",
    year: "2026",
    repo: "https://github.com/astrilo-monk/ascii-art-js",
    color: "cyan"
  },
  {
    title: "code-tracer",
    year: "2026",
    repo: "https://github.com/astrilo-monk/code-tracer",
    color: "magenta"
  },
  {
    title: "saarthi",
    year: "2025",
    repo: "https://github.com/astrilo-monk/saarthi",
    color: "yellow"
  },
  {
    title: "emotion-tracker",
    year: "2025",
    repo: "https://github.com/astrilo-monk/emotion-tracker",
    color: "cyan"
  },
  {
    title: "repl",
    year: "2025",
    repo: "https://github.com/astrilo-monk/repl",
    color: "yellow"
  }
];

const experience = [
  {
    role: "BTech Student (CSE)",
    company: "BP Poddar Institute of Management and Technology",
    period: "Current",
    summary:
      "Studying BTech in Computer Science and Engineering with focus on software engineering, data structures, algorithms, and web development.",
    color: "cyan"
  },
  {
    role: "Project-Based Learning",
    company: "Personal & Academic Projects",
    period: "Ongoing",
    summary:
      "Developing portfolio projects to practice frontend and backend skills, improve code quality, and learn real-world development workflows.",
    color: "magenta"
  }
];

const navItems = [
  ["ABOUT", "about"],
  ["PROJECTS", "projects"],
  ["JOURNEY", "experience"]
];

function useClock() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString("en-US", { hour12: false })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return time;
}

function useParticles(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    let animationFrame = 0;

    class Particle {
      constructor(width, height) {
        this.width = width;
        this.height = height;
        this.reset();
      }

      updateBounds(width, height) {
        this.width = width;
        this.height = height;
      }

      reset() {
        this.x = Math.random() * this.width;
        this.y = Math.random() * this.height;
        this.size = Math.random() * 1.5 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.color = Math.random() > 0.5 ? "0,240,255" : "255,0,170";
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (
          this.x < 0 ||
          this.x > this.width ||
          this.y < 0 ||
          this.y > this.height
        ) {
          this.reset();
        }
      }

      draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        context.fill();
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particleSet.forEach((particle) => {
        particle.updateBounds(canvas.width, canvas.height);
      });
    };

    const particleCount = window.innerWidth < 768 ? 40 : 80;
    const particleSet = Array.from(
      { length: particleCount },
      () => new Particle(window.innerWidth, window.innerHeight)
    );

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particleSet.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });
      animationFrame = window.requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [canvasRef]);
}

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.12 }
    );

    const targets = document.querySelectorAll(".fade-up");
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

function SectionHeading({ index, title, accent = "cyan", showTrail = true, note = "" }) {
  return (
    <div className="section-title fade-up">
      <div className="section-index-wrap">
        <span className={`section-index ${accent}`}>{index}</span>
        <div className={`section-index-line ${accent}`} />
      </div>
      <h2>{title}</h2>
      {showTrail && <div className="section-trail" />}
      {note && <span className="section-note">{note}</span>}
    </div>
  );
}

function App() {
  const now = useClock();
  const canvasRef = useRef(null);
  const projectsSectionRef = useRef(null);
  const tickerTrackRef = useRef(null);

  useParticles(canvasRef);
  useReveal();

  useEffect(() => {
    const section = projectsSectionRef.current;
    const track = tickerTrackRef.current;
    if (!section || !track) {
      return;
    }

    let cleanup = () => {};

    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[data-gsap-src=\"${src}\"]`);
        if (existing) {
          if (existing.dataset.loaded === "true") {
            resolve();
            return;
          }
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), {
            once: true
          });
          return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.dataset.gsapSrc = src;
        script.addEventListener(
          "load",
          () => {
            script.dataset.loaded = "true";
            resolve();
          },
          { once: true }
        );
        script.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), {
          once: true
        });
        document.head.appendChild(script);
      });

    const initTicker = (gsapLib, scrollTriggerLib) => {
      gsapLib.registerPlugin(scrollTriggerLib);
      const ctx = gsapLib.context(() => {
        const distance = Math.max(track.scrollWidth - window.innerWidth + 120, 600);
        gsapLib.fromTo(
          track,
          { x: 0 },
          {
            x: -distance,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: `+=${distance * 1.2}`,
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true
            }
          }
        );
      }, section);

      cleanup = () => ctx.revert();
    };

    const setup = async () => {
      const hasGlobalGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

      if (!hasGlobalGsap) {
        await loadScript("https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/gsap.min.js");
        await loadScript("https://cdn.jsdelivr.net/npm/gsap@3.12.7/dist/ScrollTrigger.min.js");
      }

      if (window.gsap && window.ScrollTrigger) {
        initTicker(window.gsap, window.ScrollTrigger);
      }
    };

    setup();

    return () => cleanup();
  }, []);

  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="app grid-bg">
      <div className="scanlines" aria-hidden="true" />
      <canvas ref={canvasRef} id="particles" aria-hidden="true" />

      <div className="bg-blob top-left" aria-hidden="true" />
      <div className="bg-blob bottom-right" aria-hidden="true" />
      <div className="bg-blob center" aria-hidden="true" />

      <nav className="top-nav">
        <div className="container nav-inner">
          <div className="brand">
            <div className="brand-mark">
              <span>A</span>
            </div>
            <div>
              <p className="brand-title">ASTRILO</p>
              <p className="brand-sub">DEV_PORTFOLIO // v5.0 (REACT)</p>
            </div>
          </div>

          <div className="nav-links">
            {navItems.map(([label, href]) => (
              <a key={href} className="nav-link" href={`#${href}`}>
                {label}
              </a>
            ))}
            <a className="btn btn-outline" href="#contact">
              CONTACT
            </a>
          </div>

          <a className="btn btn-outline nav-mobile" href="#contact">
            CONTACT
          </a>
        </div>
        <div className="top-nav-line" />
      </nav>

      <main>
        <section id="about" className="hero container">
          <div className="hero-grid">
            <div>
              <div className="hero-status fade-up d1">
                <span className="status-pulse" />
                <span>SYSTEM ONLINE // READY FOR DEPLOYMENT</span>
              </div>

              <h1 className="hero-title fade-up d2">
                <span>I&apos;M</span>
                <span className="glitch-text" data-text={profile.name}>
                  {profile.name}
                </span>
              </h1>

              <div className="fade-up d3">
                <div className="hero-role">
                  <div />
                  <span>{profile.role.toUpperCase()}</span>
                </div>
                <p className="hero-copy">
                  I am a college student focused on becoming a strong full-stack developer.
                  I build projects to practice modern web technologies, improve problem-solving,
                  and grow through consistent hands-on learning.
                </p>
              </div>

              <div className="hero-actions fade-up d4">
                <a href="#projects" className="btn btn-primary">
                  <FolderOpen size={16} />
                  VIEW PROJECTS
                </a>
                <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-outline">
                  <Github size={16} />
                  GITHUB
                </a>
              </div>
            </div>

            <aside className="hud-panel corner-decor fade-up d5">
              <div className="panel-top">
                <p>
                  <span className="status-dot" />
                  SYS_INFO.EXE
                </p>
                <span>{now}</span>
              </div>

              <pre className="terminal-meta">{`${profile.name}.SYSTEM\nFULLSTACK_PROFILE\nBUILD_MODE: ACTIVE`}</pre>

              <div className="detail-list">
                <div>
                  <span>ROLE</span>
                  <strong>{profile.role}</strong>
                </div>
                <div>
                  <span>EXPERIENCE</span>
                  <strong>{profile.experience}</strong>
                </div>
                <div>
                  <span>LOCATION</span>
                  <strong>{profile.location}</strong>
                </div>
                <div>
                  <span>STATUS</span>
                  <strong className="highlight">{profile.status}</strong>
                </div>
                <div>
                  <span>STACK</span>
                  <strong>{profile.stack}</strong>
                </div>
              </div>

              <p className="terminal-line">
                <span className="pink">astrilo</span>
                <span>@</span>
                <span className="cyan">dev</span>
                <span>:~$</span>
                <span className="output"> ready_to_build</span>
                <span className="cursor">#</span>
              </p>
            </aside>
          </div>
        </section>

        <section id="projects" className="section projects-ticker" ref={projectsSectionRef}>
          <SectionHeading index="01" title="PROJECTS" accent="magenta" note="// SELECTED_WORK" />

          <div className="projects-ticker-frame">
            <div className="projects-ticker-track" ref={tickerTrackRef}>
              <span className="ticker-word">In every bottle,</span>
              <span className="ticker-icon cyan" aria-hidden="true">
                <Droplets size={24} />
              </span>

              <span className="ticker-word gap-lg">discover the undeniable</span>
              <span className="ticker-word magic">Real Magic</span>

              <svg className="ticker-curve" viewBox="0 0 120 24" aria-hidden="true">
                <path d="M2 12 C28 2, 44 22, 60 12 C76 2, 94 22, 118 12" />
              </svg>

              <span className="ticker-word">of sharing pure</span>
              <span className="ticker-word refresh">Refreshment</span>

              <span className="ticker-icon magenta" aria-hidden="true">
                <Sparkles size={22} />
              </span>

              <span className="ticker-word">that brings us</span>
              <span className="ticker-word together">Together</span>

              <svg className="ticker-curve alt" viewBox="0 0 120 24" aria-hidden="true">
                <path d="M2 12 C20 20, 40 4, 60 12 C80 20, 100 4, 118 12" />
              </svg>

              {projects.map((project) => (
                <a
                  key={project.title}
                  className={`ticker-project-pill ${project.color}`}
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.title}
                  <span>{project.year}</span>
                </a>
              ))}

              <span className="ticker-word tail">and keeps the story moving.</span>
            </div>
          </div>
        </section>

        <section id="experience" className="container section">
          <SectionHeading index="02" title="JOURNEY" accent="yellow" showTrail={false} />

          <div className="timeline">
            {experience.map((item, idx) => (
              <article key={item.role} className={`timeline-item fade-up d${idx + 1}`}>
                <span className={`timeline-dot ${item.color}`} />
                <div className="hud-panel">
                  <div className="timeline-head">
                    <div>
                      <h3>{item.role}</h3>
                      <p className={item.color}>{item.company}</p>
                    </div>
                    <span>{item.period}</span>
                  </div>
                  <p>{item.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="container section">
          <SectionHeading index="03" title="CONNECT" accent="cyan" showTrail={false} />

          <div className="contact-grid">
            <article className="hud-panel corner-decor fade-up d1">
              <p className="contact-title">
                Ready to build something <span>extraordinary</span>?<br />
                Let&apos;s talk.
              </p>
              <p className="contact-copy">
                I am looking for internships, mentorship, and junior-level opportunities where I can
                learn, contribute, and grow as a developer.
              </p>
              <a className="btn btn-primary" href={`mailto:${profile.email}`}>
                <Send size={18} />
                SEND_MESSAGE
              </a>
            </article>

            <article className="hud-panel social-panel fade-up d2">
              <p className="social-label">// SOCIAL_LINKS</p>
              <a href={profile.github} target="_blank" rel="noreferrer" className="social-link cyan">
                <span>
                  <Github size={20} />
                </span>
                <div>
                  <strong>GitHub</strong>
                  <p>github.com/astrilo-monk</p>
                </div>
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="social-link magenta">
                <span>
                  <Linkedin size={20} />
                </span>
                <div>
                  <strong>LinkedIn</strong>
                  <p>linkedin.com/in/astrilo</p>
                </div>
              </a>
            </article>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <p>
            <span className="magenta">(c)</span> {year} {profile.name} <span>// ALL SYSTEMS NOMINAL</span>
          </p>
          <p>
            BUILT WITH <span className="cyan">HEART</span> AND <span className="magenta">CAFFEINE</span>
            <span className="separator">|</span>
            <span>UPTIME: {now}</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
