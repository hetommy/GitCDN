# 🚀 Simple GitCDN Setup Guide

This guide will get your GitCDN running in **under 5 minutes** using GitHub Personal Access Tokens.

## 📋 **What You Need**

- GitHub account
- A repository for your CDN files (can be public or private)
- 5 minutes of your time

## 🎯 **Step 1: Create a GitHub Personal Access Token**

1. **Go to GitHub Settings**
   - Visit: [https://github.com/settings/tokens](https://github.com/settings/tokens)
   - Click **"Generate new token (classic)"**

2. **Configure the Token**
   - **Note**: `GitCDN Token`
   - **Expiration**: Choose your preference (30 days, 90 days, or no expiration)
   - **Scopes**: Check `repo` (Full control of private repositories)

3. **Generate and Copy**
   - Click **"Generate token"**
   - **Copy the token immediately** (you won't see it again!)

## 🏠 **Step 2: Deploy to Vercel**

1. **Click the Deploy Button**
   - Use the "Deploy with Vercel" button in the README
   - This will fork the repo to your GitHub account

2. **Configure Environment Variables**
   - In Vercel dashboard, go to your project settings
   - Add these environment variables:

   ```env
   GITHUB_OWNER=your_github_username
   GITHUB_REPO=your_cdn_repository_name
   GITHUB_BRANCH=main
   GITHUB_TOKEN=ghp_your_personal_access_token_here
   NEXTAUTH_URL=https://your-project.vercel.app
   NEXTAUTH_SECRET=any_random_string_here
   ```

3. **Deploy**
   - Click "Deploy" and wait for it to complete

## 🧪 **Step 3: Test Your Setup**

1. **Visit Your App**
   - Go to your Vercel deployment URL
   - Navigate to `/settings`

2. **Check Connection Status**
   - You should see "Connected" with a green checkmark
   - Your repository info should be displayed

3. **Upload a Test File**
   - Go to the main dashboard
   - Upload a test file
   - Get your CDN URLs!

## 🎉 **You're Done!**

Your GitCDN is now live and ready to serve files directly from your GitHub repository:
- **GitHub Raw**: `https://raw.githubusercontent.com/your-username/your-repo/main/`

## 🔧 **Local Development**

If you want to run locally:

1. **Clone and Install**
   ```bash
   git clone https://github.com/your-username/GitCDN.git
   cd GitCDN
   npm install
   ```

2. **Create `.env.local`**
   ```bash
   cp env.example .env.local
   ```

3. **Add Your Configuration**
   ```env
   GITHUB_OWNER=your_github_username
   GITHUB_REPO=your_cdn_repository_name
   GITHUB_BRANCH=main
   GITHUB_TOKEN=ghp_your_personal_access_token_here
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=any_random_string_here
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🆘 **Troubleshooting**

### "Not Connected" Error
- Check your `GITHUB_TOKEN` is correct
- Verify your `GITHUB_OWNER` and `GITHUB_REPO` are correct
- Make sure the token has `repo` scope

### "Repository not found" Error
- Check the repository name is correct
- Make sure the repository exists
- Verify you have access to the repository

### "Bad credentials" Error
- Your token might be expired
- Generate a new token and update your environment variables

## 🔒 **Security Notes**

- **Keep your token secret** - never commit it to git
- **Use environment variables** - never hardcode tokens
- **Rotate tokens regularly** - for better security
- **Use minimal scopes** - only give the permissions you need

## 🎯 **Next Steps**

- Upload your files and get direct file URLs
- Integrate the file URLs into your projects
- Set up automatic deployments from your build process
- Monitor your repository for file changes

---

**That's it!** Your GitCDN is now ready to serve files at lightning speed! 🚀
