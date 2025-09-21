"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Github, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  RefreshCw
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

interface Installation {
  id: number;
  account: {
    login: string;
    id: number;
    avatar_url: string;
  };
  repository_selection: 'all' | 'selected';
  repositories: Repository[];
}

interface RepositorySelectorProps {
  onRepositorySelect: (repo: Repository) => void;
  selectedRepository?: Repository | null;
}

export default function RepositorySelector({ 
  onRepositorySelect, 
  selectedRepository 
}: RepositorySelectorProps) {
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInstallations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/installations');
      if (!response.ok) {
        throw new Error('Failed to fetch installations');
      }
      
      const data = await response.json();
      setInstallations(data.installations || []);
    } catch (error) {
      console.error('Error loading installations:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInstallations();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Github className="w-5 h-5" />
            <span>Loading Repositories...</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span>Error Loading Repositories</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button onClick={loadInstallations} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (installations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Github className="w-5 h-5" />
            <span>No GitHub App Installed</span>
          </CardTitle>
          <CardDescription>
            You need to install the GitCDN GitHub App to select repositories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-300">
              Install the GitCDN GitHub App to get started with repository selection.
            </p>
            <Button asChild>
              <a 
                href={`https://github.com/apps/gitcdn/installations/new`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4 mr-2" />
                Install GitHub App
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {installations.map((installation) => (
        <Card key={installation.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src={installation.account.avatar_url} 
                  alt={installation.account.login}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <CardTitle className="text-lg">{installation.account.login}</CardTitle>
                  <CardDescription>
                    {installation.repository_selection === 'all' 
                      ? 'All repositories' 
                      : `${installation.repositories.length} selected repositories`
                    }
                  </CardDescription>
                </div>
              </div>
              <Badge variant={installation.repository_selection === 'all' ? 'default' : 'secondary'}>
                {installation.repository_selection}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {installation.repositories.length === 0 ? (
              <p className="text-slate-600 dark:text-slate-300">
                No repositories available for this installation.
              </p>
            ) : (
              <div className="grid gap-3">
                {installation.repositories.map((repo) => (
                  <div
                    key={repo.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedRepository?.id === repo.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                    onClick={() => onRepositorySelect(repo)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{repo.name}</h3>
                          {repo.private && (
                            <Badge variant="outline" className="text-xs">
                              Private
                            </Badge>
                          )}
                          {selectedRepository?.id === repo.id && (
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        {repo.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                            {repo.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                          <span>Branch: {repo.default_branch}</span>
                          <span>Size: {Math.round(repo.size / 1024)} KB</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a 
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
