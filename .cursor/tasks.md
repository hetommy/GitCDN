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

## Other Future Enhancements
- **GitHub OAuth Integration**: Complete authentication setup
- **File Upload Progress**: Real-time upload progress with GitHub API
- **CDN URL Generation**: Multiple CDN endpoint support (GitHub Raw, jsDelivr)
- **File Management**: Delete, rename, and organize files
- **Analytics Dashboard**: Track file usage and bandwidth
- **Bulk Operations**: Select multiple files for batch actions
- **File Preview**: Image previews and file type icons
- **Search & Filter**: Advanced file search and filtering
- **Repository Settings**: Multiple repository support
- **Custom Domains**: Support for custom CDN domains
