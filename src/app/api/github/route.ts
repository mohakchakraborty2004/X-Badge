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

  try {
    const headers = {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "User-Agent": "GitHub-Stats-API",
    };

    // First, check if user exists
    try {
      await axios.get(`https://api.github.com/users/${username}`, { headers });
    } catch (userError: any) {
      if (userError.response?.status === 404) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      throw userError;
    }

    // Get all repositories (handle pagination)
    let allRepos: Array<{
      name: string;
      stargazers_count: number;
      languages_url: string;
      owner: { login: string };
      fork: boolean;
    }> = [];
    
    let page = 1;
    const perPage = 100;
    
    while (true) {
      const reposRes = await axios.get(
        `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}&type=owner`,
        { headers }
      );
      const repos : any = reposRes.data;
      
      if (repos.length === 0) break;
      allRepos = allRepos.concat(repos);
      if (repos.length < perPage) break;
      page++;
    }

    // Filter out forked repositories for more accurate stats
    const ownRepos = allRepos.filter(repo => !repo.fork);

    let totalStars = 0;
    let totalCommits = 0;
    const languageStats: Record<string, number> = {};
    const languageSet = new Set<string>();

    // Process repositories with better error handling and rate limiting
    const processRepo = async (repo: typeof ownRepos[0]) => {
      try {
        totalStars += repo.stargazers_count;

        // Get languages with error handling
        try {
          const langsRes = await axios.get(repo.languages_url, { headers });
          const languages = langsRes.data as Record<string, number>;
          Object.entries(languages).forEach(([lang, bytes]) => {
            languageSet.add(lang);
            languageStats[lang] = (languageStats[lang] || 0) + bytes;
          });
        } catch (langError: any) {
          console.warn(`Failed to fetch languages for ${repo.name}:`, langError.message);
        }

        // Get commit count with better error handling
        try {
          const statsRes = await axios.get(
            `https://api.github.com/repos/${username}/${repo.name}/contributors`,
            { headers }
          );
          const contributors = statsRes.data as Array<{ login: string; contributions: number }>;
          const userStats = contributors.find((c) => c.login === username);
          if (userStats) {
            totalCommits += userStats.contributions;
          }
        } catch (statsError: any) {
          // Contributors endpoint might fail for empty repos or private repos
          if (statsError.response?.status !== 404) {
            console.warn(`Failed to fetch contributors for ${repo.name}:`, statsError.message);
          }
        }
      } catch (error: any) {
        console.warn(`Error processing repo ${repo.name}:`, error.message);
      }
    };

    // Process repos in batches to avoid rate limiting
    const batchSize = 10;
    for (let i = 0; i < ownRepos.length; i += batchSize) {
      const batch = ownRepos.slice(i, i + batchSize);
      await Promise.all(batch.map(processRepo));
      
      // Add a small delay between batches to be respectful to GitHub API
      if (i + batchSize < ownRepos.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Sort languages by usage (bytes)
    const topLanguages = Object.entries(languageStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10) // Top 10 languages
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
          "Cache-Control": "s-maxage=300, stale-while-revalidate=600", // Cache for 5 minutes
        },
      }
    );
  } catch (error: any) {
    console.error("GitHub API error:", error?.response?.data || error.message);
    
    // Handle rate limiting
    if (error.response?.status === 403 && error.response?.headers?.['x-ratelimit-remaining'] === '0') {
      return new Response(
        JSON.stringify({ 
          error: "GitHub API rate limit exceeded. Please try again later.",
          retryAfter: error.response?.headers?.['x-ratelimit-reset']
        }), 
        {
          status: 429,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Handle unauthorized
    if (error.response?.status === 401) {
      return new Response(
        JSON.stringify({ error: "GitHub API authentication failed" }), 
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        error: "GitHub API error",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}