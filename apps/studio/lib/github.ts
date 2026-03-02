export interface GitHubRepoMeta {
  stars: number;
  forks: number;
  lastCommit: string;
  url: string;
}

export async function getGitHubRepoMeta(repo: string): Promise<GitHubRepoMeta | null> {
  const token = process.env.GITHUB_TOKEN;
  
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Accept": "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) return null;

    const data = await res.json();
    
    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
      lastCommit: data.pushed_at,
      url: data.html_url,
    };
  } catch (error) {
    console.error("Error fetching GitHub meta:", error);
    return null;
  }
}
