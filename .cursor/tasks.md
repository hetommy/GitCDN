# GitCDN - Future Tasks

## Drag & Drop Functionality
- **Priority**: Medium
- **Status**: Planned
- **Description**: Implement global drag and drop functionality for file uploads
- **Details**: 
  - Global drag overlay that works across all pages
  - Seamless transition from drag overlay to upload modal
  - Professional UI with consistent sizing and styling
  - Smart navigation (redirect to dashboard when files dropped on landing page)
- **Technical Notes**:
  - Previously implemented but removed due to complexity
  - Would need proper file handling and modal state management
  - Consider using react-dropzone for better cross-browser support
- **Files to Create/Modify**:
  - `src/components/drag-overlay.tsx`
  - `src/components/global-drag-provider.tsx`
  - Update `src/app/layout.tsx` to include global provider
  - Update dashboard and landing pages to handle drag events

## Railway Deployment Setup
- **Priority**: High
- **Status**: Planned
- **Description**: Set up Railway one-click deployment template
- **Details**:
  - Create Railway template from the GitCDN repository
  - Configure environment variables in Railway template
  - Update README with working Railway deployment button
  - Test the complete deployment flow
- **Steps to Complete**:
  1. Go to [railway.app](https://railway.app) and sign in
  2. Create new project from GitHub repository
  3. Configure environment variables (GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH, GITHUB_TOKEN)
  4. Go to Settings → Template and create template
  5. Copy template URL and update README.md
  6. Test the deployment button works correctly
- **Files to Modify**:
  - `README.md` - Update Railway button URL
  - `SETUP.md` - Add Railway deployment instructions

## Other Future Enhancements
- **File Upload Progress**: Real-time upload progress with GitHub API
- **CDN URL Generation**: Multiple CDN endpoint support (GitHub Raw, jsDelivr)
- **File Management**: Delete, rename, and organize files
- **Analytics Dashboard**: Track file usage and bandwidth
- **Bulk Operations**: Select multiple files for batch actions
- **File Preview**: Image previews and file type icons
- **Search & Filter**: Advanced file search and filtering
- **Repository Settings**: Multiple repository support
- **Custom Domains**: Support for custom CDN domains
