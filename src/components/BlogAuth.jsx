import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { login } from "../blogApi";

// The password is only ever typed into the modal and sent to /api/blog-login.
// It is never stored. We keep the short-lived signed token it returns, in
// sessionStorage (cleared when the tab closes, and the server expires it anyway).

const SESSION_KEY = "blog:session";
const AuthContext = createContext(null);

export const useBlogAuth = () => useContext(AuthContext);

function readSession() {
  try {
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
    if (session && session.expiresAt > Date.now()) return session;
  } catch {
    // ignore corrupted storage
  }
  return null;
}

function PasswordModal({ onClose, onUnlocked }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  const submit = async (event) => {
    event.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError("");
    try {
      onUnlocked(await login(password));
    } catch (err) {
      setError(err.message);
      setPassword("");
      setBusy(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="win modal" role="dialog" aria-modal="true" aria-labelledby="unlock-title">
        <div className="win-bar">
          <span className="win-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="win-title">auth.sh</span>
        </div>
        <form className="win-body modal-body" onSubmit={submit}>
          <img className="sticker modal-sticker" style={{ "--tilt": "-4deg" }} src="/blog/glasses.webp" alt="" width="120" />
          <h2 id="unlock-title">who goes there?</h2>
          <p className="dim">Enter the password to write or edit posts.</p>

          <label className="field">
            <span>password</span>
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>
              cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? "checking..." : "unlock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function BlogAuthProvider({ children }) {
  const [session, setSession] = useState(readSession);
  const [modalOpen, setModalOpen] = useState(false);
  const resolver = useRef(null);

  const lock = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  // Auto-lock when the token expires.
  useEffect(() => {
    if (!session) return undefined;
    const id = setTimeout(lock, Math.max(0, session.expiresAt - Date.now()));
    return () => clearTimeout(id);
  }, [session, lock]);

  const finish = useCallback((ok) => {
    setModalOpen(false);
    resolver.current?.(ok);
    resolver.current = null;
  }, []);

  const requestUnlock = useCallback(() => {
    if (session && session.expiresAt > Date.now()) return Promise.resolve(true);
    return new Promise((resolve) => {
      resolver.current = resolve;
      setModalOpen(true);
    });
  }, [session]);

  const onUnlocked = useCallback(
    (next) => {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
      setSession(next);
      finish(true);
    },
    [finish]
  );

  const value = useMemo(
    () => ({ unlocked: Boolean(session), token: session?.token || null, requestUnlock, lock }),
    [session, requestUnlock, lock]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {modalOpen && <PasswordModal onClose={() => finish(false)} onUnlocked={onUnlocked} />}
    </AuthContext.Provider>
  );
}
