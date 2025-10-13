import {
  ActionPanel,
  Action,
  List,
  showToast,
  Toast,
  Icon,
  Color,
  open,
  Clipboard,
} from "@raycast/api";
import { useState, useEffect } from "react";
import { GitHubClient, RepositoryInfo } from "./utils/github";
import { getPreferences, validatePreferences, getMissingPreferencesMessage } from "./utils/preferences";

export default function RepoStatus() {
  const [repoInfo, setRepoInfo] = useState<RepositoryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "unknown">("unknown");
  const [fileCount, setFileCount] = useState<number>(0);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const validation = validatePreferences();
      if (!validation.valid) {
        setError(getMissingPreferencesMessage());
        setConnectionStatus("disconnected");
        return;
      }

      const preferences = getPreferences();
      const client = new GitHubClient(preferences);

      // Test connection and get repo info
      const connectionResult = await client.testConnection();
      if (connectionResult.success && connectionResult.repoInfo) {
        setRepoInfo(connectionResult.repoInfo);
        setConnectionStatus("connected");
      } else {
        setConnectionStatus("disconnected");
        setError(connectionResult.error || "Failed to connect to repository");
        await showToast({
          style: Toast.Style.Failure,
          title: "Connection failed",
          message: connectionResult.error || "Unknown error",
        });
        return;
      }

      // Get file count
      const filesResult = await client.listFiles();
      if (filesResult.success && filesResult.total !== undefined) {
        setFileCount(filesResult.total);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      setConnectionStatus("disconnected");
      await showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getStatusIcon = (): Icon => {
    switch (connectionStatus) {
      case "connected":
        return Icon.CheckCircle;
      case "disconnected":
        return Icon.XMarkCircle;
      default:
        return Icon.QuestionMark;
    }
  };

  const getStatusColor = (): Color => {
    switch (connectionStatus) {
      case "connected":
        return Color.Green;
      case "disconnected":
        return Color.Red;
      default:
        return Color.SecondaryText;
    }
  };

  const getStatusText = (): string => {
    switch (connectionStatus) {
      case "connected":
        return "Connected";
      case "disconnected":
        return "Disconnected";
      default:
        return "Unknown";
    }
  };

  if (error && connectionStatus === "disconnected") {
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
              <Action
                title="Refresh Status"
                icon={Icon.ArrowClockwise}
                onAction={loadStatus}
              />
            </ActionPanel>
          }
        />
      </List>
    );
  }

  return (
    <List isLoading={isLoading}>
      <List.Section title="Connection Status">
        <List.Item
          title="Repository Connection"
          subtitle={getStatusText()}
          icon={{ source: getStatusIcon(), tintColor: getStatusColor() }}
          accessories={[
            {
              text: connectionStatus === "connected" ? "✓" : "✗",
              icon: connectionStatus === "connected" ? Icon.Check : Icon.Xmark,
            },
          ]}
        />
      </List.Section>

      {repoInfo && (
        <List.Section title="Repository Information">
          <List.Item
            title="Repository Name"
            subtitle={repoInfo.name}
            icon={Icon.Book}
          />
          <List.Item
            title="Description"
            subtitle={repoInfo.description || "No description"}
            icon={Icon.Text}
          />
          <List.Item
            title="Visibility"
            subtitle={repoInfo.private ? "Private" : "Public"}
            icon={repoInfo.private ? Icon.Lock : Icon.Globe}
          />
          <List.Item
            title="Default Branch"
            subtitle={repoInfo.default_branch}
            icon={Icon.Code}
          />
          <List.Item
            title="Repository Size"
            subtitle={formatBytes(repoInfo.size * 1024)} // GitHub returns size in KB
            icon={Icon.HardDrive}
          />
          <List.Item
            title="CDN Files"
            subtitle={`${fileCount} files`}
            icon={Icon.Document}
          />
        </List.Section>
      )}

      <List.Section title="Configuration">
        <List.Item
          title="GitHub Owner"
          subtitle={getPreferences().githubOwner}
          icon={Icon.Person}
        />
        <List.Item
          title="Repository"
          subtitle={getPreferences().githubRepo}
          icon={Icon.Book}
        />
        <List.Item
          title="Branch"
          subtitle={getPreferences().githubBranch}
          icon={Icon.Code}
        />
      </List.Section>

      {repoInfo && (
        <List.Section title="Actions">
          <List.Item
            title="Open Repository"
            subtitle="View on GitHub"
            icon={Icon.Globe}
            actions={
              <ActionPanel>
                <Action
                  title="Open Repository"
                  icon={Icon.Globe}
                  onAction={() => open(repoInfo.html_url)}
                />
                <Action
                  title="Copy Repository URL"
                  icon={Icon.Clipboard}
                onAction={async () => {
                  await Clipboard.copy(repoInfo.html_url);
                  await showToast({
                    style: Toast.Style.Success,
                    title: "URL copied",
                    message: "Repository URL copied to clipboard",
                  });
                }}
                />
              </ActionPanel>
            }
          />
        </List.Section>
      )}

      <List.Section title="Actions">
        <List.Item
          title="Refresh Status"
          subtitle="Reload repository information"
          icon={Icon.ArrowClockwise}
          actions={
            <ActionPanel>
              <Action
                title="Refresh Status"
                icon={Icon.ArrowClockwise}
                onAction={loadStatus}
              />
              <Action
                title="Open Raycast Preferences"
                icon={Icon.Gear}
                onAction={() => open("raycast://preferences")}
              />
            </ActionPanel>
          }
        />
      </List.Section>
    </List>
  );
}
