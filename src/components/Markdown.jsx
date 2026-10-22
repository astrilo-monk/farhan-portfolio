// A small, safe markdown renderer. It builds React elements (never raw HTML),
// and only allows http(s) links, so post content cannot inject scripts.

const INLINE = /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\))/g;

function renderInline(text, keyPrefix) {
  const nodes = [];
  let last = 0;
  let index = 0;
  let match;
  INLINE.lastIndex = 0;

  while ((match = INLINE.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const key = `${keyPrefix}-${index}`;
    index += 1;

    if (match[1]) nodes.push(<code key={key}>{match[1].slice(1, -1)}</code>);
    else if (match[2]) nodes.push(<strong key={key}>{match[2].slice(2, -2)}</strong>);
    else
      nodes.push(
        <a key={key} href={match[5]} target="_blank" rel="noopener noreferrer">
          {match[4]}
        </a>
      );
    last = INLINE.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function withBreaks(lines, keyPrefix) {
  return lines.flatMap((line, i) => (i === 0 ? renderInline(line, `${keyPrefix}-${i}`) : [<br key={`${keyPrefix}-br${i}`} />, ...renderInline(line, `${keyPrefix}-${i}`)]));
}

export default function Markdown({ source }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const key = `b${blocks.length}`;

    if (/^```/.test(line)) {
      const code = [];
      i += 1;
      while (i < lines.length && !/^```/.test(lines[i])) {
        code.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push(
        <pre key={key}>
          <code>{code.join("\n")}</code>
        </pre>
      );
    } else if (/^#{1,3}\s+/.test(line)) {
      const level = line.match(/^#+/)[0].length;
      const Tag = `h${level + 1}`; // post title is the h1
      blocks.push(<Tag key={key}>{renderInline(line.replace(/^#+\s+/, ""), key)}</Tag>);
      i += 1;
    } else if (/^>\s?/.test(line)) {
      const quote = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^>\s?/, ""));
        i += 1;
      }
      blocks.push(<blockquote key={key}>{withBreaks(quote, key)}</blockquote>);
    } else if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i += 1;
      }
      blocks.push(
        <ul key={key}>
          {items.map((item, n) => (
            <li key={n}>{renderInline(item, `${key}-${n}`)}</li>
          ))}
        </ul>
      );
    } else if (line.trim() === "") {
      i += 1;
    } else {
      const para = [];
      while (
        i < lines.length &&
        lines[i].trim() !== "" &&
        !/^(```|#{1,3}\s|>\s?|[-*]\s)/.test(lines[i])
      ) {
        para.push(lines[i]);
        i += 1;
      }
      blocks.push(<p key={key}>{withBreaks(para, key)}</p>);
    }
  }

  return <div className="prose">{blocks}</div>;
}
