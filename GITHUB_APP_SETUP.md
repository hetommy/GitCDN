# GitHub App Setup Guide

This guide will help you set up a GitHub App for your GitCDN deployment, providing the most secure and user-friendly experience.

## 🚀 **Why GitHub App?**

- **Repository-specific permissions** - Users can choose which repos to use
- **No token management** - Users don't need to create/manage personal access tokens
- **Better security** - Fine-grained permissions and automatic token rotation
- **One-click installation** - Users install the app directly from GitHub

## 📋 **Step 1: Create GitHub App**

1. Go to [GitHub Settings > Developer settings > GitHub Apps](https://github.com/settings/apps)
2. Click **"New GitHub App"**
3. Fill in the following details:

### **Basic Information**
- **GitHub App name**: `GitCDN` (or your preferred name)
- **Homepage URL**: `https://your-app.vercel.app`
- **User authorization callback URL**: `https://your-app.vercel.app/api/auth/callback/github`
- **Webhook URL**: `https://your-app.vercel.app/api/webhooks/github` (optional)
- **Webhook secret**: Generate a random string (optional)

### **Permissions**
- **Repository permissions**:
  - **Contents**: `Read & write` (to upload files)
  - **Metadata**: `Read` (to get repo info)
  - **Pull requests**: `Read` (optional, for future features)

- **User permissions**:
  - **Email addresses**: `Read` (to get user email)
  - **Profile**: `Read` (to get user profile)

### **Subscribe to events** (optional)
- `push` (for real-time updates)
- `repository` (for repo changes)

## 🔑 **Step 2: Generate Private Key**

1. After creating the app, scroll down to **"Private keys"**
2. Click **"Generate a private key"**
3. Download the `.pem` file
4. **Keep this file secure** - you'll need it for your environment variables

## ⚙️ **Step 3: Environment Variables**

Add these to your `.env.local` and Vercel deployment:

```env
# GitHub App Configuration
GITHUB_APP_ID=your_app_id
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nYOUR_PRIVATE_KEY_CONTENT\n-----END RSA PRIVATE KEY-----"
GITHUB_APP_CLIENT_ID=your_client_id
GITHUB_APP_CLIENT_SECRET=your_client_secret
GITHUB_APP_WEBHOOK_SECRET=your_webhook_secret

# NextAuth Configuration
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret
```

## 🎯 **Step 4: User Installation Flow**

### **For Users (Installation Process):**

1. **Visit your GitCDN app**
2. **Click "Connect GitHub"** 
3. **Redirected to GitHub** to install the app
4. **Select repositories** they want to use for CDN
5. **Authorize the installation**
6. **Return to your app** - now connected!

### **Repository Selection:**
- Users can choose **specific repositories** or **all repositories**
- They can **change permissions** anytime in GitHub settings
- **Private repos** work if they grant access

## 🔧 **Step 5: App Configuration**

The app will automatically:
- **Detect installed repositories**
- **Show repository selection UI**
- **Handle file uploads** to selected repos
- **Generate CDN URLs** for uploaded files

## 🚀 **Deployment**

1. **Deploy to Vercel** with the environment variables
2. **Update the GitHub App URLs** to point to your Vercel domain
3. **Test the installation flow**
4. **Share your app** with users!

## 🔒 **Security Benefits**

- **No server-side token storage**
- **Repository-specific access**
- **Automatic token rotation**
- **Fine-grained permissions**
- **Webhook support** for real-time updates

## 📚 **Next Steps**

After setup, users will be able to:
- ✅ **Install your GitHub App** with one click
- ✅ **Select which repositories** to use
- ✅ **Upload files** directly to their repos
- ✅ **Get CDN URLs** instantly
- ✅ **Manage permissions** through GitHub

This approach provides the best security and user experience for your GitCDN application!
