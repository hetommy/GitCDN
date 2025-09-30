'use client';

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, RefreshCw } from 'lucide-react';

interface UploadedFile {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
}

interface UploadZoneProps {
  onUploadComplete?: (files: UploadedFile[]) => void;
  onUploadSuccess?: () => void;
  onUploadingChange?: (isUploading: boolean) => void;
  onDuplicateFile?: (fileName: string) => void;
}

export function UploadZone({ onUploadComplete, onUploadSuccess, onUploadingChange, onDuplicateFile }: UploadZoneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Watch for when all uploads are completed or all files have been processed (completed/error)
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      const allProcessed = uploadedFiles.every(file => file.status === 'completed' || file.status === 'error');
      const allCompleted = uploadedFiles.every(file => file.status === 'completed');
      
      if (allProcessed) {
        setIsUploading(false); // Reset loading state regardless of success/failure
        if (onUploadingChange) {
          onUploadingChange(false); // Notify parent
        }
        
        if (allCompleted && onUploadSuccess) {
          onUploadSuccess(); // Only call success callback if ALL completed
        }
        // Clear files after processing, regardless of success/failure
        setUploadedFiles([]);
      }
    }
  }, [uploadedFiles, onUploadSuccess, onUploadingChange]);

  // Notify parent when uploading state changes
  useEffect(() => {
    if (onUploadingChange) {
      onUploadingChange(isUploading);
    }
  }, [isUploading, onUploadingChange]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'pending',
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.md', '.json'],
      'application/javascript': ['.js', '.ts', '.tsx', '.jsx'],
      'text/css': ['.css'],
      'text/html': ['.html'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const uploadFiles = async () => {
    const pendingFiles = uploadedFiles.filter(file => file.status === 'pending');
    
    if (pendingFiles.length === 0) return;
    
    setIsUploading(true);
    
    for (const fileData of pendingFiles) {
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileData.id ? { ...f, status: 'uploading' } : f)
      );

      try {
        const formData = new FormData();
        formData.append('file', fileData.file);
        formData.append('path', fileData.file.name);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          if (result.existingFile) {
            throw new Error(result.details || 'File already exists');
          }
          throw new Error(result.error || 'Upload failed');
        }
        
        setUploadedFiles(prev => {
          const updated = prev.map(f => f.id === fileData.id ? { 
            ...f, 
            status: 'completed',
            url: result.url
          } : f);
          
          return updated;
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        setUploadedFiles(prev => 
          prev.map(f => f.id === fileData.id ? { 
            ...f, 
            status: 'error',
            error: errorMessage
          } : f)
        );
        
        // If it's a duplicate file error, notify parent
        if (errorMessage.includes('already exists') && onDuplicateFile) {
          onDuplicateFile(fileData.file.name);
        }
      }
    }

    if (onUploadComplete) {
      onUploadComplete(uploadedFiles);
    }
  };

  // Show loading spinner when uploading
  if (isUploading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <RefreshCw className="h-16 w-16 text-slate-500 animate-spin" />
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Uploading Files...
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Please wait while your files are being uploaded to GitHub
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            This may take a few moments depending on file size
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
        <p className="text-lg font-medium mb-2">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-slate-500 dark:text-slate-400 mb-4">
          or click to select files
        </p>
        <p className="text-sm text-slate-400">
          Supports images, documents, code files (max 50MB)
        </p>
      </div>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Staged Files</h3>
                <Button onClick={uploadFiles} size="sm">
                  Upload All
                </Button>
              </div>
              
              <div className="space-y-2">
                {uploadedFiles.map(file => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center">
                        <Upload className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{file.file.name}</p>
                        <p className="text-xs text-slate-500">
                          {(file.file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {file.status === 'completed' && file.url && (
                        <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(file.url!)}>
                          Copy URL
                        </Button>
                      )}
                      {file.status === 'error' && (
                        <div className="flex flex-col items-end space-y-1">
                          <p className="text-sm text-red-500 max-w-48 text-right">
                            {file.error}
                          </p>
                          {file.error?.includes('already exists') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFile(file.id)}
                              className="text-xs"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      )}
                      {file.status !== 'error' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}