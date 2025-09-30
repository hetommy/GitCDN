import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string || file.name;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Get GitHub configuration from environment variables
    const githubOwner = process.env.GITHUB_OWNER;
    const githubRepo = process.env.GITHUB_REPO;
    const githubBranch = process.env.GITHUB_BRANCH || 'main';
    const githubToken = process.env.GITHUB_TOKEN;

    if (!githubOwner || !githubRepo || !githubToken) {
      return NextResponse.json(
        { error: 'GitHub configuration missing. Please check your environment variables.' },
        { status: 500 }
      );
    }

    // Convert file to base64
    const fileBuffer = await file.arrayBuffer();
    const fileContent = Buffer.from(fileBuffer).toString('base64');

    // Get the current commit SHA for the branch
    const branchResponse = await fetch(
      `https://api.github.com/repos/${githubOwner}/${githubRepo}/branches/${githubBranch}`,
      {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!branchResponse.ok) {
      throw new Error(`Failed to get branch info: ${branchResponse.statusText}`);
    }

    const branchData = await branchResponse.json();
    const baseTreeSha = branchData.commit.sha;

    // Get the current tree
    const treeResponse = await fetch(
      `https://api.github.com/repos/${githubOwner}/${githubRepo}/git/trees/${baseTreeSha}`,
      {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!treeResponse.ok) {
      throw new Error(`Failed to get tree: ${treeResponse.statusText}`);
    }

    const treeData = await treeResponse.json();

    // Check if file already exists
    const existingFile = treeData.tree.find((item: { path?: string }) => item.path === path);
    if (existingFile) {
      return NextResponse.json({ 
        error: 'File already exists', 
        details: `A file named "${path}" already exists in the repository. Please choose a different name or delete the existing file first.`,
        existingFile: true
      }, { status: 409 });
    }

    // Create a new blob for the file
    const blobResponse = await fetch(
      `https://api.github.com/repos/${githubOwner}/${githubRepo}/git/blobs`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: fileContent,
          encoding: 'base64',
        }),
      }
    );

    if (!blobResponse.ok) {
      throw new Error(`Failed to create blob: ${blobResponse.statusText}`);
    }

    const blobData = await blobResponse.json();

    // Create a new tree with the file
    const newTreeResponse = await fetch(
      `https://api.github.com/repos/${githubOwner}/${githubRepo}/git/trees`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          base_tree: baseTreeSha,
          tree: [
            {
              path: path,
              mode: '100644',
              type: 'blob',
              sha: blobData.sha,
            },
          ],
        }),
      }
    );

    if (!newTreeResponse.ok) {
      throw new Error(`Failed to create tree: ${newTreeResponse.statusText}`);
    }

    const newTreeData = await newTreeResponse.json();

    // Create a new commit
    const commitResponse = await fetch(
      `https://api.github.com/repos/${githubOwner}/${githubRepo}/git/commits`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Upload ${path}`,
          tree: newTreeData.sha,
          parents: [baseTreeSha],
        }),
      }
    );

    if (!commitResponse.ok) {
      throw new Error(`Failed to create commit: ${commitResponse.statusText}`);
    }

    const commitData = await commitResponse.json();

    // Update the branch reference
    const updateRefResponse = await fetch(
      `https://api.github.com/repos/${githubOwner}/${githubRepo}/git/refs/heads/${githubBranch}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sha: commitData.sha,
        }),
      }
    );

    if (!updateRefResponse.ok) {
      throw new Error(`Failed to update branch: ${updateRefResponse.statusText}`);
    }

    // Return the file URL
    const fileUrl = `https://raw.githubusercontent.com/${githubOwner}/${githubRepo}/${githubBranch}/${path}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      path: path,
      size: file.size,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
