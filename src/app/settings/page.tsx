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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Github,
  Settings as SettingsIcon,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  Save,
  Eye,
  EyeOff,
  ExternalLink,
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

export default function SettingsPage() {
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showToken, setShowToken] = useState(false);
  const [formData, setFormData] = useState({
    owner: '',
    repo: '',
    branch: 'main',
    token: '',
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/config');
      const data = await response.json();
      setConfig(data);
      setFormData({
        owner: data.owner || '',
        repo: data.repo || '',
        branch: data.branch || 'main',
        token: '',
      });
    } catch (error) {
      console.error('Failed to fetch config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    // In a real app, you'd save this to your backend
    // For now, we'll just show a message
    alert(
      'Settings saved! (In a real app, this would update your configuration)'
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-slate-500 dark:text-slate-400">
              Configure your GitHub repository for CDN hosting
            </p>
          </div>
        </div>

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              GitHub Connection
            </CardTitle>
            <CardDescription>
              Current connection status to your GitHub repository
            </CardDescription>
          </CardHeader>
          <CardContent>
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

            {config?.repoInfo && (
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{config.repoInfo.name}</h3>
                    <p className="text-sm text-slate-500">
                      {config.owner}/{config.repo} • {config.branch}
                    </p>
                    {config.repoInfo.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {config.repoInfo.description}
                      </p>
                    )}
                  </div>
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
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Configuration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Repository Configuration</CardTitle>
            <CardDescription>
              Set up your GitHub repository for CDN hosting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  GitHub Username
                </label>
                <Input
                  placeholder="your-username"
                  value={formData.owner}
                  onChange={e =>
                    setFormData({ ...formData, owner: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Repository Name
                </label>
                <Input
                  placeholder="your-cdn-repo"
                  value={formData.repo}
                  onChange={e =>
                    setFormData({ ...formData, repo: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Branch</label>
              <Input
                placeholder="main"
                value={formData.branch}
                onChange={e =>
                  setFormData({ ...formData, branch: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Personal Access Token
              </label>
              <div className="relative">
                <Input
                  type={showToken ? 'text' : 'password'}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  value={formData.token}
                  onChange={e =>
                    setFormData({ ...formData, token: e.target.value })
                  }
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowToken(!showToken)}
                >
                  {showToken ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Create a token at{' '}
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  GitHub Settings → Developer settings → Personal access tokens
                </a>
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-500">
                <p>
                  Required permissions:{' '}
                  <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">
                    repo
                  </code>
                </p>
              </div>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Configuration
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CDN URLs */}
        {config?.connected && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                CDN URLs
              </CardTitle>
              <CardDescription>
                Your files will be accessible via these CDN endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    GitHub Raw
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={`https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}/`}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" size="sm">
                      Copy
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    jsDelivr
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={`https://cdn.jsdelivr.net/gh/${config.owner}/${config.repo}@${config.branch}/`}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" size="sm">
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
