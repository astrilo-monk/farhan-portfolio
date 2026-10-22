import { useEffect, useState } from "react";
import { ArrowLeft, Lock, Pencil, Trash2 } from "lucide-react";
import BlogEditor from "../components/BlogEditor";
import { useBlogAuth } from "../components/BlogAuth";
import Markdown from "../components/Markdown";
import { fetchPost, formatDate, getMood, readingMinutes, removePost, updatePost } from "../blogApi";
import { Link, useNavigate } from "../router";

export default function BlogPostPage({ id }) {
  const { unlocked, token, requestUnlock, lock } = useBlogAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setPost(null);
    setError(null);
    setEditing(false);
    fetchPost(id)
      .then((data) => {
        if (cancelled) return;
        setPost(data);
        document.title = `${data.title} | Astrilo`;
      })
      .catch((err) => !cancelled && setError(err));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const startEditing = async () => {
    if (await requestUnlock()) setEditing(true);
  };

  const save = async (values) => {
    setPost(await updatePost(token, id, values));
    setEditing(false);
  };

  const destroy = async () => {
    setActionError("");
    try {
      await removePost(token, id);
      navigate("/blog");
    } catch (err) {
      if (err.status === 401) lock();
      setActionError(err.status === 401 ? "Session expired. Unlock again to delete." : err.message);
      setConfirming(false);
    }
  };

  if (error) {
    const missing = error.status === 404;
    return (
      <section className="container page-head notfound">
        <p className="sec-cmd">
          <span className="p">$</span> cat {id}
        </p>
        <h1>{missing ? "post not found" : "could not load post"}</h1>
        <p className="page-lede">{missing ? "That post does not exist, or it was deleted." : error.message}</p>
        <div className="hero-actions">
          <Link to="/blog" className="btn btn-primary">
            back to blog
          </Link>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="container page-head">
        <p className="dim blog-loading">fetching post...</p>
      </section>
    );
  }

  const mood = getMood(post.mood);

  return (
    <article className="container post-page">
      <Link to="/blog" className="back-link">
        <ArrowLeft size={14} /> all posts
      </Link>

      {editing ? (
        <BlogEditor
          initial={{ title: post.title, body: post.body, mood: post.mood }}
          submitLabel="save changes"
          onSubmit={save}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <header className="post-head">
            <div>
              <p className="post-meta">
                {formatDate(post.createdAt)} <span className="sep">/</span> {readingMinutes(post.body)} min read
                {post.updatedAt !== post.createdAt && (
                  <>
                    {" "}
                    <span className="sep">/</span> edited {formatDate(post.updatedAt)}
                  </>
                )}
              </p>
              <h1>{post.title}</h1>
            </div>
            <img
              className="sticker post-cover"
              style={{ "--tilt": mood.tilt }}
              src={mood.src}
              alt=""
              width="150"
              height="150"
            />
          </header>

          <Markdown source={post.body} />

          <footer className="post-foot">
            {confirming ? (
              <span className="confirm">
                delete this post for good?
                <button type="button" className="btn btn-danger" onClick={destroy}>
                  yes, delete
                </button>
                <button type="button" className="btn" onClick={() => setConfirming(false)}>
                  keep it
                </button>
              </span>
            ) : (
              <span className="post-actions">
                <button type="button" className="btn" onClick={startEditing}>
                  {unlocked ? <Pencil size={14} /> : <Lock size={14} />} edit
                </button>
                {unlocked && (
                  <button type="button" className="btn btn-danger" onClick={() => setConfirming(true)}>
                    <Trash2 size={14} /> delete
                  </button>
                )}
              </span>
            )}
            {actionError && (
              <p className="form-error" role="alert">
                {actionError}
              </p>
            )}
          </footer>
        </>
      )}
    </article>
  );
}
