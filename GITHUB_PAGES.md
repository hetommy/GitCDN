# GitHub Pages Deployment Guide

This guide shows how to deploy the landing page to GitHub Pages while keeping the main app on Vercel.

## 🎯 **Architecture**

- **Main App**: Deployed on Vercel (dashboard, settings, API routes)
- **Landing Page**: Deployed on GitHub Pages (marketing/features page)

## 🚀 **Deploy Landing Page to GitHub Pages**

### Option 1: Manual Deployment

1. **Build the landing page**
   ```bash
   npm run build:landing
   ```

2. **Create a new repository for the landing page**
   - Create a new GitHub repository (e.g., `gitcdn-landing`)
   - Make it public

3. **Copy the built files**
   ```bash
   # The build output will be in the 'out' directory
   cp -r out/* /path/to/landing-repo/
   ```

4. **Enable GitHub Pages**
   - Go to repository Settings > Pages
   - Select "Deploy from a branch"
   - Choose `main` branch and `/ (root)` folder
   - Save

### Option 2: GitHub Actions (Recommended)

1. **Create `.github/workflows/deploy-landing.yml`**
   ```yaml
   name: Deploy Landing Page to GitHub Pages
   
   on:
     push:
       branches: [ main ]
       paths: [ 'src/app/landing/**' ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             cache: 'npm'
         
         - name: Install dependencies
           run: npm ci
         
         - name: Build landing page
           run: npm run build:landing
         
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./out
   ```

2. **Create a separate repository for the landing page**
   - This keeps the landing page separate from the main app

## 🔗 **Linking the Pages**

### Update Landing Page Links

In your landing page, update the buttons to point to your Vercel app:

```tsx
// In src/app/landing/page.tsx
<Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600">
  <Link href="https://your-app.vercel.app">
    Get Started
  </Link>
</Button>
```

### Update Main App Links

In your main app, update the "About" link to point to GitHub Pages:

```tsx
// In src/app/page.tsx (dashboard)
<Link href="https://your-username.github.io/github-cdn-landing">
  <Button variant="ghost" size="sm">
    About
  </Button>
</Link>
```

## 📁 **File Structure**

```
your-project/
├── gitcdn/                      # Main app (Vercel)
│   ├── src/app/
│   │   ├── page.tsx            # Dashboard (main functionality)
│   │   ├── settings/           # Settings page
│   │   └── landing/            # Landing page (for export)
│   └── package.json
└── gitcdn-landing/              # Landing page repo (GitHub Pages)
    ├── index.html              # Built landing page
    ├── _next/                  # Next.js assets
    └── images/                 # Static assets
```

## 🎨 **Customization**

### Landing Page Only
- Modify `src/app/landing/page.tsx`
- Run `npm run build:landing`
- Deploy to GitHub Pages

### Main App
- Modify dashboard, settings, or API routes
- Deploy to Vercel as usual

## 🔄 **Workflow**

1. **Landing Page Changes**:
   - Edit `src/app/landing/page.tsx`
   - Push to main branch
   - GitHub Actions builds and deploys to GitHub Pages

2. **Main App Changes**:
   - Edit dashboard, settings, or other pages
   - Push to main branch
   - Vercel automatically deploys

## 🌐 **URLs**

- **Landing Page**: `https://your-username.github.io/gitcdn-landing`
- **Main App**: `https://your-app.vercel.app`

## 💡 **Benefits**

- **Free Hosting**: GitHub Pages is free for public repos
- **Fast Loading**: Static site loads quickly
- **SEO Friendly**: Better for search engines
- **Separation of Concerns**: Marketing vs. functionality
- **Cost Effective**: Only pay for Vercel (if needed)

## 🚨 **Important Notes**

- GitHub Pages only supports static sites
- No server-side functionality on GitHub Pages
- API routes must be on Vercel
- Authentication must be on Vercel

This setup gives you the best of both worlds: a fast, free landing page on GitHub Pages and a full-featured app on Vercel!
