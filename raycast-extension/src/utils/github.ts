import { Octokit } from "@octokit/rest";
import { GitCDNPreferences } from "./preferences";

export interface FileInfo {
  name: string;
  size: number;
  sha: string;
  url: string;
  download_url: string;
  lastModified: string;
}

export interface RepositoryInfo {
  name: string;
  description: string | null;
  default_branch: string;
  size: number;
  private: boolean;
  html_url: string;
  clone_url: string;
}

export class GitHubClient {
  private octokit: Octokit;
  private owner: string;
  private repo: string;
  private branch: string;

  constructor(preferences: GitCDNPreferences) {
    this.octokit = new Octokit({ auth: preferences.githubToken });
    this.owner = preferences.githubOwner;
    this.repo = preferences.githubRepo;
    this.branch = preferences.githubBranch;
  }

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
            : "Failed to connect to GitHub",
      };
    }
  }

  async listFiles(): Promise<{
    success: boolean;
    error?: string;
    files?: FileInfo[];
    total?: number;
  }> {
    try {
      // Get the tree of the repository
      const { data: branchData } = await this.octokit.repos.getBranch({
        owner: this.owner,
        repo: this.repo,
        branch: this.branch,
      });

      const { data: treeData } = await this.octokit.git.getTree({
        owner: this.owner,
        repo: this.repo,
        tree_sha: branchData.commit.sha,
        recursive: "1",
      });

      // Filter for files only (not directories) and format the response
      const files = treeData.tree
        .filter((item) => item.type === "blob")
        .map((item) => ({
          name: item.path!,
          size: item.size || 0,
          sha: item.sha!,
          url: item.url!,
          download_url: `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${item.path}`,
          lastModified: new Date().toISOString(), // GitHub doesn't provide this in tree
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      return {
        success: true,
        files,
        total: files.length,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch files",
      };
    }
  }

  async uploadFile(
    file: File,
    customPath?: string
  ): Promise<{
    success: boolean;
    error?: string;
    url?: string;
    path?: string;
  }> {
    try {
      const path = customPath || file.name;

      // Convert file to base64
      const fileBuffer = await file.arrayBuffer();
      const fileContent = Buffer.from(fileBuffer).toString("base64");

      // Get the current commit SHA for the branch
      const { data: branchData } = await this.octokit.repos.getBranch({
        owner: this.owner,
        repo: this.repo,
        branch: this.branch,
      });

      const baseTreeSha = branchData.commit.sha;

      // Get the current tree
      const { data: treeData } = await this.octokit.git.getTree({
        owner: this.owner,
        repo: this.repo,
        tree_sha: baseTreeSha,
      });

      // Check if file already exists
      const existingFile = treeData.tree.find((item) => item.path === path);
      if (existingFile) {
        return {
          success: false,
          error: `File "${path}" already exists. Please choose a different name or delete the existing file first.`,
        };
      }

      // Create a new blob for the file
      const { data: blobData } = await this.octokit.git.createBlob({
        owner: this.owner,
        repo: this.repo,
        content: fileContent,
        encoding: "base64",
      });

      // Create a new tree with the file
      const { data: newTreeData } = await this.octokit.git.createTree({
        owner: this.owner,
        repo: this.repo,
        base_tree: baseTreeSha,
        tree: [
          {
            path: path,
            mode: "100644",
            type: "blob",
            sha: blobData.sha,
          },
        ],
      });

      // Create a new commit
      const { data: commitData } = await this.octokit.git.createCommit({
        owner: this.owner,
        repo: this.repo,
        message: `Upload ${path}`,
        tree: newTreeData.sha,
        parents: [baseTreeSha],
      });

      // Update the branch reference
      await this.octokit.git.updateRef({
        owner: this.owner,
        repo: this.repo,
        ref: `heads/${this.branch}`,
        sha: commitData.sha,
      });

      // Return the file URL
      const fileUrl = `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${path}`;

      return {
        success: true,
        url: fileUrl,
        path: path,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      };
    }
  }

  async deleteFile(path: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Get the current commit SHA for the branch
      const { data: branchData } = await this.octokit.repos.getBranch({
        owner: this.owner,
        repo: this.repo,
        branch: this.branch,
      });

      const treeSha = branchData.commit.commit.tree.sha;

      // Get the current tree
      const { data: treeData } = await this.octokit.git.getTree({
        owner: this.owner,
        repo: this.repo,
        tree_sha: treeSha,
        recursive: "true",
      });

      // Filter out the file we want to delete
      const filteredTree = treeData.tree.filter((item) => item.path !== path);

      // Create a new tree without the deleted file
      const { data: newTree } = await this.octokit.git.createTree({
        owner: this.owner,
        repo: this.repo,
        tree: filteredTree.map((item) => ({
          path: item.path!,
          mode: item.mode! as "100644" | "100755" | "040000" | "160000" | "120000",
          type: item.type! as "commit" | "blob" | "tree",
          sha: item.sha!,
        })),
      });

      // Create a commit with the new tree
      const { data: commit } = await this.octokit.git.createCommit({
        owner: this.owner,
        repo: this.repo,
        message: `Delete ${path}`,
        tree: newTree.sha,
        parents: [branchData.commit.sha],
      });

      // Update the branch to point to the new commit
      await this.octokit.git.updateRef({
        owner: this.owner,
        repo: this.repo,
        ref: `heads/${this.branch}`,
        sha: commit.sha,
      });

      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete file",
      };
    }
  }

  generateFileUrl(path: string): string {
    return `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${path}`;
  }
}
