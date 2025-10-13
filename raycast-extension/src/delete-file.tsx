import {
  ActionPanel,
  Action,
  List,
  showToast,
  Toast,
  Icon,
  confirmAlert,
  Alert,
  open,
} from "@raycast/api";
import { useState, useEffect } from "react";
import { GitHubClient, FileInfo } from "./utils/github";
import { getPreferences, validatePreferences, getMissingPreferencesMessage } from "./utils/preferences";

export default function DeleteFile() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const validation = validatePreferences();
      if (!validation.valid) {
        setError(getMissingPreferencesMessage());
        return;
      }

      const preferences = getPreferences();
      const client = new GitHubClient(preferences);
      const result = await client.listFiles();

      if (result.success && result.files) {
        setFiles(result.files);
      } else {
        setError(result.error || "Failed to load files");
        await showToast({
          style: Toast.Style.Failure,
          title: "Failed to load files",
          message: result.error || "Unknown error",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      await showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getFileIcon = (filename: string): Icon => {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "svg":
      case "webp":
        return Icon.Image;
      case "pdf":
        return Icon.Document;
      case "txt":
      case "md":
        return Icon.Text;
      case "zip":
      case "tar":
      case "gz":
        return Icon.Folder;
      case "mp4":
      case "avi":
      case "mov":
        return Icon.Video;
      case "mp3":
      case "wav":
      case "flac":
        return Icon.Music;
      default:
        return Icon.Document;
    }
  };

  const handleDelete = async (file: FileInfo) => {
    const confirmed = await confirmAlert({
      title: "Delete File",
      message: `Are you sure you want to delete "${file.name}"? This action cannot be undone.`,
      primaryAction: {
        title: "Delete",
        style: Alert.ActionStyle.Destructive,
      },
      dismissAction: {
        title: "Cancel",
        style: Alert.ActionStyle.Cancel,
      },
    });

    if (!confirmed) return;

    try {
      const preferences = getPreferences();
      const client = new GitHubClient(preferences);
      const result = await client.deleteFile(file.name);

      if (result.success) {
        await showToast({
          style: Toast.Style.Success,
          title: "File deleted",
          message: `${file.name} has been deleted successfully`,
        });
        await loadFiles(); // Refresh the list
      } else {
        await showToast({
          style: Toast.Style.Failure,
          title: "Delete failed",
          message: result.error || "Unknown error",
        });
      }
    } catch (err) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Delete failed",
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };

  if (error) {
    return (
      <List>
        <List.EmptyView
          icon={Icon.ExclamationMark}
          title="Configuration Error"
          description={error}
          actions={
            <ActionPanel>
              <Action
                title="Open Raycast Preferences"
                onAction={() => open("raycast://preferences")}
                icon={Icon.Gear}
              />
            </ActionPanel>
          }
        />
      </List>
    );
  }

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search files to delete..."
      throttle
    >
      <List.Section title={`Files (${filteredFiles.length})`}>
        {filteredFiles.map((file) => (
          <List.Item
            key={file.sha}
            title={file.name}
            subtitle={formatFileSize(file.size)}
            icon={getFileIcon(file.name)}
            accessories={[
              {
                text: "Click to delete",
                icon: Icon.Trash,
              },
            ]}
            actions={
              <ActionPanel>
                <ActionPanel.Section>
                  <Action
                    title="Delete File"
                    icon={Icon.Trash}
                    style={Action.Style.Destructive}
                    onAction={() => handleDelete(file)}
                  />
                </ActionPanel.Section>
                <ActionPanel.Section>
                  <Action
                    title="Refresh"
                    icon={Icon.ArrowClockwise}
                    onAction={loadFiles}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
      {filteredFiles.length === 0 && !isLoading && (
        <List.EmptyView
          icon={Icon.Document}
          title="No files found"
          description="No files match your search criteria"
        />
      )}
    </List>
  );
}
