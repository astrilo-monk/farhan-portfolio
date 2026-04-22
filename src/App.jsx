import { useEffect, useMemo, useRef, useState } from "react";
import {
  BrainCircuit,
  Cloud,
  FolderOpen,
  Github,
  Linkedin,
  Monitor,
  Send,
  Server,
  Terminal
} from "lucide-react";

const profile = {
  name: "ASTRILO",
  role: "Full-Stack Developer",
  experience: "6+ Years",
  location: "Earth // Remote",
  status: "Open to Opportunities",
  stack: "React / Node / Python / AWS",
  github: "https://github.com/astrilo-monk",
  linkedin: "https://www.linkedin.com/in/astrilo/",
  email: "astrilo@dev.io"
};

const projects = [
  {
    title: "CloudSync Platform",
    year: "2024",
    description:
      "Real-time collaborative workspace with WebSocket integration, multi-tenant architecture, and automated CI/CD deployment pipelines.",
    tags: ["React", "Node.js", "PostgreSQL", "Docker"],
    icon: Cloud,
    color: "cyan"
  },
  {
    title: "DataPipe CLI",
    year: "2024",
    description:
      "High-performance ETL command-line tool for transforming and routing data streams between databases, APIs, and file systems.",
    tags: ["Python", "Redis", "Kafka"],
    icon: Terminal,
    color: "magenta"
  },
  {
    title: "NeuralDash",
    year: "2023",
    description:
      "ML model monitoring dashboard with real-time metrics, drift detection, and automated alerting for production machine learning systems.",
    tags: ["TypeScript", "Next.js", "TensorFlow"],
    icon: BrainCircuit,
    color: "yellow"
  }
];

const skillGroups = [
  {
    title: "FRONTEND_SYSTEMS",
    icon: Monitor,
    color: "cyan",
    items: [
      { name: "JavaScript / TypeScript", percent: 92 },
      { name: "React / Next.js", percent: 88 },
      { name: "CSS / Tailwind / Animations", percent: 85 }
    ]
  },
  {
    title: "BACKEND_SYSTEMS",
    icon: Server,
    color: "magenta",
    items: [
      { name: "Node.js / Express", percent: 90 },
      { name: "Python / FastAPI", percent: 85 },
      { name: "PostgreSQL / MongoDB", percent: 82 }
    ]
  }
];

const experience = [
  {
    role: "Senior Full-Stack Developer",
    company: "TechCorp Inc.",
    period: "2022 -> PRESENT",
    summary:
      "Led architecture of microservices platform serving 2M+ users. Reduced API latency by 40% through caching strategies and query optimization.",
    color: "cyan"
  },
  {
    role: "Full-Stack Developer",
    company: "DataFlow Systems",
    period: "2020 -> 2022",
    summary:
      "Built real-time data visualization dashboards with React and D3.js. Designed RESTful APIs and implemented automated testing pipelines with high code coverage.",
    color: "magenta"
  }
];

const navItems = [
  ["ABOUT", "about"],
  ["PROJECTS", "projects"],
  ["SKILLS", "skills"],
  ["EXPERIENCE", "experience"]
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

  useParticles(canvasRef);
  useReveal();

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
                  Architecting scalable systems and crafting high-performance web applications.
                  From pixel-perfect interfaces to distributed backends, I build across the
                  entire stack with precision and purpose.
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

        <section id="projects" className="container section">
          <SectionHeading index="01" title="PROJECTS" accent="magenta" note="// SELECTED_WORK" />

          <div className="projects-grid">
            {projects.map((project, idx) => {
              const Icon = project.icon;
              return (
                <article key={project.title} className={`hud-panel corner-decor project-card fade-up d${idx + 1}`}>
                  <div className="project-head">
                    <div className={`hex-badge ${project.color}`}>
                      <Icon size={20} />
                    </div>
                    <span>{project.year}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="tag-row">
                    {project.tags.map((tag) => (
                      <span key={tag} className={`tag ${project.color}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="skills" className="container section">
          <SectionHeading index="02" title="TECH STACK" accent="cyan" showTrail />

          <div className="skills-grid">
            {skillGroups.map((group, idx) => {
              const Icon = group.icon;
              return (
                <article key={group.title} className={`hud-panel corner-decor fade-up d${idx + 1}`}>
                  <div className="skills-head">
                    <Icon size={14} />
                    <span className={group.color}>{group.title}</span>
                  </div>

                  <div className="bar-list">
                    {group.items.map((item) => (
                      <div key={item.name}>
                        <div className="bar-meta">
                          <span>{item.name}</span>
                          <strong className={group.color}>{item.percent}%</strong>
                        </div>
                        <div className="bar-track">
                          <div className={`bar-fill ${group.color}`} style={{ width: `${item.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="experience" className="container section">
          <SectionHeading index="03" title="EXPERIENCE" accent="yellow" showTrail={false} />

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
          <SectionHeading index="04" title="CONNECT" accent="cyan" showTrail={false} />

          <div className="contact-grid">
            <article className="hud-panel corner-decor fade-up d1">
              <p className="contact-title">
                Ready to build something <span>extraordinary</span>?<br />
                Let&apos;s talk.
              </p>
              <p className="contact-copy">
                I am always open to discussing new projects, creative ideas, or opportunities to be
                part of something ambitious.
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
