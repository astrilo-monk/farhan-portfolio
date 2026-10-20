export default function SectionHeading({ index, title, accent = "cyan", showTrail = true, note = "" }) {
  return (
    <div className="section-title fade-up">
      <div className="section-index-wrap">
        <span className={`section-index ${accent}`}>{index}</span>
        <div className={`section-index-line ${accent}`} />
      </div>
      <h2>{title}</h2>
      {showTrail && <div className="section-trail" />}
      {note && <span className="section-note">{note}</span>}
    </div>
  );
}
