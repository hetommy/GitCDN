'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Github,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Settings,
  RefreshCw,
} from 'lucide-react';

interface ConfigData {
  owner: string;
  repo: string;
  branch: string;
  repoInfo?: {
    name: string;
    description: string;
    default_branch: string;
    size: number;
    private: boolean;
    html_url: string;
    clone_url: string;
  };
  configured: boolean;
  connected: boolean;
  connectionError?: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchConfig();
    }
  }, [isOpen]);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/config');
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('Failed to fetch config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              Settings
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
              <span className="text-slate-500">Loading settings...</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* GitHub Repository Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                GitHub Repository Configuration
              </CardTitle>
              <CardDescription>
                Current configuration and connection status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {config?.configured ? (
                <div className="space-y-4">
                  {/* Connection Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {config?.connected ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">Connected</span>
                          <Badge variant="secondary" className="ml-2">
                            {config.repoInfo?.private ? 'Private' : 'Public'}
                          </Badge>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertCircle className="w-5 h-5" />
                          <span className="font-medium">Not Connected</span>
                          {config?.connectionError && (
                            <span className="text-sm text-slate-500 ml-2">
                              ({config.connectionError})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {config?.repoInfo && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={config.repoInfo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on GitHub
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Repository Details */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col justify-center">
                        <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Owner</div>
                        <div className="font-mono text-sm">{config.owner}</div>
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Repository</div>
                        <div className="font-mono text-sm">{config.repo}</div>
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Branch</div>
                        <div className="font-mono text-sm">{config.branch}</div>
                      </div>
                    </div>
                    
                    {config?.repoInfo && config.repoInfo.description && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {config.repoInfo.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">Configuration Required</span>
                    </div>
                    <p className="text-sm text-amber-600 dark:text-amber-500 mt-1">
                      Please set up your environment variables to configure GitCDN.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Setup Instructions:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li>Copy <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">env.example</code> to <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">.env.local</code></li>
                      <li>Fill in your GitHub repository details in <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">.env.local</code></li>
                      <li>Create a GitHub Personal Access Token with <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">repo</code> scope</li>
                      <li>Restart the development server</li>
                    </ol>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <h4 className="font-medium mb-2">Required Environment Variables:</h4>
                    <div className="space-y-2 text-sm font-mono">
                      <div><span className="text-slate-500">GITHUB_OWNER=</span>your_github_username</div>
                      <div><span className="text-slate-500">GITHUB_REPO=</span>your_cdn_repo</div>
                      <div><span className="text-slate-500">GITHUB_BRANCH=</span>main</div>
                      <div><span className="text-slate-500">GITHUB_TOKEN=</span>ghp_your_token_here</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
