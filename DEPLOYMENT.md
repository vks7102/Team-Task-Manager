# Deployment Guide

## Railway Deployment

### Prerequisites
- Railway account (free at https://railway.app)
- GitHub repository with your code
- MongoDB Atlas account (free tier available)

### Step 1: Prepare MongoDB

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier is fine)
4. Create a database user with a strong password
5. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/team-task-manager`

### Step 2: Deploy Backend to Railway

1. Push your code to GitHub
2. Go to https://railway.app and sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Click on the project and add a new service
6. Configure environment variables:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager
   JWT_SECRET=your_very_secret_key_change_this
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   FRONTEND_URL=https://your-frontend-url.vercel.app
   NODE_ENV=production
   ```

7. Railway will automatically detect it's a Node.js app
8. Deploy!
9. Get your backend URL from Railway (e.g., `https://project-name.up.railway.app`)

### Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click "New Project"
3. Select your GitHub repository
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-railway-url/api
   ```
7. Deploy!

### Step 4: Update Backend FRONTEND_URL

1. Go back to Railway
2. Update the `FRONTEND_URL` environment variable with your Vercel URL
3. Redeploy

### Step 5: Test

1. Go to your Vercel URL
2. Sign up with a test account
3. Create a project
4. Add tasks

## Railway Commands (if using Railway CLI)

```bash
# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up

# View logs
railway logs

# Check status
railway status
```

## Troubleshooting

### Backend not connecting to MongoDB
- Check MongoDB URI in .env
- Ensure MongoDB IP whitelist includes `0.0.0.0/0`
- Verify database user credentials

### CORS errors
- Update `FRONTEND_URL` in backend environment variables
- Restart backend after changing FRONTEND_URL

### Frontend can't reach backend
- Verify `VITE_API_URL` in frontend environment variables
- Check that backend Railway URL is correct
- Test with: `curl https://your-backend-url/api/health`

### Email notifications not working
- Verify Gmail app password (not regular password)
- Enable "Less secure app access" if using Gmail
- Check SMTP credentials in .env

## Monitoring

### Railway Dashboard
- View logs in real-time
- Monitor resource usage
- Check deployment history
- Manage environment variables

### Vercel Dashboard
- View deployment logs
- Monitor frontend performance
- Check build history
- Manage environment variables

## Security Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use strong MongoDB password
- [ ] Enable MongoDB IP whitelist (or use VPN)
- [ ] Use HTTPS only (both platforms provide this)
- [ ] Set `NODE_ENV=production` on backend
- [ ] Hide sensitive data in environment variables
- [ ] Regular backups of MongoDB
- [ ] Monitor for suspicious activity

## Scaling

### If you need more resources:

**Railway:**
- Upgrade plan for more compute/memory
- Railway automatically scales on demand

**Vercel:**
- Pro plan for more concurrent builds
- Vercel handles auto-scaling

## Costs

### Free Tier (Recommended for learning)
- **Railway**: $5 free credit/month
- **MongoDB Atlas**: Free tier (512MB storage)
- **Vercel**: Free tier (unlimited deployments)

**Total cost: $0 if you stay within free limits**

### Production Tier (if needed)
- **Railway**: Pay-as-you-go (~$5-10/month for small app)
- **MongoDB Atlas**: M2 Shared tier (~$9/month)
- **Vercel**: Pro ($20/month) if needed
