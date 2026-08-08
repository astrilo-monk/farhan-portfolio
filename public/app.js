const { useEffect, useMemo, useRef, useState } = React;
const { motion } = window.Motion;

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
    icon: "terminal",
    repo: "https://github.com/astrilo-monk/ascii-art-js",
    live: "https://ascii-art-liart.vercel.app"
  },
  {
    title: "code-tracer",
    year: "2026",
    description:
      "A tool-focused project for tracing and understanding code flow, useful for debugging and learning.",
    tags: ["Developer Tools", "Debugging", "JavaScript"],
    icon: "monitor",
    repo: "https://github.com/astrilo-monk/code-tracer",
    live: "https://code-tracer-liart.vercel.app/"
  },
  {
    title: "saarthi",
    year: "2025",
    description:
      "An assistant-style application focused on helping users with guided interactions and practical workflows.",
    tags: ["App Development", "UX", "JavaScript"],
    icon: "cloud",
    repo: "https://github.com/astrilo-monk/saarthi",
    live: "https://saarthi-astrilo-monk.vercel.app/"
  },
  {
    title: "emotion-tracker",
    year: "2025",
    description:
      "A project for tracking and visualizing emotional trends and user input patterns over time.",
    tags: ["Tracking", "Data", "Visualization"],
    icon: "brain",
    repo: "https://github.com/astrilo-monk/emotion-tracker"
  },
  {
    title: "repl",
    year: "2025",
    description:
      "An interactive REPL-style project for running and testing code snippets in a quick feedback loop.",
    tags: ["REPL", "Tooling", "Learning"],
    icon: "server",
    repo: "https://github.com/astrilo-monk/repl"
  },
  {
    title: "http-server-java",
    year: "2026",
    description:
      "A Java-based HTTP server project focused on backend fundamentals, request handling, and server-side architecture.",
    tags: ["Java", "HTTP", "Backend"],
    icon: "server",
    repo: "https://github.com/astrilo-monk/http-server-java"
  }
];

const highlightProjects = ["ascii-art-js", "code-tracer", "saarthi"]
  .map((title) => projects.find((project) => project.title === title))
  .filter(Boolean);

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
    summary: (
      <>
        Joined the technical team and helped build features for the main{' '}
        <a
          className="timeline-link cyan"
          href="https://gdgbppimt.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          GDG website
        </a>
        . Currently contributing as a junior member.
      </>
    ),
    color: "cyan"
  }
];

const navItems = [
  { label: "ABOUT", href: "#about" },
  { label: "FOCUS", href: "#focus" },
  { label: "PROJECTS", href: "#projects" },
  { label: "WORKFLOW", href: "#workflow" },
  { label: "JOURNEY", href: "#experience" },
  { label: "CONNECT", href: "#contact" }
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

function ArrowUpRightIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M7 17L17 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 7h10v10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M6 4L20 12L6 20L6 4Z" />
    </svg>
  );
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

