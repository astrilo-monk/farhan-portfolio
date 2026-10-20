// Server-side LeetCode fetcher. LeetCode's GraphQL endpoint blocks browser
// requests (CORS), so this runs on the server (Vercel function / Vite dev).
export const LEETCODE_USER = "CelestialRadiant";

const QUERY = `
  query userProfile($username: String!) {
    matchedUser(username: $username) {
      submitStats {
        acSubmissionNum { difficulty count }
      }
      userCalendar {
        streak
        totalActiveDays
        submissionCalendar
      }
    }
  }
`;

export async function fetchLeetCode(username = LEETCODE_USER) {
  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: `https://leetcode.com/u/${username}/`,
      "User-Agent": "Mozilla/5.0 (compatible; portfolio-activity/1.0)"
    },
    body: JSON.stringify({ query: QUERY, variables: { username } })
  });

  if (!response.ok) {
    throw new Error(`LeetCode responded with ${response.status}`);
  }

  const json = await response.json();
  const user = json?.data?.matchedUser;
  if (!user) {
    throw new Error("LeetCode user not found");
  }

  // submissionCalendar is a JSON string: { "<unix seconds>": <count>, ... }
  const raw = JSON.parse(user.userCalendar?.submissionCalendar || "{}");
  const calendar = {};
  for (const [ts, count] of Object.entries(raw)) {
    const key = new Date(Number(ts) * 1000).toISOString().slice(0, 10);
    calendar[key] = (calendar[key] || 0) + Number(count);
  }

  const solved = {};
  for (const row of user.submitStats?.acSubmissionNum || []) {
    solved[row.difficulty] = row.count;
  }

  return { solved, calendar };
}
