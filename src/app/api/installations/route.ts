import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAppInstallations, getInstallationRepositories } from '@/lib/github-app';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json({ 
        error: 'Not authenticated' 
      }, { status: 401 });
    }

    // Get all installations for the app
    const installations = await getAppInstallations();
    
    // For each installation, get the repositories
    const installationsWithRepos = await Promise.all(
      installations.map(async (installation) => {
        const repositories = await getInstallationRepositories(installation.id);
        return {
          ...installation,
          repositories,
        };
      })
    );

    return NextResponse.json({
      installations: installationsWithRepos,
    });
  } catch (error) {
    console.error('Error fetching installations:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch installations' 
    }, { status: 500 });
  }
}
