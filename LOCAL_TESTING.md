# Local Testing Guide for GitCDN

This guide will help you test your GitCDN application locally with GitHub App authentication.

## 🚀 **Quick Start Testing (Without GitHub App)**

For basic UI testing without setting up a full GitHub App:

### 1. **Start the Development Server**
```bash
npm run dev
```

### 2. **Test Basic UI**
- Visit [http://localhost:3001](http://localhost:3001)
- You should see the authentication required screen
- Click "Sign in with GitHub" to test the flow

### 3. **Test Settings Page**
- Visit [http://localhost:3001/settings](http://localhost:3001/settings)
- Should show authentication required screen

## 🔧 **Full GitHub App Testing**

For complete functionality testing:

### 1. **Create a GitHub App (Test Mode)**

1. Go to [GitHub Settings > Developer settings > GitHub Apps](https://github.com/settings/apps)
2. Click **"New GitHub App"**
3. Fill in these details:

**Basic Information:**
- **GitHub App name**: `GitCDN-Test`
- **Homepage URL**: `http://localhost:3001`
- **User authorization callback URL**: `http://localhost:3001/api/auth/callback/github`
- **Webhook URL**: `http://localhost:3001/api/webhooks/github` (optional)

**Permissions:**
- **Repository permissions**:
  - **Contents**: `Read & write`
  - **Metadata**: `Read`
- **User permissions**:
  - **Email addresses**: `Read`
  - **Profile**: `Read`

### 2. **Generate Private Key**
1. After creating the app, scroll to **"Private keys"**
2. Click **"Generate a private key"**
3. Download the `.pem` file
4. Copy the content (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`)

### 3. **Update Environment Variables**

Update your `.env.local` file:

```env
# GitHub App Configuration
GITHUB_APP_ID=your_app_id_from_github
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nYOUR_PRIVATE_KEY_CONTENT\n-----END RSA PRIVATE KEY-----"
GITHUB_APP_CLIENT_ID=your_client_id_from_github
GITHUB_APP_CLIENT_SECRET=your_client_secret_from_github
GITHUB_APP_WEBHOOK_SECRET=your_webhook_secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_random_secret_string
```

**Important Notes:**
- Replace `\n` with actual newlines in the private key
- Generate a random `NEXTAUTH_SECRET` (you can use `openssl rand -base64 32`)
- The `GITHUB_APP_ID` is shown on your GitHub App page

### 4. **Restart the Development Server**
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### 5. **Test the Complete Flow**

1. **Visit the App**: [http://localhost:3001](http://localhost:3001)
2. **Click "Sign in with GitHub"**
3. **Authorize the GitHub App** (you'll be redirected to GitHub)
4. **Select repositories** you want to use
5. **Return to your app** - you should now be authenticated
6. **Go to Settings**: [http://localhost:3001/settings](http://localhost:3001/settings)
7. **Select a repository** from the list
8. **Test file upload** (when implemented)

## 🧪 **Testing Checklist**

### ✅ **Authentication Flow**
- [ ] App loads without errors
- [ ] "Sign in with GitHub" button works
- [ ] GitHub OAuth redirect works
- [ ] User can authorize the GitHub App
- [ ] User returns to app authenticated
- [ ] User profile shows correctly

### ✅ **Repository Selection**
- [ ] Settings page loads authenticated user's repositories
- [ ] Repository list displays correctly
- [ ] User can select a repository
- [ ] Selected repository information shows
- [ ] Repository details are accurate

### ✅ **Error Handling**
- [ ] App handles missing GitHub App configuration
- [ ] App shows proper error messages
- [ ] App handles authentication failures gracefully
- [ ] App handles repository access issues

### ✅ **UI/UX**
- [ ] All pages load correctly
- [ ] Navigation works properly
- [ ] Responsive design works on different screen sizes
- [ ] Loading states display correctly
- [ ] Error states display correctly

## 🐛 **Common Issues & Solutions**

### **Issue: "React Context is unavailable in Server Components"**
**Solution**: Make sure you're using the `AuthProvider` component in `layout.tsx`

### **Issue: "Bad credentials" errors**
**Solution**: 
- Check your GitHub App credentials in `.env.local`
- Ensure the private key format is correct
- Verify the GitHub App has the right permissions

### **Issue: "No repositories found"**
**Solution**:
- Make sure you've installed the GitHub App on your account
- Check that the GitHub App has repository access
- Verify the repository permissions in GitHub App settings

### **Issue: Authentication redirect fails**
**Solution**:
- Check that `NEXTAUTH_URL` matches your local URL
- Verify the callback URL in GitHub App settings
- Ensure `NEXTAUTH_SECRET` is set

## 🔍 **Debugging Tips**

### **Check Environment Variables**
```bash
# Verify your .env.local file
cat .env.local
```

### **Check GitHub App Settings**
- Visit your GitHub App page
- Verify all URLs are correct
- Check permissions are set correctly

### **Check Browser Console**
- Open Developer Tools (F12)
- Look for any JavaScript errors
- Check Network tab for failed requests

### **Check Terminal Logs**
- Look for any server-side errors
- Check for authentication issues
- Verify API calls are working

## 🚀 **Next Steps After Testing**

Once local testing is complete:

1. **Deploy to Vercel** with the same environment variables
2. **Update GitHub App URLs** to point to your Vercel domain
3. **Test the production deployment**
4. **Share with users** for beta testing

## 📝 **Testing Notes**

- **Test with different GitHub accounts** to ensure multi-user support
- **Test with private repositories** to verify permission handling
- **Test with repositories you don't own** to check access controls
- **Test the complete file upload flow** (when implemented)

This testing approach ensures your GitCDN application works correctly before deploying to production!