function SectionFade({ delay = 0, className = "", children }) {
  return (
    <motion.div
      initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
      animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function GlassVideo({ src, className, style }) {
  const videoRef = useRef(null);
  const rafRef = useRef(0);
  const fadingOutRef = useRef(false);
  const resetTimerRef = useRef(null);

  const fadeTo = (target, duration = 500) => {
    const video = videoRef.current;
    if (!video) return;

    cancelAnimationFrame(rafRef.current);
    const startOpacity = Number.parseFloat(video.style.opacity || "0") || 0;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = startOpacity + (target - startOpacity) * progress;
      video.style.opacity = String(value);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const handleLoadedData = () => {
      video.style.opacity = "0";
      const playResult = video.play();
      if (playResult && typeof playResult.catch === "function") {
        playResult.catch(() => {});
      }
      fadeTo(1);
    };

    const handleTimeUpdate = () => {
      if (fadingOutRef.current || video.duration <= 0) return;
      const remaining = video.duration - video.currentTime;
      if (remaining > 0 && remaining <= 0.55) {
        fadingOutRef.current = true;
        fadeTo(0);
      }
    };

    const handleEnded = () => {
      video.style.opacity = "0";
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = window.setTimeout(() => {
        video.currentTime = 0;
        const playResult = video.play();
        if (playResult && typeof playResult.catch === "function") {
          playResult.catch(() => {});
        }
        fadingOutRef.current = false;
        fadeTo(1);
      }, 100);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    if (video.readyState >= 2) {
      handleLoadedData();
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      preload="auto"
      loop={false}
      className={className}
      style={{ opacity: 0, ...style }}
      src={src}
    />
  );
}

function BlurText({ text, className = "" }) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const words = useMemo(() => text.split(/\s+/), [text]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <p
      ref={containerRef}
      className={className}
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", rowGap: "0.1em" }}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
          animate={
            isVisible
              ? {
                  filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
                  opacity: [0, 0.5, 1],
                  y: [50, -5, 0]
                }
              : undefined
          }
          transition={{ duration: 0.7, times: [0, 0.5, 1], ease: "easeOut", delay: (index * 100) / 1000 }}
          style={{ display: "inline-block", marginRight: "0.28em" }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

function Icon({ name, className = "" }) {
  const paths = {
    terminal: "M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21H5Zm1-4h12l-3.75-5-3 4L9 13l-3 4Z",
    monitor: "M4 6.47 5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.89-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4Z",
    cloud: "M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1Zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7Z",
    brain: "M12 2C8 2 5 5 5 9c0 1.6.5 3.1 1.4 4.3-.3.7-.4 1.4-.4 2.2 0 2.8 2.2 5 5 5h1v-2h-1c-1.7 0-3-1.3-3-3 0-.4.1-.8.2-1.2l.4-1.2-.9-.8C6.5 11.2 6 10.2 6 9c0-2.8 2.2-5 5-5s5 2.2 5 5v2h2V9c0-4-3-7-6-7Zm5 8c-.8 0-1.5.3-2 .8-.5-.5-1.2-.8-2-.8-1.7 0-3 1.3-3 3v8h2v-8c0-.6.4-1 1-1s1 .4 1 1v8h2v-8c0-.6.4-1 1-1s1 .4 1 1v8h2v-8c0-1.7-1.3-3-3-3Z",
    server: "M4 6.47 5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.89-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4Z"
  };

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d={paths[name]} />
    </svg>
  );
}

function ProjectIcon({ name, className = "" }) {
  return <Icon name={name} className={className} />;
}

function Navbar() {
  return (
    <motion.nav
      initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
      animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
      className="fixed left-0 right-0 top-4 z-50 px-8 lg:px-16"
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
        <a
          href="#about"
          className="liquid-glass flex h-12 w-12 items-center justify-center rounded-full font-heading text-2xl italic text-white"
          aria-label="Go to about"
        >
          a
        </a>

        <div className="liquid-glass hidden items-center rounded-full p-1.5 lg:flex">
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="rounded-full px-3 py-2 text-sm font-medium text-white/90 font-body">
                {item.label}
              </a>
            ))}
          </div>
          <a href="#contact" className="ml-1 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-black">
            Connect
            <ArrowUpRightIcon className="h-4 w-4" />
          </a>
        </div>

        <div className="h-12 w-12" aria-hidden="true" />
      </div>
    </motion.nav>
  );
}

function HeroSection({ now }) {
  return (
    <section id="about" className="relative min-h-screen overflow-hidden bg-black">
      <GlassVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4"
        className="absolute left-1/2 top-0 z-0 -translate-x-1/2 object-cover object-top"
        style={{ width: "120%", height: "120%" }}
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <div className="flex flex-1 items-center justify-center px-4 pt-24">
          <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.4fr_0.9fr]">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <SectionFade delay={0.35} className="mb-7">
                <div className="liquid-glass inline-flex items-center gap-2 rounded-full p-1.5">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">Open</span>
                  <span className="pr-3 text-sm text-white/90">Portfolio, projects, journey and opportunities</span>
                </div>
              </SectionFade>

              <SectionFade delay={0.5}>
                <BlurText
                  text="Building Interfaces, Projects, and a Developer Journey"
                  className="mx-auto max-w-3xl justify-center text-5xl leading-[0.82] tracking-[-4px] text-white md:text-6xl lg:text-[5.2rem] font-heading italic lg:mx-0 lg:justify-start"
                />
              </SectionFade>

              <SectionFade delay={0.75} className="mt-4">
                <p className="mx-auto max-w-2xl text-sm font-light leading-tight text-white md:text-base font-body lg:mx-0">
                  I am a college student developer focused on building practical, polished web projects, learning consistently, and growing toward frontend and full-stack roles.
                </p>
              </SectionFade>

              <SectionFade delay={1.05} className="mt-6">
                <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                  <a href="#projects" className="liquid-glass-strong inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white">
                    View Projects
                    <ArrowUpRightIcon className="h-5 w-5" />
                  </a>

                  <a href="#experience" className="inline-flex items-center gap-2 text-sm font-medium text-white/90 font-body">
                    <PlayIcon className="h-4 w-4" />
                    See Journey
                  </a>
                </div>
              </SectionFade>

              <SectionFade delay={1.25} className="mt-8">
                <div className="flex flex-wrap items-stretch justify-center gap-4 lg:justify-start">
                  <div className="liquid-glass rounded-[1.25rem] p-5 text-left w-[220px]">
                    <div className="flex h-7 w-7 items-center justify-center text-white">
                      <Icon name="terminal" className="h-7 w-7" />
                    </div>
                    <div className="mt-8 font-heading text-4xl italic leading-none tracking-[-1px] text-white">6+</div>
                    <div className="mt-2 text-xs font-light text-white font-body">Featured Projects</div>
                  </div>
                  <div className="liquid-glass rounded-[1.25rem] p-5 text-left w-[220px]">
                    <div className="flex h-7 w-7 items-center justify-center text-white">
                      <Icon name="brain" className="h-7 w-7" />
                    </div>
                    <div className="mt-8 font-heading text-4xl italic leading-none tracking-[-1px] text-white">3</div>
                    <div className="mt-2 text-xs font-light text-white font-body">Major Learning Tracks</div>
                  </div>
                </div>
              </SectionFade>
            </div>

            <aside className="liquid-glass-strong corner-decor fade-up hidden self-end p-6 lg:block">
              <div className="panel-top flex items-center justify-between text-xs text-white/80">
                <p>
                  <span className="status-dot" />
                  SYSTEM INFO
                </p>
                <span>{now}</span>
              </div>

              <pre className="terminal-meta">{`${profile.name}.SYSTEM\nPORTFOLIO_PROFILE\nBUILD_MODE: ACTIVE`}</pre>

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
        </div>

        <SectionFade delay={1.35} className="pb-8">
          <div className="flex flex-col items-center gap-4">
            <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white">
              Building projects, learning systems, and looking for the right opportunity
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-3 md:gap-x-16">
              {[
                profile.github,
                profile.linkedin,
                profile.leetcode
              ].map((item, index) => (
                <a
                  key={item}
                  href={item}
                  target="_blank"
                  rel="noreferrer"
                  className="font-heading text-2xl italic tracking-tight text-white md:text-3xl"
                >
                  {index === 0 ? "GitHub" : index === 1 ? "LinkedIn" : "LeetCode"}
                </a>
              ))}
            </div>
          </div>
        </SectionFade>
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="relative min-h-screen overflow-hidden bg-black">
      <GlassVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />

      <div className="relative z-10 flex min-h-screen flex-col px-8 pt-24 pb-10 md:px-16 lg:px-20">
        <div className="mb-auto">
          <SectionFade delay={0.15}>
            <p className="mb-6 text-sm font-body text-white/80">// Projects</p>
            <h2 className="max-w-4xl font-heading text-6xl italic leading-[0.9] tracking-[-3px] text-white md:text-7xl lg:text-[6rem]">
              Selected
              <br />
              work
            </h2>
          </SectionFade>

          <SectionFade delay={0.5}>
            <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
              {projects.slice(0, 3).map((project) => (
                <article key={project.title} className="liquid-glass rounded-[1.25rem] p-6 min-h-[360px] flex flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="liquid-glass flex h-11 w-11 items-center justify-center rounded-[0.75rem] text-white">
                      <ProjectIcon name={project.icon} className="h-6 w-6" />
                    </div>

                    <div className="flex max-w-[70%] flex-wrap justify-end gap-1.5">
                      {project.tags.map((tag) => (
                        <span key={tag} className="liquid-glass rounded-full px-3 py-1 text-[11px] whitespace-nowrap text-white/90 font-body">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1" />

                  <div>
                    <div className="flex items-center justify-between gap-4 text-xs text-white/70 font-body">
                      <span>{project.year}</span>
                      <span>{project.title}</span>
                    </div>
                    <h3 className="mt-3 font-heading text-3xl italic leading-none tracking-[-1px] text-white md:text-4xl">
                      {project.title}
                    </h3>
                    <p className="mt-3 max-w-[32ch] text-sm leading-snug text-white/90 font-body font-light">
                      {project.description}
                    </p>

                    <div className="mt-6 flex items-center gap-4">
                      <a className="text-sm font-medium text-white underline underline-offset-4" href={project.repo} target="_blank" rel="noreferrer">
                        Repo
                      </a>
                      {project.live && (
                        <a className="text-sm font-medium text-white/90 underline underline-offset-4" href={project.live} target="_blank" rel="noreferrer">
                          Live
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </SectionFade>
        </div>
      </div>
    </section>
  );
}

function FocusSection() {
  return (
    <section id="focus" className="relative min-h-screen overflow-hidden bg-black">
      <GlassVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4"
        className="absolute inset-0 z-0 h-full w-full object-cover object-top"
      />

      <div className="relative z-10 flex min-h-screen flex-col px-8 pt-24 pb-10 md:px-16 lg:px-20">
        <div className="mb-auto flex min-h-screen flex-col justify-center">
          <SectionFade delay={0.12}>
            <p className="mb-6 text-sm font-body text-white/80">// Focus</p>
            <h2 className="max-w-4xl font-heading text-6xl italic leading-[0.9] tracking-[-3px] text-white md:text-7xl lg:text-[6rem]">
              What I&apos;m
              <br />
              building now
            </h2>
          </SectionFade>

          <SectionFade delay={0.42}>
            <p className="mt-6 max-w-2xl text-sm leading-snug text-white/90 font-body font-light md:text-base">
              I am sharpening frontend polish, backend basics, and project consistency so my portfolio shows both creativity and practical engineering.
            </p>
          </SectionFade>

          <SectionFade delay={0.65}>
            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  title: "Frontend Craft",
                  body: "Animation, layout, and visual hierarchy with a focus on clarity and a strong first impression."
                },
                {
                  title: "Backend Depth",
                  body: "Working through APIs, server logic, and core problem solving to balance polished UI with solid logic."
                },
                {
                  title: "Portfolio Growth",
                  body: "Turning experiments into presentable projects so the work reads as a real journey rather than a checklist."
                }
              ].map((item) => (
                <article key={item.title} className="liquid-glass rounded-[1.25rem] p-6 min-h-[280px] flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-white/20 px-3 py-1 text-[11px] text-white/80 font-body">Background Page</span>
                    <span className="font-heading text-2xl italic text-white">0{item.title.length % 3 + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-heading text-3xl italic leading-none tracking-[-1px] text-white md:text-4xl">{item.title}</h3>
                    <p className="mt-3 max-w-[28ch] text-sm leading-snug text-white/90 font-body font-light">{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </SectionFade>
        </div>
      </div>
    </section>
  );
}

function WorkflowSection() {
  return (
    <section id="workflow" className="relative min-h-screen overflow-hidden bg-black">
      <GlassVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4"
        className="absolute inset-0 z-0 h-full w-full object-cover object-center"
      />

      <div className="relative z-10 flex min-h-screen flex-col px-8 pt-24 pb-10 md:px-16 lg:px-20">
        <div className="mb-auto flex min-h-screen flex-col justify-center">
          <SectionFade delay={0.12}>
            <p className="mb-6 text-sm font-body text-white/80">// Workflow</p>
            <h2 className="max-w-4xl font-heading text-6xl italic leading-[0.9] tracking-[-3px] text-white md:text-7xl lg:text-[6rem]">
              How I
              <br />
              ship work
            </h2>
          </SectionFade>

          <SectionFade delay={0.42}>
            <p className="mt-6 max-w-2xl text-sm leading-snug text-white/90 font-body font-light md:text-base">
              I like projects that show process, not just outcomes. Clean code, repeatable steps, and a visible journey make the portfolio feel more real.
            </p>
          </SectionFade>

          <SectionFade delay={0.65}>
            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  title: "Build in Layers",
                  body: "Start with the core experience, then refine motion, polish, and responsiveness until the page feels intentional."
                },
                {
                  title: "Iterate Publicly",
                  body: "Keep shipping versions and improvements so the work itself shows progression and learning over time."
                },
                {
                  title: "Connect It All",
                  body: "Tie projects, journey, and contact into one system so every section supports the same story."
                }
              ].map((item) => (
                <article key={item.title} className="liquid-glass rounded-[1.25rem] p-6 min-h-[280px] flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-white/20 px-3 py-1 text-[11px] text-white/80 font-body">Background Page</span>
                    <span className="font-heading text-2xl italic text-white">0{item.title.length % 4 + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-heading text-3xl italic leading-none tracking-[-1px] text-white md:text-4xl">{item.title}</h3>
                    <p className="mt-3 max-w-[28ch] text-sm leading-snug text-white/90 font-body font-light">{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </SectionFade>
        </div>
      </div>
    </section>
  );
}

function JourneySection() {
  return (
    <section id="experience" className="relative min-h-screen overflow-hidden bg-black">
      <GlassVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4"
        className="absolute inset-0 z-0 h-full w-full object-cover object-top"
      />

      <div className="relative z-10 flex min-h-screen flex-col px-8 pt-24 pb-10 md:px-16 lg:px-20">
        <div className="mb-auto flex min-h-screen flex-col justify-center">
          <SectionFade delay={0.15}>
            <p className="mb-6 text-sm font-body text-white/80">// Journey</p>
            <h2 className="max-w-4xl font-heading text-6xl italic leading-[0.9] tracking-[-3px] text-white md:text-7xl lg:text-[6rem]">
              Learning
              <br />
              in public
            </h2>
          </SectionFade>

          <SectionFade delay={0.4}>
            <p className="mt-6 max-w-2xl text-sm leading-snug text-white/90 font-body font-light md:text-base">
              The story here is not a finished career, it is a visible process. Every class, project, and collaboration is part of that progression.
            </p>
          </SectionFade>

          <SectionFade delay={0.65}>
            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
              {experience.map((item, idx) => {
                return (
                  <article key={item.role} className="liquid-glass rounded-[1.25rem] p-6 min-h-[320px] flex flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="liquid-glass flex h-11 w-11 items-center justify-center rounded-[0.75rem] text-white">
                        <ProjectIcon name={idx === 0 ? "brain" : idx === 1 ? "terminal" : "cloud"} className="h-6 w-6" />
                      </div>

                      <span className="rounded-full border border-white/20 px-3 py-1 text-[11px] text-white/80 font-body">
                        {item.period}
                      </span>
                    </div>

                    <div className="flex-1" />

                    <div>
                      <h3 className="font-heading text-3xl italic leading-none tracking-[-1px] text-white md:text-4xl">
                        {item.role}
                      </h3>
                      <p className={`mt-3 text-sm font-medium ${item.color}`}>{item.company}</p>
                      <p className="mt-3 max-w-[32ch] text-sm leading-snug text-white/90 font-body font-light">
                        {item.summary}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </SectionFade>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const contactAction = useMemo(() => `https://formsubmit.co/${profile.email}`, []);

  return (
    <section id="contact" className="relative min-h-screen overflow-hidden bg-black">
      <GlassVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />

      <div className="relative z-10 flex min-h-screen flex-col px-8 pt-24 pb-10 md:px-16 lg:px-20">
        <div className="mb-auto flex min-h-screen flex-col justify-center">
          <SectionFade delay={0.15}>
            <p className="mb-6 text-sm font-body text-white/80">// Connect</p>
            <h2 className="max-w-4xl font-heading text-6xl italic leading-[0.9] tracking-[-3px] text-white md:text-7xl lg:text-[6rem]">
              Let&apos;s
              <br />
              build something
            </h2>
          </SectionFade>

          <SectionFade delay={0.4}>
            <p className="mt-6 max-w-2xl text-sm leading-snug text-white/90 font-body font-light md:text-base">
              If the work feels aligned, the next step should be simple. Reach out and let&apos;s turn the portfolio into a real conversation.
            </p>
          </SectionFade>

          <SectionFade delay={0.65}>
            <div className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <article className="liquid-glass-strong corner-decor p-6">
              <p className="contact-title">
                Ready to build something <span>extraordinary</span>?<br />
                Let&apos;s talk.
              </p>
              <p className="contact-copy">
                I am looking for internships, mentorship, and junior-level opportunities where I can learn, contribute, and grow as a developer.
              </p>

              <div className="contact-quick-actions">
                <a className="quick-chip" href={`mailto:${profile.email}`}>
                  <span>EMAIL DIRECT</span>
                </a>
                <a className="quick-chip" href={profile.resume} target="_blank" rel="noreferrer" download>
                  <span>DOWNLOAD RESUME</span>
                </a>
              </div>

              <form className="contact-form" action={contactAction} method="POST">
                <input type="hidden" name="_subject" value="New Portfolio Message" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />

                <div className="contact-row">
                  <input className="contact-input" type="text" name="name" placeholder="Your name" required />
                  <input className="contact-input" type="email" name="email" placeholder="Your email" required />
                </div>

                <textarea className="contact-textarea" name="message" rows="5" placeholder="Tell me about your project or opportunity" required />

                <button className="btn btn-primary" type="submit">
                  <ArrowUpRightIcon className="h-4 w-4" />
                  SEND MESSAGE
                </button>
              </form>
              </article>

              <article className="liquid-glass corner-decor p-6">
              <div className="panel-top flex items-center justify-between text-xs text-white/80">
                <p>
                  <span className="status-dot" />
                  SOCIAL LINKS
                </p>
              </div>

              <div className="grid gap-4 pt-4">
                {[
                  { label: "GitHub", href: profile.github },
                  { label: "LinkedIn", href: profile.linkedin },
                  { label: "LeetCode", href: profile.leetcode }
                ].map((link) => (
                  <a key={link.label} className="liquid-glass rounded-[1rem] px-4 py-4 text-white" href={link.href} target="_blank" rel="noreferrer">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-heading text-2xl italic">{link.label}</span>
                      <ArrowUpRightIcon className="h-4 w-4" />
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-6 rounded-[1rem] border border-white/10 p-4 text-sm text-white/80 font-body">
                <p className="mb-2 text-white">Quick profile</p>
                <p>Role: {profile.role}</p>
                <p>Status: {profile.status}</p>
                <p>Stack: {profile.stack}</p>
              </div>
              </article>
            </div>
          </SectionFade>
        </div>
      </div>
    </section>
  );
}

function App() {
  const now = useClock();
  useReveal();

  useEffect(() => {
    document.title = `${profile.name} // Portfolio`;
  }, []);

  return (
    <main className="app min-h-screen bg-black text-white font-body">
      <HeroSection now={now} />
      <FocusSection />
      <ProjectsSection />
      <WorkflowSection />
      <JourneySection />
      <ContactSection />
    </main>
  );
}

window.App = App;

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
