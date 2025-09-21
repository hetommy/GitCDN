"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Github, 
  Settings as SettingsIcon, 
  CheckCircle, 
  AlertCircle, 
  Link as LinkIcon,
  Save
} from "lucide-react";

export default function SettingsPage() {
  const [config, setConfig] = useState({
    owner: "",
    repo: "",
    branch: "main",
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [repoInfo, setRepoInfo] = useState<any>(null);
  const [configSource, setConfigSource] = useState<'env' | 'manual'>('env');

  // Load configuration from environment variables or API
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/config');
        if (response.ok) {
          const data = await response.json();
          if (data.owner && data.repo) {
            setConfig({
              owner: data.owner,
              repo: data.repo,
              branch: data.branch || 'main',
            });
            setConfigSource('env');
            setIsConnected(true);
            setRepoInfo(data.repoInfo);
          }
        }
      } catch (error) {
        console.log('No environment config found, using manual mode');
        setConfigSource('manual');
      }
    };

    loadConfig();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    // TODO: Implement GitHub connection validation
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    // TODO: Implement connection test
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

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
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* GitHub Repository Configuration */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Github className="w-5 h-5" />
                  <CardTitle>GitHub Repository</CardTitle>
                </div>
                <Badge variant={configSource === 'env' ? 'default' : 'secondary'}>
                  {configSource === 'env' ? 'Environment Config' : 'Manual Config'}
                </Badge>
              </div>
              <CardDescription>
                {configSource === 'env' 
                  ? 'Repository configured via Vercel environment variables'
                  : 'Configure your GitHub repository for CDN file storage'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Repository Owner
                  </label>
                  <Input
                    placeholder="your-username"
                    value={config.owner}
                    onChange={(e) => setConfig({ ...config, owner: e.target.value })}
                    disabled={configSource === 'env'}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Repository Name
                  </label>
                  <Input
                    placeholder="cdn-assets"
                    value={config.repo}
                    onChange={(e) => setConfig({ ...config, repo: e.target.value })}
                    disabled={configSource === 'env'}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Branch
                </label>
                <Input
                  placeholder="main"
                  value={config.branch}
                  onChange={(e) => setConfig({ ...config, branch: e.target.value })}
                  disabled={configSource === 'env'}
                />
              </div>

              {configSource === 'manual' && (
                <div className="flex items-center space-x-4">
                  <Button onClick={handleTestConnection} disabled={isLoading}>
                    {isLoading ? "Testing..." : "Test Connection"}
                  </Button>
                  <Button onClick={handleSave} disabled={isLoading || !config.owner || !config.repo}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Configuration
                  </Button>
                </div>
              )}

              {configSource === 'env' && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Environment Configuration:</strong> Repository settings are managed via Vercel environment variables. 
                    To change these settings, update your environment variables in the Vercel dashboard.
                  </p>
                </div>
              )}

              {isConnected && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-700 dark:text-green-300">
                    Successfully connected to {config.owner}/{config.repo}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>


          {/* Repository Information */}
          <Card>
            <CardHeader>
              <CardTitle>Repository Information</CardTitle>
              <CardDescription>
                Details about your configured repository
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Repository:</span>
                    <p className="text-slate-600 dark:text-slate-300">
                      {config.owner && config.repo ? `${config.owner}/${config.repo}` : "Not configured"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Branch:</span>
                    <p className="text-slate-600 dark:text-slate-300">{config.branch}</p>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <div className="flex items-center space-x-2">
                      {isConnected ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-600 dark:text-green-400">Connected</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                          <span className="text-yellow-600 dark:text-yellow-400">Not connected</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Files:</span>
                    <p className="text-slate-600 dark:text-slate-300">0 files</p>
                  </div>
                  {repoInfo && (
                    <>
                      <div>
                        <span className="font-medium">Repository Size:</span>
                        <p className="text-slate-600 dark:text-slate-300">
                          {Math.round(repoInfo.size / 1024)} KB
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Visibility:</span>
                        <p className="text-slate-600 dark:text-slate-300">
                          {repoInfo.private ? 'Private' : 'Public'}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">GitHub URL:</span>
                        <p className="text-slate-600 dark:text-slate-300">
                          <a 
                            href={repoInfo.html_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View on GitHub
                          </a>
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Setup Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Setup Guide</CardTitle>
              <CardDescription>
                {configSource === 'env' 
                  ? 'Your repository is configured via environment variables'
                  : 'Follow these steps to get started'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {configSource === 'env' ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-green-700 dark:text-green-300">
                        Repository Configured
                      </span>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Your GitHub repository is configured via Vercel environment variables. 
                      You can start uploading files immediately!
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Environment Variables Used:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">
                          GITHUB_OWNER
                        </code>
                        <span className="text-slate-600 dark:text-slate-300">= {config.owner}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">
                          GITHUB_REPO
                        </code>
                        <span className="text-slate-600 dark:text-slate-300">= {config.repo}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">
                          GITHUB_BRANCH
                        </code>
                        <span className="text-slate-600 dark:text-slate-300">= {config.branch}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Create a GitHub repository</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Create a new public repository on GitHub for your CDN assets
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Configure repository settings</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Enter your repository owner, name, and branch above
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Start uploading files</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Go to the dashboard and start uploading your assets
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
