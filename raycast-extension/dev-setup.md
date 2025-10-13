# GitCDN Raycast Extension - Development Setup

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run in development mode:**
   ```bash
   npm run dev
   ```

3. **Configure preferences in Raycast:**
   - Open Raycast Preferences (⌘ + ,)
   - Go to Extensions → GitCDN
   - Fill in your GitHub credentials:
     - GitHub Personal Access Token
     - GitHub Owner (username/org)
     - GitHub Repository (repo name)
     - GitHub Branch (default: main)

## Testing Commands

1. **View Files** - Browse your CDN files
2. **Upload File** - Shows message to use web interface
3. **Delete File** - Remove files from CDN
4. **Rename File** - Rename existing files
5. **Repository Status** - Check connection and repo info

## Troubleshooting

### Icon Issues
If you see "Could not install extension from development sources" with icon errors:
- Ensure all icon files exist in `assets/` directory
- Check that `package.json` references correct icon paths
- Icons should be 512x512 PNG files

### Configuration Issues
- Verify GitHub token has `repo` scope
- Check repository name and owner are correct
- Ensure repository exists and is accessible

### Development Tips
- Use `console.log()` for debugging (appears in terminal)
- Check Raycast logs for error details
- Test with simple text files first
- Verify GitHub API rate limits

## File Structure
```
raycast-extension/
├── package.json          # Extension manifest
├── tsconfig.json         # TypeScript config
├── assets/               # Icon files
│   ├── extension-icon.png
│   ├── view-files.png
│   ├── upload-file.png
│   ├── delete-file.png
│   ├── rename-file.png
│   └── repo-status.png
└── src/
    ├── view-files.tsx    # Browse files
    ├── upload-file.tsx   # Upload (web interface)
    ├── delete-file.tsx   # Delete files
    ├── rename-file.tsx   # Rename files
    ├── repo-status.tsx   # Repository status
    └── utils/
        ├── github.ts     # GitHub API client
        └── preferences.ts # Preference utilities
```
