# GitCDN

A beautiful, modern web application that transforms your GitHub repository into a powerful CDN. Built with Next.js, shadcn/ui, and GitHub API.

![GitCDN](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-1.0-black?style=for-the-badge)

## 🚀 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tommy-rowes-projects/GitCDN&env=GITHUB_OWNER,GITHUB_REPO,GITHUB_BRANCH,GITHUB_TOKEN&envDescription=GitHub%20repository%20configuration%20for%20CDN%20hosting&envLink=https://github.com/tommy-rowes-projects/GitCDN/blob/main/README.md)

**One-click deployment to Vercel!** This button will:
- ✅ Clone the repository to your GitHub account
- ✅ Deploy to Vercel automatically
- ✅ Set up the project with all necessary configurations
- ✅ Guide you through GitHub setup

> **Note**: After deployment, you'll need to create a GitHub Personal Access Token and configure the environment variables. See the setup instructions below.

## ✨ Features

- 🚀 **Easy File Upload** - Drag and drop files directly to your GitHub repository
- 🔗 **Multiple CDN URLs** - Get GitHub Raw and jsDelivr URLs instantly
- 📊 **Analytics Dashboard** - Track file usage and bandwidth
- 🎨 **Beautiful UI** - Modern interface built with shadcn/ui
- 🔐 **GitHub OAuth** - Secure authentication with GitHub
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Fast Performance** - Optimized for speed and efficiency

## 🚀 Quick Start

### Option 1: Deploy to Vercel (Recommended)

**The easiest way to get started!**

1. **Click the "Deploy with Vercel" button above**
2. **Follow the setup wizard** in Vercel
3. **Create a GitHub Personal Access Token** (see instructions below)
4. **Configure environment variables** in Vercel dashboard
5. **Start using your CDN!**

### Option 2: Local Development

**For developers who want to run locally:**

#### Prerequisites
- Node.js 18+ 
- npm or yarn
- GitHub account
- GitHub repository for CDN assets

#### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tommy-rowes-projects/GitCDN.git
   cd GitCDN
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```

4. **Create a GitHub Personal Access Token**
   - Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
   - Click "Generate new token (classic)"
   - Give it a name like "GitCDN"
   - Select the `repo` scope
   - Copy the token and add it to your `.env.local`

5. **Configure your repository**
   - Set `GITHUB_OWNER` to your GitHub username
   - Set `GITHUB_REPO` to your CDN repository name
   - Set `GITHUB_BRANCH` to your preferred branch (default: main)

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# GitHub Repository (optional - can be set in UI)
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_cdn_repo
GITHUB_BRANCH=main
```

### GitHub Repository Setup

1. Create a new public repository on GitHub
2. Go to Settings page in the app
3. Enter your repository details:
   - Repository Owner (your GitHub username)
   - Repository Name
   - Branch (usually `main` or `master`)

## 📁 Project Structure

```
gitcdn/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Dashboard page
│   │   ├── settings/       # Settings page
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   └── upload-zone.tsx # File upload component
│   └── lib/               # Utility functions
│       ├── auth.ts        # NextAuth configuration
│       └── github.ts      # GitHub API integration
├── public/                # Static assets
│   └── images/           # Sample images
└── README.md
```

## 🎯 Usage

### 1. Configure Repository
- Go to Settings page
- Enter your GitHub repository details
- Test the connection

### 2. Upload Files
- Navigate to Dashboard
- Drag and drop files or click to select
- Files are automatically uploaded to your GitHub repository

### 3. Get CDN URLs
- View uploaded files in the dashboard
- Click "Copy URL" to get CDN links
- Choose between GitHub Raw or jsDelivr URLs

### 4. Manage Files
- View file details and usage statistics
- Delete files when no longer needed
- Search and filter your assets

## 🔗 CDN URL Formats

Your files will be accessible via multiple CDN endpoints:

- **GitHub Raw**: `https://raw.githubusercontent.com/owner/repo/branch/path/to/file`
- **jsDelivr**: `https://cdn.jsdelivr.net/gh/owner/repo@branch/path/to/file`

## 🚀 Deployment

### Deploy to Vercel (One-Click)

**Use the "Deploy with Vercel" button above for the easiest deployment experience!**

The deployment button will:
1. **Fork the repository** to your GitHub account
2. **Create a new Vercel project** automatically
3. **Set up the build configuration** for Next.js
4. **Guide you through environment variable setup**

### Manual Deployment

If you prefer to deploy manually:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

3. **Update GitHub App URLs**
   - Update Homepage URL to your Vercel domain
   - Update Authorization callback URL to your Vercel domain
   - Update `NEXTAUTH_URL` in environment variables

### Environment Variables for Production

```env
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_cdn_repo
GITHUB_BRANCH=main
GITHUB_TOKEN=your_github_personal_access_token
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_production_secret
```

## 🛠 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Components

This project uses shadcn/ui components. To add new components:

```bash
npx shadcn@latest add [component-name]
```

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🆘 Support

- Create an issue for bug reports
- Start a discussion for feature requests
- Check the documentation for common questions

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [GitHub API](https://docs.github.com/en/rest) - Repository management
- [jsDelivr](https://www.jsdelivr.com/) - CDN service

---

Built with ❤️ using modern web technologies