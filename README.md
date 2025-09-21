# GitCDN

A beautiful, modern web application that transforms your GitHub repository into a powerful CDN. Built with Next.js, shadcn/ui, and GitHub API.

![GitCDN](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-1.0-black?style=for-the-badge)

## 🚀 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tommy-rowes-projects/GitCDN&env=GITHUB_APP_ID,GITHUB_APP_PRIVATE_KEY,GITHUB_APP_CLIENT_ID,GITHUB_APP_CLIENT_SECRET,GITHUB_APP_WEBHOOK_SECRET,NEXTAUTH_URL,NEXTAUTH_SECRET&envDescription=GitHub%20App%20configuration%20and%20NextAuth%20settings&envLink=https://github.com/tommy-rowes-projects/GitCDN/blob/main/GITHUB_APP_SETUP.md)

**One-click deployment to Vercel!** This button will:
- ✅ Clone the repository to your GitHub account
- ✅ Deploy to Vercel automatically
- ✅ Set up the project with all necessary configurations
- ✅ Guide you through GitHub App setup

> **Note**: After deployment, you'll need to create a GitHub App and configure the environment variables. See the [GitHub App Setup Guide](GITHUB_APP_SETUP.md) for detailed instructions.

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
3. **Create a GitHub App** (see [GitHub App Setup Guide](GITHUB_APP_SETUP.md))
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

4. **Create a GitHub App**
   - Follow the [GitHub App Setup Guide](GITHUB_APP_SETUP.md)
   - Configure your `.env.local` with the GitHub App credentials

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
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
GITHUB_APP_ID=your_app_id
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
GITHUB_APP_CLIENT_ID=your_client_id
GITHUB_APP_CLIENT_SECRET=your_client_secret
GITHUB_APP_WEBHOOK_SECRET=your_webhook_secret
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