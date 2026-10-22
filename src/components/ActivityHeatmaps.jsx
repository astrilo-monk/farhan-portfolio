import { useEffect, useMemo, useState } from "react";
import { Code2, Github } from "lucide-react";

const GITHUB_USER = "astrilo-monk";
const GITHUB_URL = `https://github.com/${GITHUB_USER}`;
const LEETCODE_URL = "https://leetcode.com/u/CelestialRadiant/";

const WEEKS = 53;
const CELL = 11;
const GAP = 3;
const PITCH = CELL + GAP;
const LEFT = 30;
const TOP = 20;
const DAY_MS = 86400000;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ROW_LABELS = { 1: "Mon", 3: "Wed", 5: "Fri" };

const toKey = (ms) => new Date(ms).toISOString().slice(0, 10);

function formatDate(key) {
  const d = new Date(`${key}T00:00:00Z`);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

// LeetCode gives raw counts only, so bucket non-zero days into quartiles.
function withQuartileLevels(counts) {
  const nonZero = Object.values(counts)
    .filter((c) => c > 0)
    .sort((a, b) => a - b);
  const q = (p) => nonZero[Math.min(nonZero.length - 1, Math.floor(nonZero.length * p))];
  const [q1, q2, q3] = [q(0.25), q(0.5), q(0.75)];

  const out = {};
  for (const [key, count] of Object.entries(counts)) {
    let level = 0;
    if (count > 0) level = count <= q1 ? 1 : count <= q2 ? 2 : count <= q3 ? 3 : 4;
    out[key] = { count, level };
  }
  return out;
}

// 53 week-columns (Sunday first), ending on today. `map` is { "YYYY-MM-DD": {count, level} }.
function buildWeeks(map) {
  const now = new Date();
  const end = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const endDow = new Date(end).getUTCDay();
  const start = end - ((WEEKS - 1) * 7 + endDow) * DAY_MS;

  const weeks = [];
  for (let w = 0; w < WEEKS; w += 1) {
    const days = [];
    for (let d = 0; d < 7; d += 1) {
      const t = start + (w * 7 + d) * DAY_MS;
      if (t > end) break;
      const key = toKey(t);
      const hit = map?.[key];
      days.push({ key, dow: d, count: hit?.count ?? 0, level: hit?.level ?? 0 });
    }
    weeks.push(days);
  }
  return weeks;
}

function computeStats(weeks) {
  const days = weeks.flat();
  let total = 0;
  let active = 0;
  let longest = 0;
  let run = 0;

  for (const day of days) {
    total += day.count;
    if (day.count > 0) {
      active += 1;
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
  }

  // Current streak: walk back from today; an empty "today" doesn't break it yet.
  let current = 0;
  let i = days.length - 1;
  if (days[i] && days[i].count === 0) i -= 1;
  for (; i >= 0 && days[i].count > 0; i -= 1) current += 1;

  return { total, active, longest, current };
}

function monthLabels(weeks) {
  const labels = [];
  let prev = -1;
  weeks.forEach((week, col) => {
    const month = new Date(`${week[0].key}T00:00:00Z`).getUTCMonth();
    if (month !== prev) {
      labels.push({ col, text: MONTHS[month] });
      prev = month;
    }
  });
  // Drop a cramped first label (partial month at the left edge).
  if (labels.length > 1 && labels[1].col - labels[0].col < 3) labels.shift();
  return labels;
}

function Heatmap({ weeks, theme, label, onHover }) {
  const width = LEFT + weeks.length * PITCH;
  const height = TOP + 7 * PITCH;
  const labels = useMemo(() => monthLabels(weeks), [weeks]);

  return (
    <div className="heatmap-scroll">
      <svg
        className={`heatmap ${theme}`}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={label}
        onMouseLeave={() => onHover(null)}
      >
        {labels.map(({ col, text }) => (
          <text key={`${text}-${col}`} className="hm-label" x={LEFT + col * PITCH} y={11}>
            {text}
          </text>
        ))}
        {Object.entries(ROW_LABELS).map(([row, text]) => (
          <text key={text} className="hm-label" x={0} y={TOP + Number(row) * PITCH + CELL - 2}>
            {text}
          </text>
        ))}
        {weeks.map((week, col) =>
          week.map((day) => (
            <rect
              key={day.key}
              className={`hm-cell l${day.level}`}
              x={LEFT + col * PITCH}
              y={TOP + day.dow * PITCH}
              width={CELL}
              height={CELL}
              rx={2}
              onMouseEnter={() => onHover(day)}
            />
          ))
        )}
      </svg>
    </div>
  );
}

function Legend({ theme }) {
  return (
    <div className="hm-legend" aria-hidden="true">
      <span>Less</span>
      <svg className={`heatmap ${theme}`} width={5 * PITCH} height={CELL} viewBox={`0 0 ${5 * PITCH} ${CELL}`}>
        {[0, 1, 2, 3, 4].map((l) => (
          <rect key={l} className={`hm-cell static l${l}`} x={l * PITCH} y={0} width={CELL} height={CELL} rx={2} />
        ))}
      </svg>
      <span>More</span>
    </div>
  );
}

function ActivityPanel({ title, fileName, icon: Icon, theme, href, unit, status, weeks, stats, extraChips }) {
  const [hover, setHover] = useState(null);
  const s = useMemo(() => computeStats(weeks), [weeks]);

  const readout = hover
    ? `${hover.count} ${hover.count === 1 ? unit.one : unit.many} on ${formatDate(hover.key)}`
    : status === "loading"
      ? "Fetching data..."
      : status === "error"
        ? "Live data unavailable right now. Open the profile instead."
        : "Hover a square for details";

  return (
    <article className="win activity-panel reveal">
      <div className="win-bar">
        <span className="win-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="win-title">
          <Icon size={13} /> {fileName}
        </span>
        <a className="win-link" href={href} target="_blank" rel="noreferrer">
          open profile
        </a>
      </div>

      <div className="win-body">
        <h3 className="activity-title">{title}</h3>

      <div className="activity-stats">
        {stats(s).map(([label, value]) => (
          <div key={label} className="activity-stat">
            <span>{label}</span>
            <strong>{status === "ready" ? value : "--"}</strong>
          </div>
        ))}
      </div>

      {extraChips && status === "ready" && <div className="tags activity-chips">{extraChips}</div>}

      <div className={`heatmap-wrap ${status === "ready" ? "" : "is-dim"}`}>
        <Heatmap weeks={weeks} theme={theme} label={`${title} activity over the last year`} onHover={setHover} />
      </div>

      <div className="activity-foot">
        <p className="activity-readout">{readout}</p>
        <Legend theme={theme} />
      </div>
      </div>
    </article>
  );
}

function useFetch(url, parse) {
  const [state, setState] = useState({ status: "loading", data: null });

  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => setState({ status: "ready", data: parse(json) }))
      .catch((error) => {
        if (error.name !== "AbortError") setState({ status: "error", data: null });
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return state;
}

function ActivityHeatmaps() {
  const github = useFetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`, (json) => {
    const map = {};
    for (const row of json.contributions || []) {
      map[row.date] = { count: row.count, level: row.level };
    }
    return map;
  });

  const leetcode = useFetch("/api/leetcode", (json) => ({
    map: withQuartileLevels(json.calendar || {}),
    solved: json.solved || {}
  }));

  const githubWeeks = useMemo(() => buildWeeks(github.data), [github.data]);
  const leetcodeWeeks = useMemo(() => buildWeeks(leetcode.data?.map), [leetcode.data]);
  const solved = leetcode.data?.solved || {};

  return (
    <div className="activity-stack">
      <ActivityPanel
        title="GitHub contributions"
        fileName="github.contributions"
        icon={Github}
        theme="green"
        href={GITHUB_URL}
        unit={{ one: "contribution", many: "contributions" }}
        status={github.status}
        weeks={githubWeeks}
        stats={(s) => [
          ["contributions", s.total],
          ["active days", s.active],
          ["current streak", `${s.current}d`],
          ["longest streak", `${s.longest}d`]
        ]}
      />

      <ActivityPanel
        title="LeetCode submissions"
        fileName="leetcode.submissions"
        icon={Code2}
        theme="gold"
        href={LEETCODE_URL}
        unit={{ one: "submission", many: "submissions" }}
        status={leetcode.status}
        weeks={leetcodeWeeks}
        stats={(s) => [
          ["problems solved", solved.All ?? "--"],
          ["submissions", s.total],
          ["active days", s.active],
          ["current streak", `${s.current}d`],
          ["longest streak", `${s.longest}d`]
        ]}
        extraChips={["Easy", "Medium", "Hard"].map((level) => (
          <span key={level} className={`tag ${level === "Easy" ? "t-green" : level === "Medium" ? "t-amber" : "t-red"}`}>
            {level.toLowerCase()} {solved[level] ?? 0}
          </span>
        ))}
      />
    </div>
  );
}

export default ActivityHeatmaps;
