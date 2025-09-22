import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

export async function GET() {
  try {
    // Get configuration from environment variables
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';
    const token = process.env.GITHUB_TOKEN;

    if (!owner || !repo) {
      return NextResponse.json(
        {
          error: 'GitHub repository not configured',
        },
        { status: 404 }
      );
    }

    // If we have a token, get repository information
    let repoInfo = null;
    let connected = false;
    let connectionError = null;

    if (token) {
      try {
        const octokit = new Octokit({ auth: token });
        const { data } = await octokit.repos.get({
          owner,
          repo,
        });

        repoInfo = {
          name: data.name,
          description: data.description,
          default_branch: data.default_branch,
          size: data.size,
          private: data.private,
          html_url: data.html_url,
          clone_url: data.clone_url,
        };
        connected = true;
      } catch (error) {
        console.error('Failed to fetch repo info:', error);
        connectionError =
          error instanceof Error ? error.message : 'Unknown error';
        connected = false;
      }
    } else {
      connectionError = 'No GitHub token provided';
      connected = false;
    }

    return NextResponse.json({
      owner,
      repo,
      branch,
      repoInfo,
      configured: true,
      connected,
      connectionError,
    });
  } catch (error) {
    console.error('Config API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to load configuration',
      },
      { status: 500 }
    );
  }
}
