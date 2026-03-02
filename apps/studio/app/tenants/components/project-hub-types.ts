export interface ProjectHubProps {
  tenantId: string;
  githubRepo?: string | null;
  vercelProjectId?: string | null;
  vercelUrl?: string | null;
  isInternal?: boolean | null;
}
