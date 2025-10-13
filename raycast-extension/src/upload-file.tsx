import {
  ActionPanel,
  Action,
  List,
  showToast,
  Toast,
  Icon,
  open,
} from "@raycast/api";

export default function UploadFile() {
  return (
    <List>
      <List.EmptyView
        icon={Icon.Upload}
        title="File Upload Not Available"
        description="Direct file upload is not supported in Raycast extensions. Please use the web interface to upload files."
        actions={
          <ActionPanel>
            <Action
              title="Open Web Interface"
              icon={Icon.Globe}
              onAction={() => {
                // This would open the web interface if deployed
                showToast({
                  style: Toast.Style.Success,
                  title: "Web Interface",
                  message: "Please use the web interface at your deployed GitCDN URL to upload files",
                });
              }}
            />
            <Action
              title="View Files"
              icon={Icon.Document}
              onAction={() => {
                // This would open the view files command
                showToast({
                  style: Toast.Style.Success,
                  title: "View Files",
                  message: "Use the 'View Files' command to browse your CDN files",
                });
              }}
            />
          </ActionPanel>
        }
      />
    </List>
  );
}
