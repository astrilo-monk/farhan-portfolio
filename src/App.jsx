import { useEffect, useMemo, useState } from "react";
import {
  BrainCircuit,
  Check,
  Code2,
  Copy,
  Cloud,
  FileText,
  FolderOpen,
  Github,
  Linkedin,
  Mail,
  Monitor,
  Send,
  Server,
  Terminal
} from "lucide-react";
import ForceFieldBackground from "./components/ForceFieldBackground";
import SkillsRadar from "./components/SkillsRadar";

const profile = {
  name: "ASTRILO",
  realName: "MD OWAIS FARHAN AKHTER",
  role: "College Student Developer",
  experience: "No Professional Experience Yet",
  location: "Anywhere in India (passport applied)",
  status: "Open to Internships",
  stack: "React / Node / Python / Java",
  github: "https://github.com/astrilo-monk",
  linkedin: "https://www.linkedin.com/in/astrilo/",
  leetcode: "https://leetcode.com/u/CelestialRadiant/",
  resume: "/Farhan_Akhter_Resume.pdf",
  email: "mdowaisfarhanakhter561@gmail.com"
};

const projects = [
  {
    title: "ascii-art-js",
    year: "2026",
    description:
      "A JavaScript project for generating and experimenting with ASCII art output in the browser.",
    tags: ["JavaScript", "Frontend", "Creative Coding"],
    icon: Terminal,
    repo: "https://github.com/astrilo-monk/ascii-art-js",
    live: "https://ascii-art-liart.vercel.app",
    color: "cyan"
  },
  {
    title: "code-tracer",
    year: "2026",
    description:
      "A tool-focused project for tracing and understanding code flow, useful for debugging and learning.",
    tags: ["Developer Tools", "Debugging", "JavaScript"],
    icon: Monitor,
    repo: "https://github.com/astrilo-monk/code-tracer",
    live: "https://code-tracer-liart.vercel.app/",
    color: "magenta"
  },
  {
    title: "saarthi",
    year: "2025",
    description:
      "An assistant-style application focused on helping users with guided interactions and practical workflows.",
    tags: ["App Development", "UX", "JavaScript"],
    icon: Cloud,
    repo: "https://github.com/astrilo-monk/saarthi",
    live: "https://saarthi-astrilo-monk.vercel.app/",
    color: "yellow"
  },
  {
    title: "emotion-tracker",
    year: "2025",
    description:
      "A project for tracking and visualizing emotional trends and user input patterns over time.",
    tags: ["Tracking", "Data", "Visualization"],
    icon: BrainCircuit,
    repo: "https://github.com/astrilo-monk/emotion-tracker",
    color: "cyan"
  },
  {
    title: "repl",
    year: "2025",
    description:
      "An interactive REPL-style project for running and testing code snippets in a quick feedback loop.",
    tags: ["REPL", "Tooling", "Learning"],
    icon: Server,
    repo: "https://github.com/astrilo-monk/repl",
    color: "yellow"
  },
  {
    title: "http-server-java",
    year: "2026",
    description:
      "A Java-based HTTP server project focused on backend fundamentals, request handling, and server-side architecture.",
    tags: ["Java", "HTTP", "Backend"],
    icon: Server,
    repo: "https://github.com/astrilo-monk/http-server-java",
    color: "magenta"
  }
];

const experience = [

  {
    role: "BTech Student (CSE)",
    company: "BP Poddar Institute of Management and Technology",
    period: "2024-2028",
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
  },
  {
    role: "Junior Member, Technical Team",
    company: "Google Developer Groups (GDG) BPPIMT",
    period: "September 2025 - Present",
    summary:
      "Joined the technical team and helped build features for the main GDG website (https://gdgbppimt.vercel.app/). Currently contributing as a junior member.",
    color: "cyan"
  }
];

const navItems = [
  ["ABOUT", "about"],
  ["PROJECTS", "projects"],
  ["SKILLS", "skills"],
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
  const [copiedEmail, setCopiedEmail] = useState(false);

  useReveal();

  const year = useMemo(() => new Date().getFullYear(), []);
  const contactAction = useMemo(() => `https://formsubmit.co/${profile.email}`, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 1800);
    } catch {
      setCopiedEmail(false);
    }
  };

  return (
    <div className="app grid-bg">
      <div className="force-field-layer" aria-hidden="true">
        <ForceFieldBackground
          hue={210}
          saturation={100}
          spacing={12}
          density={0.9}
          minStroke={1.4}
          maxStroke={3.4}
          forceStrength={14}
          magnifierRadius={160}
          friction={0.9}
          restoreSpeed={0.05}
        />
      </div>
      <div className="scanlines" aria-hidden="true" />

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
                <span className="glitch-text" data-text={profile.realName} style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)', marginTop: '0.2rem' }}>
                  {profile.realName}
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
                <a href={profile.resume} target="_blank" rel="noreferrer" className="btn btn-outline">
                  <FileText size={16} />
                  RESUME
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
                  <div className="project-links">
                    <a className="project-link" href={project.repo} target="_blank" rel="noreferrer">
                      OPEN REPO
                    </a>
                    {project.live && (
                      <a className="project-link live" href={project.live} target="_blank" rel="noreferrer">
                        OPEN LIVE
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="skills" className="container section">
          <SectionHeading index="01.5" title="SKILLS" accent="cyan" note="// DATA_VISUALIZATION" showTrail={true} />
          
          <div className="skills-grid" style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <div style={{ maxWidth: '600px', width: '100%' }}>
              <SkillsRadar />
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

              <div className="contact-quick-actions">
                <a className="quick-chip" href={`mailto:${profile.email}`}>
                  <Mail size={14} />
                  EMAIL DIRECT
                </a>
                <a className="quick-chip" href={profile.resume} target="_blank" rel="noreferrer">
                  <FileText size={14} />
                  RESUME
                </a>
                <button className="quick-chip ghost" type="button" onClick={handleCopyEmail}>
                  {copiedEmail ? <Check size={14} /> : <Copy size={14} />}
                  {copiedEmail ? "EMAIL COPIED" : "COPY EMAIL"}
                </button>
              </div>

              <form className="contact-form" action={contactAction} method="POST">
                <input type="hidden" name="_subject" value="New Portfolio Message" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />

                <div className="contact-row">
                  <input
                    className="contact-input"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                  />
                  <input
                    className="contact-input"
                    type="email"
                    name="email"
                    placeholder="Your email"
                    required
                  />
                </div>
                <textarea
                  className="contact-input contact-textarea"
                  name="message"
                  placeholder="Tell me about your project or opportunity"
                  rows={4}
                  required
                />

                <div className="contact-actions-row">
                  <button className="btn btn-primary send-btn" type="submit">
                    <Send size={18} />
                    SEND MESSAGE
                  </button>
                  <p className="contact-note">Replies usually within 24 hours.</p>
                </div>
              </form>

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
              <a href={profile.leetcode} target="_blank" rel="noreferrer" className="social-link gold leetcode-card">
                <span>
                  <Code2 size={20} />
                </span>
                <div>
                  <strong>LeetCode</strong>
                  <p>leetcode.com/u/CelestialRadiant</p>
                </div>
              </a>
              
              <div style={{ marginTop: '2.5rem', textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <strong style={{ color: '#ffffff', fontSize: '1.1rem', letterSpacing: '0.05em', textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>
                  (HIRE ME TO UNLOCK MY TRUE POTENTIAL)
                </strong>
              </div>
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
