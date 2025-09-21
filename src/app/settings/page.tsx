"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RepositorySelector from "@/components/repository-selector";
import { 
  Github, 
  Settings as SettingsIcon, 
  CheckCircle, 
  AlertCircle, 
  LogIn,
  LogOut,
  User,
  ExternalLink
} from "lucide-react";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string;
  description: string | null;
  html_url: string;
  size: number;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null);

  const handleRepositorySelect = (repo: Repository) => {
    setSelectedRepository(repo);
    // Store in localStorage for persistence
    localStorage.setItem('selectedRepository', JSON.stringify(repo));
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <header className="border-b bg-white dark:bg-slate-800">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <SettingsIcon className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold">GitCDN Settings</h1>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <header className="border-b bg-white dark:bg-slate-800">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <SettingsIcon className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold">GitCDN Settings</h1>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Github className="w-5 h-5" />
                  <span>Authentication Required</span>
                </CardTitle>
                <CardDescription>
                  Sign in with GitHub to configure your repositories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-slate-600 dark:text-slate-300">
                    You need to authenticate with GitHub to access your repositories and configure your CDN.
                  </p>
                  <Button onClick={() => signIn('github')} className="w-full">
                    <Github className="w-4 h-4 mr-2" />
                    Sign in with GitHub
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <SettingsIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">GitCDN Settings</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img 
                  src={session.user?.image || ''} 
                  alt={session.user?.name || ''}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium">{session.user?.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Authentication Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Authentication Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src={session.user?.image || ''} 
                    alt={session.user?.name || ''}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{session.user?.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {session.user?.email}
                    </p>
                    <p className="text-xs text-slate-500">
                      GitHub: @{session.user?.githubLogin}
                    </p>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Repository Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Github className="w-5 h-5" />
                <span>Repository Selection</span>
              </CardTitle>
              <CardDescription>
                Select a repository to use for your CDN. Files will be uploaded to this repository.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RepositorySelector 
                onRepositorySelect={handleRepositorySelect}
                selectedRepository={selectedRepository}
              />
            </CardContent>
          </Card>

          {/* Selected Repository Info */}
          {selectedRepository && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Selected Repository</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-lg">{selectedRepository.full_name}</h3>
                      {selectedRepository.description && (
                        <p className="text-slate-600 dark:text-slate-300 mt-1">
                          {selectedRepository.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedRepository.private && (
                        <Badge variant="outline">Private</Badge>
                      )}
                      <Badge variant="default">Branch: {selectedRepository.default_branch}</Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Repository Size:</span>
                      <p className="text-slate-600 dark:text-slate-300">
                        {Math.round(selectedRepository.size / 1024)} KB
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Default Branch:</span>
                      <p className="text-slate-600 dark:text-slate-300">
                        {selectedRepository.default_branch}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button asChild variant="outline">
                      <a 
                        href={selectedRepository.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View on GitHub
                      </a>
                    </Button>
                    <Button asChild>
                      <a href="/">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Start Uploading Files
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Setup Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Setup Guide</CardTitle>
              <CardDescription>
                Follow these steps to get started with your GitHub CDN
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    ✓
                  </div>
                  <div>
                    <p className="font-medium">Sign in with GitHub</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Authenticate with your GitHub account
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                    selectedRepository ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                  }`}>
                    {selectedRepository ? '✓' : '2'}
                  </div>
                  <div>
                    <p className="font-medium">Select Repository</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Choose which repository to use for your CDN files
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                    selectedRepository ? 'bg-blue-500 text-white' : 'bg-slate-300 text-slate-600'
                  }`}>
                    3
                  </div>
                  <div>
                    <p className="font-medium">Start Uploading</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Go to the dashboard and start uploading your assets
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}