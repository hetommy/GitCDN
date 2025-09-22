import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

interface GitHubProfile {
  id: string;
  login: string;
  name?: string;
  email?: string;
  avatar_url?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Only add GitHub OAuth if credentials are provided
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            authorization: {
              params: {
                scope: 'read:user user:email',
              },
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.githubId = (profile as GitHubProfile).id;
        token.githubLogin = (profile as GitHubProfile).login;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string;
        session.user.githubId = token.githubId as string;
        session.user.githubLogin = token.githubLogin as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
};

// Extend the default session type
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      githubId?: string;
      githubLogin?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    githubId?: string;
    githubLogin?: string;
  }
}
