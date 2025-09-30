# GitCDN

A web application which transforms a GitHub repository into a powerful CDN. Built with Next.js, shadcn/ui, and the GitHub API.

![GitCDN](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-1.0-black?style=for-the-badge)

## 🚀 One-Click Deploy

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tommy-rowes-projects/GitCDN&env=GITHUB_OWNER,GITHUB_REPO,GITHUB_BRANCH,GITHUB_TOKEN&envDescription=GitHub%20repository%20configuration%20for%20CDN%20hosting&envLink=https://github.com/tommy-rowes-projects/GitCDN/blob/main/SETUP.md)

### Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template-id?referralCode=your-code)

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/tommy-rowes-projects/GitCDN)

**One-click deployment options!** These buttons will:
- ✅ Fork the repository to your GitHub account
- ✅ Deploy to your chosen platform automatically
- ✅ Set up the project with all necessary configurations
- ✅ Guide you through GitHub setup

> **Note**: After deployment, you'll need to create a GitHub Personal Access Token and configure the environment variables. See the [SETUP.md](./SETUP.md) for detailed instructions.

## ✨ Features

- 🚀 **Easy File Upload** - Drag and drop files directly to your GitHub repository
- 🔗 **Direct File Access** - Access your files directly from GitHub
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

#### Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/tommy-rowes-projects/GitCDN.git
   cd GitCDN
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your GitHub details
   ```

4. **Create a GitHub Personal Access Token**
   - Go to [GitHub Settings → Fine-grained tokens](https://github.com/settings/personal-access-tokens/new?type=fine_grained)
   - **Token name**: `GitCDN Token`
   - **Expiration**: Choose your preference (90 days recommended)
   - **Repository access**: Select "Selected repositories" → Choose your CDN repository
   - **Repository permissions**:
     - ✅ **Contents: Read and write**
     - ✅ **Metadata: Read**
     - ❌ All other permissions: No access
   - **Account permissions**: None needed
   - Click "Generate token" and copy it to your `.env.local`

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

> **📖 Detailed Setup**: See [SETUP.md](./SETUP.md) for comprehensive setup instructions.

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# GitHub Repository Configuration (Required)
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_cdn_repo
GITHUB_BRANCH=main
GITHUB_TOKEN=your_github_personal_access_token
```

### GitHub Repository Setup

1. Create a new public repository on GitHub for your CDN files
2. Create a GitHub Personal Access Token with `repo` scope
3. Configure your environment variables in `.env.local`
4. Start the development server

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
- Set up your environment variables in `.env.local`
- Create a GitHub Personal Access Token
- Test the connection in the Settings page

### 2. Upload Files
- Navigate to Dashboard
- Drag and drop files or click to select
- Files are automatically uploaded to your GitHub repository

### 3. Access Your Files
- View uploaded files in the dashboard
- Click "Copy URL" to get direct file links
- Files are accessible directly from your GitHub repository

### 4. Manage Files
- View file details and usage statistics
- Delete files when no longer needed
- Search and filter your assets

## 🔗 File Access

Your files will be accessible directly from your GitHub repository:

- **GitHub Raw**: `https://raw.githubusercontent.com/owner/repo/branch/path/to/file`

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