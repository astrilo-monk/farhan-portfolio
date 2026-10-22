import { useEffect, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { MOODS, uploadImage } from "../blogApi";
import { altFromFilename, blobToBase64, prepareImage } from "../imageUpload";
import { useBlogAuth } from "./BlogAuth";
import Markdown from "./Markdown";

const BODY_MAX = 20000;
const TITLE_MAX = 120;

export default function BlogEditor({ initial, submitLabel = "publish", onSubmit, onCancel, draftKey }) {
  const { lock, token } = useBlogAuth();
  const [title, setTitle] = useState(initial.title);
  const [body, setBody] = useState(initial.body);
  const [mood, setMood] = useState(initial.mood);
  const [tab, setTab] = useState("write");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploads, setUploads] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [dragging, setDragging] = useState(false);
  const textRef = useRef(null);
  const fileRef = useRef(null);
  const bodyRef = useRef(body);
  const cursorRef = useRef(null);
  bodyRef.current = body;

  // After inserting an image, put the caret right after it.
  useEffect(() => {
    if (cursorRef.current !== null && textRef.current) {
      textRef.current.selectionStart = cursorRef.current;
      textRef.current.selectionEnd = cursorRef.current;
      cursorRef.current = null;
    }
  }, [body]);

  const insertAtCursor = (markdown) => {
    const el = textRef.current;
    const current = bodyRef.current;
    const start = el ? el.selectionStart : current.length;
    const end = el ? el.selectionEnd : current.length;
    const before = current.slice(0, start);
    const after = current.slice(end);
    const lead = !before || before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
    const insertion = `${lead}${markdown}\n\n`;
    cursorRef.current = before.length + insertion.length;
    setBody(`${before}${insertion}${after.replace(/^\n+/, "")}`);
  };

  const handleFiles = async (fileList) => {
    const files = [...fileList].filter((file) => file.type.startsWith("image/"));
    if (files.length === 0) {
      setUploadError("Only image files can be added.");
      return;
    }
    setUploadError("");
    for (const file of files) {
      setUploads((n) => n + 1);
      try {
        const { blob, type } = await prepareImage(file);
        const data = await blobToBase64(blob);
        const { url } = await uploadImage(token, { type, data });
        insertAtCursor(`![${altFromFilename(file.name)}](${url})`);
      } catch (err) {
        if (err.status === 401) {
          lock();
          setUploadError("Session expired. Close this and unlock again (your draft is saved).");
        } else {
          setUploadError(err.message);
        }
        break;
      } finally {
        setUploads((n) => n - 1);
      }
    }
  };

  // Restore an unfinished draft (new posts only), once.
  useEffect(() => {
    if (!draftKey || initial.title || initial.body) return;
    try {
      const draft = JSON.parse(localStorage.getItem(draftKey) || "null");
      if (draft) {
        setTitle(draft.title || "");
        setBody(draft.body || "");
        setMood(draft.mood || "hamster");
      }
    } catch {
      // ignore corrupted draft
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave the draft locally while typing.
  useEffect(() => {
    if (!draftKey || (!title && !body)) return undefined;
    const id = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify({ title, body, mood }));
      } catch {
        // storage full or blocked: not critical
      }
    }, 500);
    return () => clearTimeout(id);
  }, [title, body, mood, draftKey]);

  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    try {
      await onSubmit({ title: title.trim(), body, mood });
      if (draftKey) localStorage.removeItem(draftKey);
    } catch (err) {
      if (err.status === 401) lock();
      setError(err.status === 401 ? "Session expired. Close this and unlock again (your draft is saved)." : err.message);
      setBusy(false);
    }
  };

  return (
    <form className="win editor" onSubmit={submit}>
      <div className="win-bar">
        <span className="win-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="win-title">{initial.title ? "edit-post.md" : "new-post.md"}</span>
        <div className="editor-tabs" role="tablist">
          {["write", "preview"].map((name) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={tab === name}
              className={tab === name ? "on" : ""}
              onClick={() => setTab(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="win-body editor-body">
        <input
          className="editor-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={TITLE_MAX}
          placeholder="Post title"
          aria-label="Post title"
          required
        />

        <fieldset className="mood-picker">
          <legend>cover sticker</legend>
          {MOODS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={mood === item.id}
              aria-label={item.label}
              className={mood === item.id ? "on" : ""}
              onClick={() => setMood(item.id)}
            >
              <img src={item.src} alt="" width="52" height="52" loading="lazy" />
            </button>
          ))}
        </fieldset>

        {tab === "write" ? (
          <>
            <div className="editor-toolbar">
              <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
                <ImagePlus size={15} /> add image
              </button>
              <span className="dim">
                {uploads > 0 ? `uploading ${uploads}...` : "or drag, drop or paste photos into the text"}
              </span>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(event) => {
                  handleFiles(event.target.files);
                  event.target.value = "";
                }}
              />
            </div>
            <textarea
              ref={textRef}
              className={`editor-text${dragging ? " dragging" : ""}`}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              onPaste={(event) => {
                const images = [...event.clipboardData.files].filter((file) => file.type.startsWith("image/"));
                if (images.length) {
                  event.preventDefault();
                  handleFiles(images);
                }
              }}
              onDragOver={(event) => {
                if ([...event.dataTransfer.types].includes("Files")) {
                  event.preventDefault();
                  setDragging(true);
                }
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                handleFiles(event.dataTransfer.files);
              }}
              maxLength={BODY_MAX}
              rows={14}
              placeholder={"Write anything...\n\n# Heading   **bold**   `code`   - list   > quote   [link](https://...)"}
              aria-label="Post body"
              required
            />
          </>
        ) : (
          <div className="editor-preview">
            {body.trim() ? <Markdown source={body} /> : <p className="dim">Nothing to preview yet.</p>}
          </div>
        )}

        {uploadError && (
          <p className="form-error" role="alert">
            {uploadError}
          </p>
        )}

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="editor-foot">
          <span className="dim">
            {body.length}/{BODY_MAX}
          </span>
          <div className="editor-actions">
            <button type="button" className="btn" onClick={onCancel}>
              cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={busy || uploads > 0 || !title.trim() || !body.trim()}>
              {busy ? "saving..." : submitLabel}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
