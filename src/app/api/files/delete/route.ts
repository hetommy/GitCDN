import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

export async function DELETE(request: NextRequest) {
  try {
    const { path, sha } = await request.json();

    if (!path || !sha) {
      return NextResponse.json(
        { error: 'Missing file path or SHA' },
        { status: 400 }
      );
    }

    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';
    const token = process.env.GITHUB_TOKEN;

    if (!owner || !repo || !token) {
      return NextResponse.json(
        { error: 'GitHub repository or token not configured' },
        { status: 400 }
      );
    }

    const octokit = new Octokit({ auth: token });

    // Delete the file by creating a commit that removes it
    const { data: branchData } = await octokit.repos.getBranch({
      owner,
      repo,
      branch,
    });

    const treeSha = branchData.commit.commit.tree.sha;

    // Get the current tree
    const { data: treeData } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: treeSha,
      recursive: 'true',
    });

    // Filter out the file we want to delete
    const filteredTree = treeData.tree.filter(item => item.path !== path);

    // Create a new tree without the deleted file
    const { data: newTree } = await octokit.git.createTree({
      owner,
      repo,
      tree: filteredTree.map(item => ({
        path: item.path!,
        mode: item.mode! as "100644" | "100755" | "040000" | "160000" | "120000",
        type: item.type! as "commit" | "blob" | "tree",
        sha: item.sha!,
      })),
    });

    // Create a commit with the new tree
    const { data: commit } = await octokit.git.createCommit({
      owner,
      repo,
      message: `Delete ${path}`,
      tree: newTree.sha,
      parents: [branchData.commit.sha],
    });

    // Update the branch to point to the new commit
    await octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: commit.sha,
    });

    return NextResponse.json({ 
      success: true, 
      message: `File ${path} deleted successfully` 
    });
  } catch (error) {
    console.error('Failed to delete file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file from GitHub' },
      { status: 500 }
    );
  }
}
