'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Upload, Settings as SettingsIcon, RefreshCw, FileX } from 'lucide-react';
import { UploadZone } from '@/components/upload-zone';
import { SettingsModal } from '@/components/settings-modal';
import { FileBrowser } from '@/components/file-browser';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Dashboard() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [hasFiles, setHasFiles] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [initialFiles, setInitialFiles] = useState<any[]>([]);

  // Check for files on initial load
  useEffect(() => {
    const checkFiles = async () => {
      try {
        const response = await fetch('/api/files');
        const data = await response.json();
        if (response.ok) {
          setHasFiles(data.files && data.files.length > 0);
          setInitialFiles(data.files || []);
        }
      } catch (error) {
        console.error('Failed to check files:', error);
      } finally {
        setIsInitialLoad(false);
      }
    };

    checkFiles();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img 
                src="/git-merge-folder.svg" 
                alt="Git Merge Folder" 
                className="w-6 h-6 brightness-0 dark:invert" 
                suppressHydrationWarning 
              />
              <h1 className="text-xl font-bold">GitCDN</h1>
            </div>
                <div className="flex items-center space-x-2">
                  <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Upload className="w-4 h-4 mr-2" suppressHydrationWarning />
                        Upload Files
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Upload Files</DialogTitle>
                        <DialogDescription>
                          Upload files to your GitHub repository. Files will be
                          accessible directly from GitHub.
                        </DialogDescription>
                      </DialogHeader>
                      <UploadZone />
                    </DialogContent>
                  </Dialog>
                  <ThemeToggle />
                  <Button variant="ghost" size="icon" onClick={() => setIsSettingsModalOpen(true)}>
                    <SettingsIcon className="w-4 h-4" suppressHydrationWarning />
                  </Button>
                </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Loading State - Show while determining if files exist */}
          {isInitialLoad && (
            <Card>
              <CardContent className="p-12 text-center">
                    <div className="flex items-center justify-center mb-4">
                      <RefreshCw className="w-6 h-6 animate-spin text-slate-400" suppressHydrationWarning />
                      <span className="ml-2 text-slate-500">Loading files...</span>
                    </div>
              </CardContent>
            </Card>
          )}

          {/* No Files Found - Only show if no files and not initial loading */}
          {!hasFiles && !isInitialLoad && (
            <Card>
              <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileX className="w-8 h-8 text-slate-400" suppressHydrationWarning />
                    </div>
                <h3 className="text-lg font-medium mb-2">No Files Found</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Your repository is empty. Upload some files to get started!
                </p>
              </CardContent>
            </Card>
          )}

          {/* File Browser - Only show after initial load */}
          {!isInitialLoad && (
            <FileBrowser 
              onFilesLoaded={setHasFiles}
              initialFiles={initialFiles}
            />
          )}
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)} 
      />
    </div>
  );
}