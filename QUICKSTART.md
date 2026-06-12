# Quick Start Guide

## Local Development Setup

### Prerequisites
- Node.js v16+ (download from https://nodejs.org/)
- MongoDB Atlas account (free at https://www.mongodb.com/cloud/atlas)
- Git

### Step 1: Clone or Extract Project

```bash
cd /Users/vishal/Code/assignment
```

### Step 2: Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and replace:
```
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/team-task-manager
JWT_SECRET=your-secret-key-here
```

Start backend:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 3: Frontend Setup

In a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

### Step 4: Create First Account

1. Open http://localhost:5173
2. Click "Sign up"
3. Enter name, email, password
4. Create account
5. Create your first project!

## Available Scripts

### Backend
```bash
npm run dev      # Start development server with auto-reload
npm start        # Start production server
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Project Features

### Already Implemented
- ✅ User authentication (signup/login)
- ✅ Project management (create, add members)
- ✅ Task management (create, update status)
- ✅ Dashboard with statistics
- ✅ Activity logging
- ✅ Responsive design
- ✅ JWT authentication
- ✅ MongoDB integration

### Extra Features You Can Add
- 🎯 Drag & drop tasks (use @hello-pangea/dnd)
- 📧 Email notifications (Nodemailer ready)
- 🌙 Dark mode toggle
- 📱 Mobile app with Flutter
- 🔍 Search and filtering
- 📊 Advanced analytics
- 👥 User profiles
- 💬 Comments on tasks

## API Testing

Use Thunder Client, Postman, or curl to test APIs:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'

# Get projects (use token from login)
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### Backend won't start
- Check if port 5000 is available: `lsof -i :5000`
- Check MongoDB connection string in .env
- Check Node.js version: `node --version` (should be v16+)

### Frontend won't start
- Check if port 5173 is available: `lsof -i :5173`
- Check .env.local has correct API URL
- Clear node_modules: `rm -rf node_modules && npm install`

### Can't connect frontend to backend
- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend/.env.local
- Check CORS is enabled in backend (should be by default)

### MongoDB connection fails
- Verify connection string in .env
- Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for development)
- Create database user if you haven't already

## Next Steps

1. **Add Email Notifications**: Uncomment Nodemailer code in taskController
2. **Add Drag & Drop**: Import `@hello-pangea/dnd` in TaskBoard component
3. **Deploy**: Follow DEPLOYMENT.md
4. **Create Demo Video**: Record 2-5 minute walkthrough
5. **Write Tests**: Add Jest tests for critical functions

## Useful Links

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)

## Support

For detailed setup, see:
- Backend README: Look in backend/ directory
- Frontend README: Look in frontend/ directory
- Deployment Guide: See DEPLOYMENT.md
- Main README: See README.md

Happy coding! 🚀
