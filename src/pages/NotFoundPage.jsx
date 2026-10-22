import { Link, usePath } from "../router";

export default function NotFoundPage() {
  const path = usePath();

  return (
    <section className="container page-head notfound">
      <p className="sec-cmd">
        <span className="p">$</span> cd {path.replace(/^\//, "")}
      </p>
      <h1>command not found</h1>
      <p className="page-lede">There is nothing at {path}. Head back to somewhere that exists.</p>
      <div className="hero-actions">
        <Link to="/" className="btn btn-primary">
          cd ~
        </Link>
        <Link to="/work" className="btn">
          ls ~/work
        </Link>
      </div>
    </section>
  );
}
