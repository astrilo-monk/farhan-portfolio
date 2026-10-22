import { useEffect, useState } from "react";
import { ArrowRight, FileText, Github } from "lucide-react";
import { Link } from "../router";
import SectionHeading from "../components/SectionHeading";
import { journey, profile, skillGroups, workStyle } from "../profile";

function useTyped(text, speed = 55) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(text.length);
      return undefined;
    }
    const id = setInterval(() => {
      setCount((value) => {
        if (value >= text.length) {
          clearInterval(id);
          return value;
        }
        return value + 1;
      });
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return text.slice(0, count);
}

function ProfileCard() {
  return (
    <aside className="win profile-card" aria-label="Profile summary">
      <div className="win-bar">
        <span className="win-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="win-title">profile.json</span>
      </div>
      <pre className="json">
        <span className="pn">{"{"}</span>
        {"\n  "}
        <span className="k">"name"</span>
        <span className="pn">: </span>
        <span className="s">"{profile.name}"</span>
        <span className="pn">,</span>
        {"\n  "}
        <span className="k">"alias"</span>
        <span className="pn">: </span>
        <span className="s">"{profile.alias}"</span>
        <span className="pn">,</span>
        {"\n  "}
        <span className="k">"role"</span>
        <span className="pn">: </span>
        <span className="s">"{profile.role}"</span>
        <span className="pn">,</span>
        {"\n  "}
        <span className="k">"experience"</span>
        <span className="pn">: </span>
        <span className="s">"{profile.experience}"</span>
        <span className="pn">,</span>
        {"\n  "}
        <span className="k">"location"</span>
        <span className="pn">: </span>
        <span className="s">"{profile.location}"</span>
        <span className="pn">,</span>
        {"\n  "}
        <span className="k">"stack"</span>
        <span className="pn">: [</span>
        {profile.stack.map((item, idx) => (
          <span key={item}>
            <span className="s">"{item}"</span>
            {idx < profile.stack.length - 1 && <span className="pn">, </span>}
          </span>
        ))}
        <span className="pn">],</span>
        {"\n  "}
        <span className="k">"openToWork"</span>
        <span className="pn">: </span>
        <span className="b">true</span>
        {"\n"}
        <span className="pn">{"}"}</span>
      </pre>
    </aside>
  );
}

export default function HomePage() {
  const typed = useTyped("whoami");

  return (
    <>
      <section className="container hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-cmd">
              <span className="p">$</span> {typed}
              <span className="caret" aria-hidden="true" />
            </p>

            <h1>
              {profile.name}
              <span className="h1-alias"> aka {profile.alias}</span>
            </h1>

            <p className="hero-role">
              {profile.role} <span className="sep">/</span> <span className="ok">{profile.status}</span>
            </p>

            <p className="hero-lede">
              I build projects to become a strong full-stack developer: React on the front, Node, Python and Java on the
              back.
            </p>

            <div className="hero-actions">
              <Link to="/work" className="btn btn-primary">
                view work <ArrowRight size={15} />
              </Link>
              <a className="btn" href={profile.github} target="_blank" rel="noreferrer">
                <Github size={15} /> github
              </a>
              <a className="btn" href={profile.resume} target="_blank" rel="noreferrer" download>
                <FileText size={15} /> resume
              </a>
            </div>
          </div>

          <ProfileCard />
        </div>
      </section>

      <section id="about" className="container section">
        <SectionHeading cmd="cat about.md" title="About" />
        <div className="about-grid">
          <p className="about-text reveal">
            I am a college student focused on becoming a strong full-stack developer. I build projects to practice modern
            web technologies, improve problem-solving, and grow through consistent hands-on learning.
          </p>

          <ol className="log reveal" aria-label="Timeline">
            {journey.map((entry) => (
              <li key={entry.role} className="log-item">
                <span className="log-node" aria-hidden="true" />
                <p className="log-period">{entry.period}</p>
                <h3>{entry.role}</h3>
                <p className="log-org">{entry.org}</p>
                <p className="log-summary">
                  {entry.summary}
                  {entry.link && (
                    <>
                      {" "}
                      See the{" "}
                      <a href={entry.link.href} target="_blank" rel="noopener noreferrer">
                        {entry.link.label}
                      </a>
                      .
                    </>
                  )}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="skills" className="container section">
        <SectionHeading cmd="ls -l skills/" title="Skills" note="# my own read, not test scores" />

        <div className="skills-grid">
          {skillGroups.map((group) => (
            <div key={group.level} className="card skill-card reveal">
              <p className="skill-level">
                <span className="meter" aria-hidden="true">
                  {[1, 2, 3].map((n) => (
                    <i key={n} className={n <= group.dots ? "on" : ""} />
                  ))}
                </span>
                {group.level}
              </p>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="tags work-style reveal">
          {workStyle.map((item) => (
            <span key={item} className="tag">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="container section next-up reveal">
        <p className="sec-cmd">
          <span className="p">$</span> cd next
        </p>
        <div className="next-links">
          <Link to="/work" className="next-link">
            <span>Activity and projects</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/contact" className="next-link">
            <span>Get in touch</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
