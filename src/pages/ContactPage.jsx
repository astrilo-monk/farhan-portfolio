import { useMemo, useState } from "react";
import { Check, Code2, Copy, FileText, Github, Linkedin, Mail, Send } from "lucide-react";
import { profile } from "../profile";

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const sent = useMemo(() => new URLSearchParams(window.location.search).get("sent") === "1", []);
  const action = `https://formsubmit.co/${profile.email}`;
  const nextUrl = `${window.location.origin}/contact?sent=1`;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <section className="container page-head">
        <p className="sec-cmd">
          <span className="p">$</span> ./contact.sh
        </p>
        <h1>Let&apos;s talk</h1>
        <p className="page-lede">
          I am looking for internships, mentorship and junior-level opportunities where I can learn, contribute and grow
          as a developer.
        </p>
      </section>

      <section className="container section tight">
        <div className="contact-grid">
          <div className="win reveal">
            <div className="win-bar">
              <span className="win-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="win-title">message.txt</span>
            </div>

            <div className="win-body">
              {sent && (
                <p className="notice" role="status">
                  <Check size={15} /> Message sent. I usually reply within 24 hours.
                </p>
              )}

              <div className="quick-actions">
                <a className="btn" href={`mailto:${profile.email}`}>
                  <Mail size={14} /> email
                </a>
                <button className="btn" type="button" onClick={copyEmail}>
                  {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "copied" : "copy email"}
                </button>
                <a className="btn" href={profile.resume} target="_blank" rel="noreferrer" download>
                  <FileText size={14} /> resume
                </a>
              </div>

              <form className="contact-form" action={action} method="POST">
                <input type="hidden" name="_subject" value="New Portfolio Message" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_next" value={nextUrl} />

                <div className="field-row">
                  <label className="field">
                    <span>name</span>
                    <input type="text" name="name" placeholder="Your name" required />
                  </label>
                  <label className="field">
                    <span>email</span>
                    <input type="email" name="email" placeholder="you@example.com" required />
                  </label>
                </div>
                <label className="field">
                  <span>message</span>
                  <textarea name="message" rows={5} placeholder="Tell me about your project or opportunity" required />
                </label>

                <div className="form-foot">
                  <button className="btn btn-primary" type="submit">
                    <Send size={15} /> send message
                  </button>
                  <p className="dim">Replies usually within 24 hours.</p>
                </div>
              </form>
            </div>
          </div>

          <div className="win reveal">
            <div className="win-bar">
              <span className="win-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="win-title">links/</span>
            </div>
            <div className="win-body social-list">
              <a href={profile.github} target="_blank" rel="noreferrer">
                <Github size={18} />
                <span>
                  <strong>GitHub</strong>
                  <em>github.com/astrilo-monk</em>
                </span>
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                <Linkedin size={18} />
                <span>
                  <strong>LinkedIn</strong>
                  <em>linkedin.com/in/astrilo</em>
                </span>
              </a>
              <a href={profile.leetcode} target="_blank" rel="noreferrer">
                <Code2 size={18} />
                <span>
                  <strong>LeetCode</strong>
                  <em>leetcode.com/u/CelestialRadiant</em>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
