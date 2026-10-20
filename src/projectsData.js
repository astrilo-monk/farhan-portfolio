import {
  BookOpen,
  Building2,
  Code2,
  Cpu,
  Crown,
  Gauge,
  HeartPulse,
  LayoutDashboard,
  ListChecks,
  Linkedin,
  Lock,
  Monitor,
  Server,
  ShieldCheck,
  Terminal,
  Timer,
  CloudSun,
  BrainCircuit
} from "lucide-react";

const gh = (repo) => `https://github.com/astrilo-monk/${repo}`;

// Order here is the order shown on the "all projects" page.
// The first five (see `featuredTitles`) are the cards on the home page.
export const projects = [
  {
    title: "netauditai",
    year: "2026",
    description:
      "Network config security auditor built for Smart India Hackathon 2026 (NTRO). Runs 24 security checks on router, switch and firewall configs and cites the exact config line behind every finding.",
    tags: ["Cybersecurity", "FastAPI", "SIH 2026"],
    icon: ShieldCheck,
    repo: gh("sih-26155"),
    live: "https://netaudit-three.vercel.app/",
    color: "cyan"
  },
  {
    title: "code-tracer",
    year: "2026",
    description:
      "Step-by-step code execution visualizer with memory and pointer views, plain-English explanations and a beginner mode.",
    tags: ["Developer Tools", "Visualization", "AI"],
    icon: Monitor,
    repo: gh("code-tracer-guide"),
    repoLabel: "OPEN GUIDE",
    live: "https://code-tracer-liart.vercel.app/",
    color: "magenta"
  },
  {
    title: "emotion-tracker",
    year: "2025",
    description:
      "Facial analysis with DeepFace for emotion, age and gender, with real-time webcam, batch image and Flask web modes.",
    tags: ["Python", "Computer Vision", "Flask"],
    icon: BrainCircuit,
    repo: gh("emotion-tracker"),
    color: "yellow"
  },
  {
    title: "chess-assist",
    year: "2026",
    description:
      "Chess engine written from scratch plus a coach that explains your blunders in plain English. Built for an AI course.",
    tags: ["Python", "AI", "Streamlit"],
    icon: Crown,
    repo: gh("chess-assist"),
    live: "https://chessassist.streamlit.app/",
    color: "cyan"
  },
  {
    title: "saarthi",
    year: "2025",
    description:
      "Mental health support platform for college students: AI chat with crisis detection, anonymous counselor booking, peer forum and wellness tracking.",
    tags: ["Astro", "React", "Tailwind"],
    icon: HeartPulse,
    repo: gh("saarthi"),
    live: "https://saarthi-astrilo-monk.vercel.app/",
    color: "magenta"
  },

  // ----- In progress -----
  {
    title: "hms-oops-proj",
    status: "IN PROGRESS",
    description:
      "Hotel management system in core Java built on OOP fundamentals: room types, guests, bookings, invoices and payments, with a terminal UI and in-memory storage.",
    tags: ["Java", "OOP", "CLI"],
    icon: Building2,
    repo: gh("hms-oops-proj"),
    color: "yellow"
  },
  {
    title: "encryption-chat",
    status: "IN PROGRESS",
    description:
      "Secure chat app with a FastAPI backend that stores only ciphertext and public keys, plus TOTP multi-factor auth, replay protection and rate limiting.",
    tags: ["FastAPI", "MongoDB", "Security"],
    icon: Lock,
    repo: gh("encryption-chat"),
    color: "cyan"
  },
  {
    title: "cron-job",
    status: "IN PROGRESS",
    description:
      "Keep-alive service that calls a backend every 10 minutes so free-tier servers don't go to sleep.",
    tags: ["Automation", "Backend"],
    icon: Timer,
    repo: gh("cron-job"),
    color: "magenta"
  },

  // ----- Everything else, newest first -----
  {
    title: "kunal-tracker",
    year: "2026",
    description:
      "DSA progress tracker covering both Kunal Kushwaha's and Padho with Pratyush's problem lists, with dashboard stats, bookmarks, a revision queue and JSON import/export.",
    tags: ["Next.js", "Tailwind", "Zustand"],
    icon: ListChecks,
    repo: gh("kunal-tracker"),
    color: "yellow"
  },
  {
    title: "linkedin-larper",
    year: "2026",
    description:
      "Scores LinkedIn profile text from 0 to 100 for buzzwords, title inflation and thought-leader signaling.",
    tags: ["Next.js", "Text Analysis"],
    icon: Linkedin,
    repo: gh("linkedin-larper"),
    color: "cyan"
  },
  {
    title: "compiler",
    year: "2026",
    description:
      "Toy language (Lox) implementation in Java, following Crafting Interpreters for the semester 5 compiler syllabus.",
    tags: ["Java", "Compilers"],
    icon: Cpu,
    repo: gh("compiler"),
    color: "magenta"
  },
  {
    title: "time-complexity",
    year: "2026",
    description:
      "Independent time and space complexity analyzer built to power Code Tracer.",
    tags: ["JavaScript", "Static Analysis"],
    icon: Gauge,
    repo: gh("time-complexity"),
    color: "yellow"
  },
  {
    title: "farhan-portfolio",
    year: "2026",
    description:
      "This site: a cyberpunk-themed portfolio built with React and Vite, with live GitHub and LeetCode activity charts.",
    tags: ["React", "Vite", "GSAP"],
    icon: LayoutDashboard,
    repo: gh("farhan-portfolio"),
    live: "https://farhan-portfolio-lovat.vercel.app",
    color: "cyan"
  },
  {
    title: "ascii-art-js",
    year: "2026",
    description:
      "Real-time webcam to ASCII camera that runs entirely in the browser at 30+ FPS.",
    tags: ["JavaScript", "Frontend", "Creative Coding"],
    icon: Terminal,
    repo: gh("ascii-art-js"),
    live: "https://ascii-art-liart.vercel.app",
    color: "magenta"
  },
  {
    title: "ascii-art",
    year: "2026",
    description:
      "Java version of the ASCII camera, using OpenCV for webcam capture and JavaFX for rendering.",
    tags: ["Java", "OpenCV", "JavaFX"],
    icon: Terminal,
    repo: gh("ascii-art"),
    color: "yellow"
  },
  {
    title: "http-server-java",
    year: "2026",
    description:
      "HTTP server built from scratch in Java to learn request handling and backend fundamentals.",
    tags: ["Java", "HTTP", "Backend"],
    icon: Server,
    repo: gh("http-server-java"),
    color: "cyan"
  },
  {
    title: "country-weather-explorer",
    year: "2025",
    description:
      "Explore country details and the weather in its capital, with search suggestions, dark/light mode and geolocation.",
    tags: ["JavaScript", "Weather API"],
    icon: CloudSun,
    repo: gh("country-weather-explorer"),
    color: "magenta"
  },
  {
    title: "repl",
    year: "2025",
    description:
      "Command-line REPL calculator in C with basic math, number utilities and command history.",
    tags: ["C", "CLI", "Learning"],
    icon: Terminal,
    repo: gh("repl"),
    color: "yellow"
  },
  {
    title: "leetcode",
    year: "2025",
    description:
      "My LeetCode solutions in Java, organized by topic and difficulty.",
    tags: ["Java", "DSA"],
    icon: Code2,
    repo: gh("leetcode"),
    color: "cyan"
  }
];

export const featuredTitles = ["netauditai", "code-tracer", "emotion-tracker", "chess-assist", "saarthi"];

export const featuredProjects = featuredTitles
  .map((title) => projects.find((project) => project.title === title))
  .filter(Boolean);

export const getProject = (title) => projects.find((project) => project.title === title);
