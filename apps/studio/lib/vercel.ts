export interface VercelProjectMeta {
  status: "READY" | "ERROR" | "BUILDING" | "INITIALIZING";
  url: string;
  updatedAt: number;
}

export async function getVercelProjectMeta(projectId: string): Promise<VercelProjectMeta | null> {
  const token = process.env.VERCEL_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID;
  
  if (!token) return null;

  try {
    const url = teamId 
      ? `https://api.vercel.com/v9/projects/${projectId}?teamId=${teamId}`
      : `https://api.vercel.com/v9/projects/${projectId}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!res.ok) return null;

    const data = await res.json();
    
    // Get latest deployment
    const deployRes = await fetch(`https://api.vercel.com/v6/deployments?projectId=${projectId}${teamId ? `&teamId=${teamId}` : ""}&limit=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let status: VercelProjectMeta["status"] = "READY";
    let prodUrl = data.targets?.production?.url || data.link?.url || "";

    if (deployRes.ok) {
      const deployData = await deployRes.json();
      if (deployData.deployments?.[0]) {
        status = deployData.deployments[0].state;
        prodUrl = prodUrl || deployData.deployments[0].url;
      }
    }

    return {
      status,
      url: prodUrl.startsWith("http") ? prodUrl : `https://${prodUrl}`,
      updatedAt: data.updatedAt,
    };
  } catch (error) {
    console.error("Error fetching Vercel meta:", error);
    return null;
  }
}
