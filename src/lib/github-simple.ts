import { Octokit } from '@octokit/rest';

interface RepositoryInfo {
  name: string;
  description: string | null;
  default_branch: string;
  size: number;
  private: boolean;
  html_url: string;
  clone_url: string;
}

// Simple GitHub API wrapper using Personal Access Token
export class GitHubAPI {
  private octokit: Octokit;
  private owner: string;
  private repo: string;
  private branch: string;

  constructor(
    token: string,
    owner: string,
    repo: string,
    branch: string = 'main'
  ) {
    this.octokit = new Octokit({ auth: token });
    this.owner = owner;
    this.repo = repo;
    this.branch = branch;
  }

  // Test connection to GitHub
  async testConnection(): Promise<{
    success: boolean;
    error?: string;
    repoInfo?: RepositoryInfo;
  }> {
    try {
      const { data } = await this.octokit.repos.get({
        owner: this.owner,
        repo: this.repo,
      });

      return {
        success: true,
        repoInfo: {
          name: data.name,
          description: data.description,
          default_branch: data.default_branch,
          size: data.size,
          private: data.private,
          html_url: data.html_url,
          clone_url: data.clone_url,
        },
      };
    } catch (error: unknown) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to connect to GitHub',
      };
    }
  }

  // Upload file to repository
  async uploadFile(
    path: string,
    content: string,
    message: string = `Upload ${path}`
  ): Promise<{ success: boolean; error?: string; data?: unknown }> {
    try {
      // Get the current file content to get the SHA (required for updates)
      let sha: string | undefined;
      try {
        const { data } = await this.octokit.repos.getContent({
          owner: this.owner,
          repo: this.repo,
          path,
          ref: this.branch,
        });

        if (Array.isArray(data)) {
          throw new Error('Path is a directory, not a file');
        }

        sha = data.sha;
      } catch (error: unknown) {
        if (
          error &&
          typeof error === 'object' &&
          'status' in error &&
          error.status !== 404
        ) {
          throw error;
        }
        // File doesn't exist, that's fine for new files
      }

      const { data } = await this.octokit.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path,
        message,
        content: Buffer.from(content).toString('base64'),
        branch: this.branch,
        sha, // Include SHA for updates, undefined for new files
      });

      return { success: true, data };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload file',
      };
    }
  }

  // List files in repository
  async listFiles(
    path: string = ''
  ): Promise<{ success: boolean; error?: string; files?: unknown[] }> {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: this.branch,
      });

      if (Array.isArray(data)) {
        return { success: true, files: data };
      } else {
        return { success: true, files: [data] };
      }
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list files',
      };
    }
  }

  // Delete file from repository
  async deleteFile(
    path: string,
    message: string = `Delete ${path}`
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get the current file content to get the SHA
      const { data } = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: this.branch,
      });

      if (Array.isArray(data)) {
        throw new Error('Path is a directory, not a file');
      }

      await this.octokit.repos.deleteFile({
        owner: this.owner,
        repo: this.repo,
        path,
        message,
        sha: data.sha,
        branch: this.branch,
      });

      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete file',
      };
    }
  }

  // Generate CDN URLs
  generateCDNUrls(path: string): { githubRaw: string; jsDelivr: string } {
    const githubRaw = `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${path}`;
    const jsDelivr = `https://cdn.jsdelivr.net/gh/${this.owner}/${this.repo}@${this.branch}/${path}`;

    return { githubRaw, jsDelivr };
  }
}

// Helper function to create GitHub API instance from environment variables
export function createGitHubAPI(): GitHubAPI | null {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token || !owner || !repo) {
    return null;
  }

  return new GitHubAPI(token, owner, repo, branch);
}
