import { useEffect, useState } from "react";
import { Link, Router, usePath } from "./router";
import AmbientBackground from "./components/AmbientBackground";
import { BlogAuthProvider } from "./components/BlogAuth";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import WorkPage from "./pages/WorkPage";
import { profile } from "./profile";

const routes = {
  "/": { title: "Md Owais Farhan Akhter | Astrilo", Page: HomePage },
  "/work": { title: "Work | Astrilo", Page: WorkPage },
  "/blog": { title: "Blog | Astrilo", Page: BlogPage },
  "/contact": { title: "Contact | Astrilo", Page: ContactPage }
};

const navLinks = [
  ["/", "home"],
  ["/work", "work"],
  ["/blog", "blog"],
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
  const dir = path === "/" ? "~" : `~${path.startsWith("/blog/") ? "/blog/post" : path}`;

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
          {navLinks.map(([to, label]) => {
            const active = to === "/" ? path === "/" : path === to || path.startsWith(`${to}/`);
            return (
              <Link key={to} to={to} className={active ? "active" : ""} aria-current={active ? "page" : undefined}>
                {label}
              </Link>
            );
          })}
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
  const postMatch = path.match(/^\/blog\/([a-z0-9-]+)$/);

  useEffect(() => {
    if (postMatch) return; // the post page sets its own title
    document.title = route ? route.title : "404 | Astrilo";
  }, [route, postMatch]);

  useReveal(path);

  return (
    <div className="app">
      <AmbientBackground />
      <TopBar />
      <main key={path} className="page">
        {postMatch ? <BlogPostPage id={postMatch[1]} /> : route ? <route.Page /> : <NotFoundPage />}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <BlogAuthProvider>
        <Shell />
      </BlogAuthProvider>
    </Router>
  );
}
