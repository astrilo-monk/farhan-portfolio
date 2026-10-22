import { useEffect, useState } from "react";
import { Link, Router, usePath } from "./router";
import AmbientBackground from "./components/AmbientBackground";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import WorkPage from "./pages/WorkPage";
import { profile } from "./profile";

const routes = {
  "/": { title: "Md Owais Farhan Akhter | Astrilo", Page: HomePage },
  "/work": { title: "Work | Astrilo", Page: WorkPage },
  "/contact": { title: "Contact | Astrilo", Page: ContactPage }
};

const navLinks = [
  ["/", "home"],
  ["/work", "work"],
  ["/contact", "contact"]
];

function useClock() {
  const read = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  const [time, setTime] = useState(read);

  useEffect(() => {
    const id = setInterval(() => setTime(read()), 15000);
    return () => clearInterval(id);
  }, []);

  return time;
}

function useReveal(path) {
  useEffect(() => {
    const targets = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("revealed"));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [path]);
}

function TopBar() {
  const path = usePath();
  const now = useClock();
  const dir = path === "/" ? "~" : `~${path}`;

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <Link to="/" className="prompt" aria-label="Home">
          <span className="p-user">{profile.alias}</span>
          <span className="p-dim p-at">@</span>
          <span className="p-host">portfolio</span>
          <span className="p-dim p-colon">:</span>
          <span className="p-path">{dir}</span>
          <span className="p-dollar">$</span>
          <span className="caret" aria-hidden="true" />
        </Link>

        <nav className="topnav" aria-label="Pages">
          {navLinks.map(([to, label]) => (
            <Link key={to} to={to} className={path === to ? "active" : ""} aria-current={path === to ? "page" : undefined}>
              {label}
            </Link>
          ))}
        </nav>

        <p className="topbar-status">
          <span className="live-dot" aria-hidden="true" />
          open to internships <span className="sep">/</span> {now}
        </p>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>
          <span className="p">$</span> exit 0 <span className="sep">/</span> &copy; {new Date().getFullYear()}{" "}
          {profile.alias}
        </p>
        <p>
          <a href={profile.github} target="_blank" rel="noreferrer">
            github
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            linkedin
          </a>
          <a href={profile.leetcode} target="_blank" rel="noreferrer">
            leetcode
          </a>
        </p>
      </div>
    </footer>
  );
}

function Shell() {
  const path = usePath();
  const route = routes[path];
  const Page = route ? route.Page : NotFoundPage;

  useEffect(() => {
    document.title = route ? route.title : "404 | Astrilo";
  }, [route]);

  useReveal(path);

  return (
    <div className="app">
      <AmbientBackground />
      <TopBar />
      <main key={path} className="page">
        <Page />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Shell />
    </Router>
  );
}
