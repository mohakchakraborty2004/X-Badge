import { NextRequest } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username || typeof username !== "string") {
    return new Response(JSON.stringify({ error: "Missing GitHub username" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    "User-Agent": "GitHub-Stats-API",
  };

  try {
    // 1. Verify user exists
    await axios.get(`https://api.github.com/users/${username}`, { headers });

    // 2. Fetch all repositories
    let page = 1;
    let allRepos: any[] = [];

    while (true) {
      const res = await axios.get(
        `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&type=all`,
        { headers }
      );
      const repos : any = res.data;
      if (repos.length === 0) break;
      allRepos = allRepos.concat(repos);
      if (repos.length < 100) break;
      page++;
    }

    const ownRepos = allRepos.filter(repo => !repo.fork);
    const forkedRepos = allRepos.filter(repo => repo.fork);

    // 3. Stars
    const totalStars = ownRepos.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0
    );

    // 4. Languages
    const languageStats: Record<string, number> = {};
    for (const repo of ownRepos) {
      try {
        const langRes : any = await axios.get(repo.languages_url, { headers });
        for (const [lang, bytes] of Object.entries(langRes.data)) {
          languageStats[lang] = (languageStats[lang] || 0) + Number(bytes);
        }
      } catch {
        continue;
      }
    }

    // 5. Commits from own repositories
    let totalCommits = 0;
    for (const repo of ownRepos) {
      try {
        const contribRes : any = await axios.get(
          `https://api.github.com/repos/${username}/${repo.name}/contributors`,
          { headers }
        );
        const contributor = contribRes.data.find(
          (c: any) => c.login === username
        );
        if (contributor) totalCommits += contributor.contributions;
      } catch {
        continue;
      }
    }

    // 6. Commits from forked repositories
    for (const repo of forkedRepos) {
      try {
        const sourceRes : any = await axios.get(
          `https://api.github.com/repos/${username}/${repo.name}`,
          { headers }
        );
        
        const parentFullName = sourceRes.data?.parent?.full_name;
        if (!parentFullName) continue;

        const contribRes : any = await axios.get(
          `https://api.github.com/repos/${parentFullName}/contributors`,
          { headers }
        );

        const contributor = contribRes.data.find(
          (c: any) => c.login === username
        );
        if (contributor) totalCommits += contributor.contributions;
      } catch {
        continue;
      }
    }

    // 7. Extra contributions (PRs, orgs)
    try {
      const eventsRes : any = await axios.get(
        `https://api.github.com/users/${username}/events/public?per_page=100`,
        { headers }
      );

      const externalRepos : any = new Set<string>();
      for (const event of eventsRes.data) {
        const fullName = event.repo?.name;
        if (!fullName) continue;

        const isOwnRepo = allRepos.find(r => r.full_name === fullName);
        if (isOwnRepo) continue; // already counted

        if (
          event.type === "PushEvent" ||
          event.type === "PullRequestEvent" ||
          event.type === "IssuesEvent"
        ) {
          externalRepos.add(fullName);
        }
      }

      for (const fullName of externalRepos) {
        try {
          const contribRes : any = await axios.get(
            `https://api.github.com/repos/${fullName}/contributors`,
            { headers }
          );
          const contributor = contribRes.data.find(
            (c: any) => c.login === username
          );
          if (contributor) totalCommits += contributor.contributions;
        } catch {
          continue;
        }
      }
    } catch (error) {
      console.warn("External contribution fetch failed", error);
    }

    const topLanguages = Object.entries(languageStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([lang]) => lang);

    return new Response(
      JSON.stringify({
        totalRepositories: ownRepos.length,
        totalStars,
        totalCommits,
        topLanguages,
        repositoriesProcessed: ownRepos.length,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error: any) {
    console.error("GitHub API error:", error?.response?.data || error.message);

    if (error.response?.status === 403) {
      return new Response(
        JSON.stringify({ error: "GitHub API rate limit exceeded" }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    if (error.response?.status === 401) {
      return new Response(
        JSON.stringify({ error: "GitHub API authentication failed" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "GitHub API error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
