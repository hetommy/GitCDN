# GitCDN Raycast Extension

A Raycast extension for managing your GitCDN files directly from your command palette. Upload, view, rename, and delete files in your GitHub-based CDN repository with ease.

## Features

- **View Files**: Browse all files in your CDN with search and filtering
- **Upload File**: Upload new files with optional custom naming
- **Delete File**: Remove files with confirmation
- **Rename File**: Rename existing files (creates new file + deletes old)
- **Repository Status**: View connection status and repository information

## Prerequisites

- [Raycast app](https://raycast.com/) installed
- Node.js 18+ (for development)
- GitHub Personal Access Token with `repo` scope
- A GitHub repository to use as your CDN

## Installation

### For Development

1. Clone or download this extension
2. Navigate to the extension directory:
   ```bash
   cd raycast-extension
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run in development mode:
   ```bash
   npm run dev
   ```

### For Production

1. Build the extension:
   ```bash
   npm run build
   ```
2. The extension will be available in your Raycast commands

## Configuration

Before using the extension, you need to configure your GitHub credentials:

1. Open Raycast Preferences (⌘ + ,)
2. Go to Extensions → GitCDN
3. Fill in the required fields:

### Required Settings

- **GitHub Personal Access Token**: Your GitHub token with `repo` scope
  - Get one at: https://github.com/settings/tokens
  - Required scopes: `repo` (Full control of private repositories)

- **GitHub Owner**: Your GitHub username or organization name

- **GitHub Repository**: The repository name where your CDN files are stored

### Optional Settings

- **GitHub Branch**: The branch to use (default: `main`)

## Usage

### View Files
- Command: "View Files"
- Browse all files in your CDN
- Search and filter files
- Copy URLs, open in browser, or delete files

### Upload File
- Command: "Upload File"
- Select a file from your system
- Optionally specify a custom filename
- File URL is copied to clipboard after upload

### Delete File
- Command: "Delete File"
- Search and select file to delete
- Confirmation required before deletion

### Rename File
- Command: "Rename File"
- Select file to rename
- Enter new filename
- Creates new file and deletes old one

### Repository Status
- Command: "Repository Status"
- View connection status
- See repository information
- Check file count and repository size

## GitHub Token Setup

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "GitCDN Raycast Extension"
4. Select the `repo` scope (Full control of private repositories)
5. Click "Generate token"
6. Copy the token and paste it into Raycast preferences

## Publishing to Raycast Store

To publish your extension to the Raycast Store:

1. **Prepare your extension**:
   - Ensure all functionality works correctly
   - Test with different file types and sizes
   - Verify error handling

2. **Create store assets**:
   - Add `assets/extension-icon.png` (512x512px)
   - Add command icons in `assets/` directory
   - Update `package.json` with proper metadata

3. **Submit to Raycast**:
   - Follow the [Raycast Store submission guide](https://developers.raycast.com/updates/store-submission)
   - Ensure your extension meets all requirements
   - Test thoroughly before submission

## Development

### Project Structure

```
raycast-extension/
├── package.json          # Extension manifest and dependencies
├── tsconfig.json         # TypeScript configuration
├── README.md            # This file
├── assets/              # Icons and images
└── src/
    ├── view-files.tsx   # Browse files command
    ├── upload-file.tsx # Upload file command
    ├── delete-file.tsx # Delete file command
    ├── rename-file.tsx # Rename file command
    ├── repo-status.tsx # Repository status command
    └── utils/
        ├── github.ts   # GitHub API client
        └── preferences.ts # Preference utilities
```

### Key Dependencies

- `@raycast/api`: Raycast SDK for building extensions
- `@raycast/utils`: Additional Raycast utilities
- `@octokit/rest`: GitHub API client

### Error Handling

The extension includes comprehensive error handling:
- Configuration validation
- GitHub API error handling
- Network error recovery
- User-friendly error messages

### Testing

Test the extension with:
- Different file types (images, documents, archives)
- Large files
- Network interruptions
- Invalid credentials
- Missing repository

## Troubleshooting

### Common Issues

**"Configuration Error" message**:
- Check that all required preferences are filled
- Verify your GitHub token has the correct permissions
- Ensure the repository exists and is accessible

**"Connection failed"**:
- Verify your GitHub token is valid and not expired
- Check that the repository name and owner are correct
- Ensure you have access to the repository

**Upload failures**:
- Check file size limits (GitHub has a 100MB limit per file)
- Verify the filename doesn't already exist
- Ensure you have write permissions to the repository

### Getting Help

If you encounter issues:
1. Check the Raycast logs for error details
2. Verify your GitHub token permissions
3. Test with a simple text file first
4. Ensure your repository is accessible via GitHub web interface

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Changelog

### v1.0.0
- Initial release
- View, upload, delete, and rename files
- Repository status monitoring
- GitHub authentication via preferences
