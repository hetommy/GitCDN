'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  File, 
  FileImage, 
  FileText, 
  Download, 
  ExternalLink,
  RefreshCw,
  FolderOpen,
  Copy,
  List,
  Grid3X3,
  Trash2
} from 'lucide-react';

interface FileItem {
  name: string;
  size: number;
  sha: string;
  url: string;
  download_url: string;
  lastModified: string;
}

interface FileBrowserProps {
  onFilesLoaded?: (hasFiles: boolean) => void;
  hideLoading?: boolean;
  initialFiles?: FileItem[];
}

export function FileBrowser({ onFilesLoaded, hideLoading = false, initialFiles = [] }: FileBrowserProps) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [isLoading, setIsLoading] = useState(!hideLoading && initialFiles.length === 0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    fileName: string;
    fileSha: string;
  }>({ isOpen: false, fileName: '', fileSha: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchFiles = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else if (!hideLoading) {
        setIsLoading(true);
      }
      setError(null);
      const response = await fetch('/api/files');
      const data = await response.json();
      
      if (response.ok) {
        setFiles(data.files || []);
        onFilesLoaded?.(data.files && data.files.length > 0);
      } else {
        setError(data.error || 'Failed to fetch files');
        onFilesLoaded?.(false);
      }
    } catch (err) {
      setError('Failed to fetch files');
      console.error('Error fetching files:', err);
      onFilesLoaded?.(false);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (initialFiles.length === 0) {
      fetchFiles();
    } else {
      setIsLoading(false);
    }
  }, [initialFiles.length]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImageFile = (filename: string): boolean => {
    const ext = filename.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico'].includes(ext || '');
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico'].includes(ext || '')) {
      return <FileImage className="w-4 h-4" />;
    }
    if (['txt', 'md', 'json', 'js', 'ts', 'html', 'css'].includes(ext || '')) {
      return <FileText className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };

  const copyToClipboard = async (url: string, event: React.MouseEvent) => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        toast.success('URL copied to clipboard!');
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        textArea.remove();
        
        if (successful) {
          toast.success('URL copied to clipboard!');
        } else {
          throw new Error('execCommand copy failed');
        }
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      toast.error('Failed to copy URL. Please try again.');
    }
  };

  const handleDeleteClick = (fileName: string, fileSha: string) => {
    setDeleteDialog({
      isOpen: true,
      fileName,
      fileSha,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.fileName || !deleteDialog.fileSha) return;

    setIsDeleting(true);
    try {
      const response = await fetch('/api/files/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: deleteDialog.fileName,
          sha: deleteDialog.fileSha,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`File ${deleteDialog.fileName} deleted successfully`);
        // Remove the file from the local state
        setFiles(prev => prev.filter(file => file.name !== deleteDialog.fileName));
        // Update the parent component about the change
        onFilesLoaded?.(files.length - 1 > 0);
        setDeleteDialog({ isOpen: false, fileName: '', fileSha: '' });
      } else {
        toast.error(data.error || 'Failed to delete file');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, fileName: '', fileSha: '' });
  };

  if (isLoading && !hideLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Repository Files
          </CardTitle>
        </CardHeader>
        <CardContent>
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin text-slate-400" suppressHydrationWarning />
                <span className="ml-2 text-slate-500">Loading files...</span>
              </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Repository Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchFiles} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" suppressHydrationWarning />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5" suppressHydrationWarning />
                Repository Files
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {files.length} file{files.length !== 1 ? 's' : ''}
                </Badge>
                <div className="flex items-center gap-1 border rounded-md">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 px-2"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 px-2"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                </div>
                <Button 
                  onClick={() => fetchFiles(true)} 
                  variant="outline" 
                  size="sm"
                  disabled={isRefreshing}
                  className="h-9 px-1"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} suppressHydrationWarning />
                </Button>
              </div>
            </div>
          </CardHeader>
      <CardContent>
        {files.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <FolderOpen className="w-12 h-12 mx-auto mb-4 text-slate-300" suppressHydrationWarning />
                <p>No files found in the repository</p>
                <p className="text-sm mt-1">Upload some files to get started!</p>
              </div>
        ) : (
          viewMode === 'list' ? (
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={`${file.name}-${file.sha}`}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {isImageFile(file.name) ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <img
                          src={file.download_url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to icon if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = '';
                              parent.appendChild(getFileIcon(file.name));
                            }
                          }}
                        />
                      </div>
                    ) : (
                      getFileIcon(file.name)
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-slate-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => copyToClipboard(file.download_url, e)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <a href={file.download_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Open</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const downloadUrl = `/api/download?url=${encodeURIComponent(file.download_url)}&filename=${encodeURIComponent(file.name)}`;
                                const link = document.createElement('a');
                                link.href = downloadUrl;
                                link.download = file.name;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Download</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(file.name, file.sha)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {files.map((file) => (
                <div
                  key={`${file.name}-${file.sha}`}
                  className="group relative bg-slate-50 dark:bg-slate-800 rounded-lg p-4 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex flex-col items-center text-center">
                    {isImageFile(file.name) ? (
                      <div className="h-24 flex items-center justify-center mb-3">
                        <img
                          src={file.download_url}
                          alt={file.name}
                          className="h-24 object-contain"
                          onError={(e) => {
                            // Fallback to icon if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = '';
                              parent.appendChild(getFileIcon(file.name));
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                        {getFileIcon(file.name)}
                      </div>
                    )}
                    <p className="text-xs font-medium truncate w-full mb-1" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  
                      {/* Action buttons - shown on hover */}
                      <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={(e) => copyToClipboard(file.download_url, e)}
                              className="h-8 w-8 p-0"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="secondary"
                              size="sm"
                              asChild
                              className="h-8 w-8 p-0"
                            >
                              <a href={file.download_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Open</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                const downloadUrl = `/api/download?url=${encodeURIComponent(file.download_url)}&filename=${encodeURIComponent(file.name)}`;
                                const link = document.createElement('a');
                                link.href = downloadUrl;
                                link.download = file.name;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Download</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleDeleteClick(file.name, file.sha)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                </div>
              ))}
            </div>
          )
        )}
      </CardContent>
    </Card>

    <DeleteConfirmationDialog
      isOpen={deleteDialog.isOpen}
      onClose={handleDeleteCancel}
      onConfirm={handleDeleteConfirm}
      fileName={deleteDialog.fileName}
      isDeleting={isDeleting}
    />
      </TooltipProvider>
  );
}
