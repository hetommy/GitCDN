# 🚀 GitCDN Setup Guide

This guide will help you set up GitCDN locally or deploy it to production.

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- GitHub account
- A GitHub repository for CDN files (can be public or private)

## 🏠 Local Development

### 1. Clone and Install

```bash
git clone https://github.com/your-username/GitCDN.git
cd GitCDN
npm install
```

### 2. Environment Configuration

```bash
# Copy the environment template
cp env.example .env.local

# Edit the configuration
nano .env.local  # or use your preferred editor
```

### 3. Configure Your GitHub Repository

Edit `.env.local` with your GitHub details:

```env
# Required: Your GitHub username or organization
GITHUB_OWNER=your_github_username

# Required: Repository name for CDN files
GITHUB_REPO=your_cdn_repo

# Optional: Branch name (defaults to 'main')
GITHUB_BRANCH=main

# Required: GitHub Personal Access Token
GITHUB_TOKEN=ghp_your_personal_access_token_here
```

### 4. Create GitHub Personal Access Token

1. Go to [GitHub Settings → Fine-grained tokens](https://github.com/settings/personal-access-tokens/new?type=fine_grained)
2. **Token name**: `GitCDN Token`
3. **Expiration**: Choose your preference (90 days recommended)
4. **Repository access**: Select "Selected repositories" → Choose your CDN repository
5. **Repository permissions**:
   - ✅ **Contents: Read and write**
   - ✅ **Metadata: Read**
   - ❌ All other permissions: No access
6. **Account permissions**: None needed
7. Click "Generate token" and copy it to your `.env.local`

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your GitCDN!

## 🚀 Production Deployment

### Deploy to Vercel (Recommended)

1. **Fork this repository** to your GitHub account
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your forked repository
   - Deploy!

3. **Configure Environment Variables** in Vercel dashboard:
   ```env
   GITHUB_OWNER=your_github_username
   GITHUB_REPO=your_cdn_repo
   GITHUB_BRANCH=main
   GITHUB_TOKEN=ghp_your_personal_access_token_here
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=your_random_secret_here
   ```

### Deploy to Other Platforms

The app works on any platform that supports Next.js:
- **Netlify**: Connect your GitHub repo
- **Railway**: Deploy with one click
- **DigitalOcean App Platform**: Deploy from GitHub
- **AWS Amplify**: Connect your repository

## 🔧 Configuration Options

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GITHUB_OWNER` | Your GitHub username or organization | `myusername` |
| `GITHUB_REPO` | Repository name for CDN files | `my-cdn-assets` |
| `GITHUB_TOKEN` | GitHub Personal Access Token | `ghp_xxxxxxxxxxxx` |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GITHUB_BRANCH` | Branch to use for CDN files | `main` |

## 🎯 Usage

Once configured, your files will be accessible directly from your GitHub repository:

- **GitHub Raw**: `https://raw.githubusercontent.com/owner/repo/branch/path/to/file`

## 🆘 Troubleshooting

### "Bad credentials" Error
- Check your `GITHUB_TOKEN` is correct
- Make sure the token has `repo` scope
- Verify the token hasn't expired

### "Repository not found" Error
- Check `GITHUB_OWNER` and `GITHUB_REPO` are correct
- Make sure the repository exists
- Verify you have access to the repository

### Configuration Not Loading
- Ensure `.env.local` exists in the project root
- Check all required variables are set
- Restart the development server after changes

## 🔒 Security Notes

- **Never commit your `.env.local` file** to version control
- **Use environment variables** in production
- **Rotate your GitHub token** regularly
- **Use minimal required scopes** for your token

## 📚 Next Steps

- Upload files through the web interface
- Get direct file URLs for your assets
- Integrate file URLs into your projects
- Set up automatic deployments from your build process

---

**That's it!** Your GitCDN is ready to serve files at lightning speed! 🚀
