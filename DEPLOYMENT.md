# Deployment Guide

This guide will help you deploy your GitCDN to Vercel.

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy with Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project directory**
   ```bash
   cd gitcdn
   vercel
   ```

4. **Follow the prompts**
   - Link to existing project or create new one
   - Set up environment variables
   - Deploy!

### Option 2: Deploy via Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure settings

3. **Set Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add the following variables:

## 🔧 Environment Variables

Set these in your Vercel project settings:

| Variable | Description | Example |
|----------|-------------|---------|
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID | `Ov23liABC123...` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret | `abc123def456...` |
| `NEXTAUTH_SECRET` | Random secret for NextAuth | `your-random-secret-here` |
| `NEXTAUTH_URL` | Your Vercel domain | `https://your-app.vercel.app` |

## 🔐 GitHub OAuth Setup

1. **Create GitHub OAuth App**
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Click "New OAuth App"

2. **Configure OAuth App**
   - **Application name**: GitCDN
   - **Homepage URL**: `https://your-app.vercel.app`
   - **Authorization callback URL**: `https://your-app.vercel.app/api/auth/callback/github`

3. **Get Credentials**
   - Copy Client ID and Client Secret
   - Add them to Vercel environment variables

## 📝 Deployment Checklist

- [ ] Repository pushed to GitHub
- [ ] GitHub OAuth App created and configured
- [ ] Environment variables set in Vercel
- [ ] Domain configured (if using custom domain)
- [ ] SSL certificate active
- [ ] Application accessible via HTTPS

## 🔄 Automatic Deployments

Vercel automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

## 🛠 Custom Domain (Optional)

1. **Add Domain in Vercel**
   - Go to Project Settings > Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update GitHub OAuth**
   - Update Authorization callback URL to your custom domain
   - Update `NEXTAUTH_URL` environment variable

## 📊 Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Function Logs**: View serverless function logs
- **Deployment History**: Track all deployments

## 🚨 Troubleshooting

### Common Issues

1. **OAuth Callback Error**
   - Check Authorization callback URL matches exactly
   - Ensure HTTPS is used in production

2. **Environment Variables Not Loading**
   - Verify variables are set in Vercel dashboard
   - Redeploy after adding new variables

3. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in package.json

### Getting Help

- Check Vercel documentation
- Review build logs in dashboard
- Test locally with production environment variables

## 🎉 Success!

Once deployed, your GitCDN will be available at your Vercel domain. Users can:

1. Configure their GitHub repository
2. Upload files via the dashboard
3. Get CDN URLs for their assets
4. Manage their CDN files

Happy deploying! 🚀
