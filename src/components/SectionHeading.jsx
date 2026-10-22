export default function SectionHeading({ cmd, title, note }) {
  return (
    <div className="sec-head reveal">
      <p className="sec-cmd">
        <span className="p">$</span> {cmd}
      </p>
      <div className="sec-title-row">
        <h2>{title}</h2>
        {note && <span className="sec-note">{note}</span>}
      </div>
    </div>
  );
}
