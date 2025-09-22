'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Github, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('github', { callbackUrl: '/settings' });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Github className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl">Sign in to GitCDN</CardTitle>
            <CardDescription>
              Connect your GitHub account to start using your repositories as a
              CDN
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              <Github className="w-5 h-5 mr-2" />
              {isLoading ? 'Signing in...' : 'Sign in with GitHub'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                By signing in, you agree to our terms of service and privacy
                policy.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Need help? Check out our{' '}
            <Link href="/landing" className="text-blue-600 hover:underline">
              setup guide
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
