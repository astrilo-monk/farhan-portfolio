import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import BlogEditor from "../components/BlogEditor";
import { useBlogAuth } from "../components/BlogAuth";
import { createPost, excerpt, fetchPosts, formatDate, getMood, readingMinutes } from "../blogApi";
import { Link, useNavigate } from "../router";

function Mascots() {
  return (
    <div className="mascots" aria-hidden="true">
      <img className="sticker m-drool" style={{ "--tilt": "-6deg" }} src="/blog/drool.webp" alt="" />
      <img className="sticker m-hamster" style={{ "--tilt": "3deg" }} src="/blog/hamster.webp" alt="" />
      <img className="sticker m-glasses" style={{ "--tilt": "-3deg" }} src="/blog/glasses.webp" alt="" />
    </div>
  );
}

export default function BlogPage() {
  const { token, requestUnlock } = useBlogAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState("");
  const [writing, setWriting] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetchPosts()
      .then((list) => !cancelled && setPosts(list))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, []);

  const startWriting = async () => {
    if (await requestUnlock()) {
      setWriting(true);
      requestAnimationFrame(() => editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  };

  const publish = async (values) => {
    const post = await createPost(token, values);
    navigate(`/blog/${post.id}`);
  };

  return (
    <>
      <section className="container page-head">
        <div className="blog-head">
          <div>
            <p className="sec-cmd">
              <span className="p">$</span> ls ~/blog
            </p>
            <h1>Blog</h1>
            <p className="page-lede">Notes from the terminal: what I am building, learning and breaking.</p>
            <div className="hero-actions">
              <button type="button" className="btn btn-primary" onClick={startWriting}>
                <Plus size={15} /> create blog
              </button>
            </div>
          </div>
          <Mascots />
        </div>
      </section>

      <section className="container section tight">
        {writing && (
          <div ref={editorRef} className="editor-wrap">
            <BlogEditor
              initial={{ title: "", body: "", mood: "hamster" }}
              draftKey="blog:draft"
              onSubmit={publish}
              onCancel={() => setWriting(false)}
            />
          </div>
        )}

        {error && (
          <div className="blog-empty">
            <img className="sticker" style={{ "--tilt": "-3deg" }} src="/blog/hamster.webp" alt="" width="150" />
            <p>{error}</p>
          </div>
        )}

        {!error && posts === null && <p className="dim blog-loading">fetching posts...</p>}

        {!error && posts && posts.length === 0 && (
          <div className="blog-empty">
            <img className="sticker" style={{ "--tilt": "3deg" }} src="/blog/drool.webp" alt="" width="190" />
            <p>nothing here yet. the hamster is still thinking.</p>
          </div>
        )}

        {posts && posts.length > 0 && (
          <div className="post-grid">
            {posts.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`} className="card post-card">
                <img
                  className="sticker post-thumb"
                  style={{ "--tilt": getMood(post.mood).tilt }}
                  src={getMood(post.mood).src}
                  alt=""
                  width="84"
                  height="84"
                  loading="lazy"
                />
                <div>
                  <h3>{post.title}</h3>
                  <p className="post-meta">
                    {formatDate(post.createdAt)} <span className="sep">/</span> {readingMinutes(post.body)} min read
                  </p>
                  <p className="post-excerpt">{excerpt(post.body)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
