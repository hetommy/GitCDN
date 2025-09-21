import { Octokit } from "@octokit/rest";

export interface GitHubConfig {
  owner: string;
  repo: string;
  branch?: string;
  token?: string;
}

export interface CDNFile {
  name: string;
  path: string;
  size: number;
  download_url: string;
  sha: string;
  type: string;
  last_modified: string;
}

export class GitHubCDN {
  private octokit: Octokit;
  private config: GitHubConfig;

  constructor(config: GitHubConfig) {
    this.config = {
      branch: "main",
      ...config,
    };
    
    this.octokit = new Octokit({
      auth: config.token,
    });
  }

  /**
   * Upload a file to GitHub repository
   */
  async uploadFile(
    file: File,
    path: string,
    message?: string
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const content = await this.fileToBase64(file);
      
      const response = await this.octokit.repos.createOrUpdateFileContents({
        owner: this.config.owner,
        repo: this.config.repo,
        path,
        message: message || `Upload ${file.name}`,
        content,
        branch: this.config.branch,
      });

      const cdnUrl = this.generateCDNUrl(path);
      
      return {
        success: true,
        url: cdnUrl,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to upload file",
      };
    }
  }

  /**
   * Get all files from a directory
   */
  async getFiles(path: string = ""): Promise<CDNFile[]> {
    try {
      const response = await this.octokit.repos.getContent({
        owner: this.config.owner,
        repo: this.config.repo,
        path,
        ref: this.config.branch,
      });

      if (Array.isArray(response.data)) {
        return response.data
          .filter((item: any) => item.type === "file")
          .map((item: any) => ({
            name: item.name,
            path: item.path,
            size: item.size,
            download_url: item.download_url,
            sha: item.sha,
            type: this.getFileType(item.name),
            last_modified: item.last_modified || new Date().toISOString(),
          }));
      }

      return [];
    } catch (error: any) {
      console.error("Failed to get files:", error);
      return [];
    }
  }

  /**
   * Delete a file from the repository
   */
  async deleteFile(
    path: string,
    message?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // First, get the file's SHA
      const file = await this.octokit.repos.getContent({
        owner: this.config.owner,
        repo: this.config.repo,
        path,
        ref: this.config.branch,
      });

      if (!Array.isArray(file.data) && file.data.sha) {
        await this.octokit.repos.deleteFile({
          owner: this.config.owner,
          repo: this.config.repo,
          path,
          message: message || `Delete ${path}`,
          sha: file.data.sha,
          branch: this.config.branch,
        });

        return { success: true };
      }

      return { success: false, error: "File not found" };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to delete file",
      };
    }
  }

  /**
   * Generate CDN URLs for a file
   */
  generateCDNUrl(path: string): string {
    return `https://raw.githubusercontent.com/${this.config.owner}/${this.config.repo}/${this.config.branch}/${path}`;
  }

  /**
   * Generate jsDelivr CDN URL
   */
  generateJsDelivrUrl(path: string): string {
    return `https://cdn.jsdelivr.net/gh/${this.config.owner}/${this.config.repo}@${this.config.branch}/${path}`;
  }

  /**
   * Get all available CDN URLs for a file
   */
  getAllCDNUrls(path: string): { name: string; url: string }[] {
    return [
      {
        name: "GitHub Raw",
        url: this.generateCDNUrl(path),
      },
      {
        name: "jsDelivr",
        url: this.generateJsDelivrUrl(path),
      },
    ];
  }

  /**
   * Get repository information
   */
  async getRepoInfo(): Promise<{
    name: string;
    description: string;
    default_branch: string;
    size: number;
  } | null> {
    try {
      const response = await this.octokit.repos.get({
        owner: this.config.owner,
        repo: this.config.repo,
      });

      return {
        name: response.data.name,
        description: response.data.description || "",
        default_branch: response.data.default_branch,
        size: response.data.size,
      };
    } catch (error) {
      console.error("Failed to get repo info:", error);
      return null;
    }
  }

  /**
   * Check if the repository is accessible
   */
  async isAccessible(): Promise<boolean> {
    try {
      await this.octokit.repos.get({
        owner: this.config.owner,
        repo: this.config.repo,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Convert file to base64
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/png;base64, prefix
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  /**
   * Get file type from filename
   */
  private getFileType(filename: string): string {
    const extension = filename.split(".").pop()?.toLowerCase();
    
    const typeMap: { [key: string]: string } = {
      // Images
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
      
      // Documents
      pdf: "application/pdf",
      txt: "text/plain",
      md: "text/markdown",
      json: "application/json",
      
      // Code
      js: "application/javascript",
      ts: "application/typescript",
      tsx: "application/typescript",
      jsx: "application/javascript",
      css: "text/css",
      html: "text/html",
    };

    return typeMap[extension || ""] || "application/octet-stream";
  }
}

/**
 * Utility function to create GitHub CDN instance
 */
export function createGitHubCDN(config: GitHubConfig): GitHubCDN {
  return new GitHubCDN(config);
}

/**
 * Utility function to validate GitHub repository URL
 */
export function parseGitHubUrl(url: string): GitHubConfig | null {
  const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
  const match = url.match(regex);
  
  if (match) {
    return {
      owner: match[1],
      repo: match[2].replace(/\.git$/, ""),
    };
  }
  
  return null;
}
