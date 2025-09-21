import { App } from '@octokit/app';
import { Octokit } from '@octokit/rest';

// GitHub App configuration
const app = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_APP_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  webhooks: {
    secret: process.env.GITHUB_APP_WEBHOOK_SECRET!,
  },
});

export interface GitHubAppInstallation {
  id: number;
  account: {
    login: string;
    id: number;
    avatar_url: string;
  };
  repository_selection: 'all' | 'selected';
  repositories: Array<{
    id: number;
    name: string;
    full_name: string;
    private: boolean;
    default_branch: string;
  }>;
}

export interface RepositoryInfo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  size: number;
}

/**
 * Get all installations for the GitHub App
 */
export async function getAppInstallations(): Promise<GitHubAppInstallation[]> {
  try {
    const octokit = await app.getInstallationOctokit(1); // This will be updated to handle multiple installations
    const { data } = await octokit.apps.listInstallations();
    
    return data.map(installation => ({
      id: installation.id,
      account: {
        login: installation.account?.login || '',
        id: installation.account?.id || 0,
        avatar_url: installation.account?.avatar_url || '',
      },
      repository_selection: installation.repository_selection as 'all' | 'selected',
      repositories: [], // Will be populated separately
    }));
  } catch (error) {
    console.error('Error fetching app installations:', error);
    return [];
  }
}

/**
 * Get repositories for a specific installation
 */
export async function getInstallationRepositories(installationId: number): Promise<RepositoryInfo[]> {
  try {
    const octokit = await app.getInstallationOctokit(installationId);
    const { data } = await octokit.apps.listReposAccessibleToInstallation();
    
    return data.repositories.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      private: repo.private,
      default_branch: repo.default_branch,
      description: repo.description,
      html_url: repo.html_url,
      clone_url: repo.clone_url,
      size: repo.size,
    }));
  } catch (error) {
    console.error('Error fetching installation repositories:', error);
    return [];
  }
}

/**
 * Get Octokit instance for a specific installation
 */
export async function getInstallationOctokit(installationId: number): Promise<Octokit> {
  return await app.getInstallationOctokit(installationId);
}

/**
 * Get repository information
 */
export async function getRepositoryInfo(
  installationId: number,
  owner: string,
  repo: string
): Promise<RepositoryInfo | null> {
  try {
    const octokit = await app.getInstallationOctokit(installationId);
    const { data } = await octokit.repos.get({ owner, repo });
    
    return {
      id: data.id,
      name: data.name,
      full_name: data.full_name,
      private: data.private,
      default_branch: data.default_branch,
      description: data.description,
      html_url: data.html_url,
      clone_url: data.clone_url,
      size: data.size,
    };
  } catch (error) {
    console.error('Error fetching repository info:', error);
    return null;
  }
}

/**
 * Upload file to repository
 */
export async function uploadFile(
  installationId: number,
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  branch: string = 'main'
): Promise<{ commit: any; content: any } | null> {
  try {
    const octokit = await app.getInstallationOctokit(installationId);
    
    // Get the current file content to get the SHA (required for updates)
    let sha: string | undefined;
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: branch,
      });
      
      if (Array.isArray(data)) {
        throw new Error('Path is a directory, not a file');
      }
      
      sha = data.sha;
    } catch (error: any) {
      if (error.status !== 404) {
        throw error;
      }
      // File doesn't exist, that's fine for new files
    }
    
    const { data } = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      branch,
      sha, // Include SHA for updates, undefined for new files
    });
    
    return data;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
}

/**
 * List files in repository
 */
export async function listRepositoryFiles(
  installationId: number,
  owner: string,
  repo: string,
  path: string = '',
  branch: string = 'main'
): Promise<any[]> {
  try {
    const octokit = await app.getInstallationOctokit(installationId);
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });
    
    if (Array.isArray(data)) {
      return data;
    } else {
      return [data];
    }
  } catch (error) {
    console.error('Error listing repository files:', error);
    return [];
  }
}

/**
 * Delete file from repository
 */
export async function deleteFile(
  installationId: number,
  owner: string,
  repo: string,
  path: string,
  message: string,
  branch: string = 'main'
): Promise<boolean> {
  try {
    const octokit = await app.getInstallationOctokit(installationId);
    
    // Get the current file content to get the SHA
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });
    
    if (Array.isArray(data)) {
      throw new Error('Path is a directory, not a file');
    }
    
    await octokit.repos.deleteFile({
      owner,
      repo,
      path,
      message,
      sha: data.sha,
      branch,
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

export { app };
