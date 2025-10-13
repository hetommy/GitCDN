import {
  ActionPanel,
  Action,
  List,
  showToast,
  Toast,
  Icon,
  Form,
  confirmAlert,
  Alert,
  open,
} from "@raycast/api";
import { useState, useEffect } from "react";
import { GitHubClient, FileInfo } from "./utils/github";
import { getPreferences, validatePreferences, getMissingPreferencesMessage } from "./utils/preferences";

export default function RenameFile() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [newName, setNewName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

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

  const handleSelectFile = (file: FileInfo) => {
    setSelectedFile(file);
    setNewName(file.name);
  };

  const handleRename = async () => {
    if (!selectedFile || !newName.trim()) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Invalid input",
        message: "Please select a file and enter a new name",
      });
      return;
    }

    if (newName === selectedFile.name) {
      await showToast({
        style: Toast.Style.Failure,
        title: "No change",
        message: "The new name is the same as the current name",
      });
      return;
    }

    const confirmed = await confirmAlert({
      title: "Rename File",
      message: `Are you sure you want to rename "${selectedFile.name}" to "${newName}"? This will create a new file and delete the old one.`,
      primaryAction: {
        title: "Rename",
        style: Alert.ActionStyle.Default,
      },
      dismissAction: {
        title: "Cancel",
        style: Alert.ActionStyle.Cancel,
      },
    });

    if (!confirmed) return;

    try {
      setIsRenaming(true);

      const preferences = getPreferences();
      const client = new GitHubClient(preferences);

      // First, we need to download the file content
      const response = await fetch(selectedFile.download_url);
      if (!response.ok) {
        throw new Error("Failed to download file");
      }
      const fileContent = await response.arrayBuffer();
      const file = new File([new Uint8Array(fileContent)], selectedFile.name, { type: "application/octet-stream" });

      // Upload with new name
      const uploadResult = await client.uploadFile(file, newName);
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "Failed to upload with new name");
      }

      // Delete the old file
      const deleteResult = await client.deleteFile(selectedFile.name);
      if (!deleteResult.success) {
        // If delete fails, we should try to clean up the new file
        await client.deleteFile(newName);
        throw new Error(deleteResult.error || "Failed to delete old file");
      }

      await showToast({
        style: Toast.Style.Success,
        title: "File renamed",
        message: `"${selectedFile.name}" renamed to "${newName}"`,
      });

      // Reset state and refresh
      setSelectedFile(null);
      setNewName("");
      await loadFiles();
    } catch (err) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Rename failed",
        message: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setIsRenaming(false);
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

  if (selectedFile) {
    return (
      <Form
        actions={
          <ActionPanel>
            <Action.SubmitForm
              title="Rename File"
              icon={Icon.Pencil}
              onSubmit={handleRename}
            />
            <Action
              title="Cancel"
              icon={Icon.Xmark}
              onAction={() => {
                setSelectedFile(null);
                setNewName("");
              }}
            />
          </ActionPanel>
        }
      >
        <Form.Description
          title="Rename File"
          text={`Renaming "${selectedFile.name}" (${formatFileSize(selectedFile.size)})`}
        />
        <Form.TextField
          id="newName"
          title="New Filename"
          placeholder="Enter new filename"
          value={newName}
          onChange={setNewName}
          info="Enter the new name for the file"
        />
        <Form.Description
          title="Note"
          text="This operation will create a new file with the new name and delete the old file. The file content will be preserved."
        />
      </Form>
    );
  }

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search files to rename..."
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
                text: "Click to rename",
                icon: Icon.Pencil,
              },
            ]}
            actions={
              <ActionPanel>
                <ActionPanel.Section>
                  <Action
                    title="Rename File"
                    icon={Icon.Pencil}
                    onAction={() => handleSelectFile(file)}
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
