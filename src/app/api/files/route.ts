import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

export async function GET() {
  try {
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';
    const token = process.env.GITHUB_TOKEN;

    if (!owner || !repo || !token) {
      return NextResponse.json(
        { error: 'GitHub configuration missing' },
        { status: 400 }
      );
    }

    const octokit = new Octokit({ auth: token });

    // Get the tree of the repository
    const { data: branchData } = await octokit.repos.getBranch({
      owner,
      repo,
      branch,
    });

    const { data: treeData } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: branchData.commit.sha,
      recursive: '1',
    });

    // Filter for files only (not directories) and format the response
    const files = treeData.tree
      .filter((item) => item.type === 'blob')
      .map((item) => ({
        name: item.path,
        size: item.size || 0,
        sha: item.sha,
        url: item.url,
        download_url: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${item.path}`,
        lastModified: new Date().toISOString(), // GitHub doesn't provide this in tree, so we'll use current time
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      files,
      total: files.length,
      repository: {
        owner,
        repo,
        branch,
      },
    });
  } catch (error) {
    console.error('Failed to fetch files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files from repository' },
      { status: 500 }
    );
  }
}
