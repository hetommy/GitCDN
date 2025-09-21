"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
  url?: string;
  error?: string;
}

interface UploadZoneProps {
  onUploadComplete?: (files: UploadedFile[]) => void;
}

export function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const FILE_SIZE_LIMITS = {
    IMAGE_MAX_SIZE: 10 * 1024 * 1024, // 10MB
    DOCUMENT_MAX_SIZE: 25 * 1024 * 1024, // 25MB
    CODE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ABSOLUTE_MAX_SIZE: 50 * 1024 * 1024, // 50MB
  };

  const getFileTypeLimit = (file: File): number => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return FILE_SIZE_LIMITS.IMAGE_MAX_SIZE;
    }
    
    if (['pdf', 'txt', 'md', 'json'].includes(extension || '')) {
      return FILE_SIZE_LIMITS.DOCUMENT_MAX_SIZE;
    }
    
    if (['js', 'ts', 'tsx', 'jsx', 'css', 'html'].includes(extension || '')) {
      return FILE_SIZE_LIMITS.CODE_MAX_SIZE;
    }
    
    return FILE_SIZE_LIMITS.ABSOLUTE_MAX_SIZE;
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const maxSize = getFileTypeLimit(file);
    
    if (file.size > FILE_SIZE_LIMITS.ABSOLUTE_MAX_SIZE) {
      return {
        valid: false,
        error: `File is too large. Maximum size allowed is ${formatFileSize(FILE_SIZE_LIMITS.ABSOLUTE_MAX_SIZE)}`
      };
    }
    
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File exceeds size limit for this file type. Maximum size is ${formatFileSize(maxSize)}`
      };
    }
    
    return { valid: true };
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles: File[] = [];
    const rejectedFiles: { file: File; error: string }[] = [];

    // Validate each file
    acceptedFiles.forEach((file) => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        rejectedFiles.push({ file, error: validation.error! });
      }
    });

    // Show rejected files
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, error }) => {
        console.error(`Rejected ${file.name}: ${error}`);
        // TODO: Show toast notification
      });
    }

    // Only process valid files
    if (validFiles.length === 0) return;

    const newFiles: UploadedFile[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: "uploading" as const,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    setIsUploading(true);

    // Simulate upload progress
    newFiles.forEach((uploadedFile) => {
      simulateUpload(uploadedFile);
    });
  }, []);

  const simulateUpload = (uploadedFile: UploadedFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setUploadedFiles((prev) =>
          prev.map((file) =>
            file.id === uploadedFile.id
              ? {
                  ...file,
                  progress: 100,
                  status: "completed" as const,
                  url: URL.createObjectURL(file.file),
                }
              : file
          )
        );

        // Check if all uploads are complete
        setTimeout(() => {
          setUploadedFiles((prev) => {
            const allComplete = prev.every((file) => file.status === "completed");
            if (allComplete) {
              setIsUploading(false);
              onUploadComplete?.(prev);
            }
            return prev;
          });
        }, 500);
      } else {
        setUploadedFiles((prev) =>
          prev.map((file) =>
            file.id === uploadedFile.id ? { ...file, progress } : file
          )
        );
      }
    }, 200);
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"],
      "application/pdf": [".pdf"],
      "text/*": [".txt", ".md", ".json", ".css", ".js", ".ts", ".tsx"],
    },
    multiple: true,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <Card>
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
              ${
                isDragActive
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
              }
            `}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            {isDragActive ? (
              <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                Drop the files here...
              </p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Supports images (10MB), documents (25MB), code files (5MB)
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Maximum file size: 50MB
                </p>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Upload Progress</h3>
            <div className="space-y-4">
              {uploadedFiles.map((uploadedFile) => (
                <div key={uploadedFile.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center">
                        {uploadedFile.status === "completed" ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : uploadedFile.status === "error" ? (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        ) : (
                          <Upload className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{uploadedFile.file.name}</p>
                        <p className="text-xs text-slate-500">
                          {formatFileSize(uploadedFile.file.size)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-500">
                        {Math.round(uploadedFile.progress)}%
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(uploadedFile.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Progress value={uploadedFile.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
