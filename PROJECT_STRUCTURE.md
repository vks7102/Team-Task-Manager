# Project Structure

```
team-task-manager/
│
├── backend/                          # Node.js + Express backend
│   ├── models/
│   │   ├── User.js                  # User schema with password hashing
│   │   ├── Project.js               # Project schema
│   │   ├── Task.js                  # Task schema
│   │   └── Activity.js              # Activity log schema
│   │
│   ├── controllers/
│   │   ├── authController.js        # Auth logic (register, login, profile)
│   │   ├── projectController.js     # Project management logic
│   │   ├── taskController.js        # Task management logic
│   │   └── dashboardController.js   # Dashboard stats & activity
│   │
│   ├── routes/
│   │   ├── authRoutes.js            # /api/auth endpoints
│   │   ├── projectRoutes.js         # /api/projects endpoints
│   │   ├── taskRoutes.js            # /api/tasks endpoints
│   │   └── dashboardRoutes.js       # /api/dashboard endpoints
│   │
│   ├── middleware/
│   │   ├── auth.js                  # JWT protection middleware
│   │   └── errorHandler.js          # Global error handler
│   │
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── mailer.js                # Email service configuration
│   │
│   ├── server.js                    # Main Express app
│   ├── package.json                 # Backend dependencies
│   ├── .env.example                 # Environment template
│   └── .gitignore
│
├── frontend/                         # React + Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Signup.jsx           # Signup page
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   ├── Projects.jsx         # Projects list
│   │   │   ├── ProjectDetail.jsx    # Project detail page
│   │   │   └── Profile.jsx          # User profile
│   │   │
│   │   ├── components/
│   │   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   │   ├── TaskBoard.jsx        # Kanban board
│   │   │   ├── TaskCard.jsx         # Task card component
│   │   │   └── StatCard.jsx         # Statistics card
│   │   │
│   │   ├── services/
│   │   │   ├── api.js               # Axios instance with auth
│   │   │   └── index.js             # All API calls
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Auth state management
│   │   │   └── ThemeContext.jsx     # Dark mode state
│   │   │
│   │   ├── hooks/
│   │   │   └── useAuth.js           # Custom auth hook
│   │   │
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Tailwind styles
│   │
│   ├── index.html                   # HTML template
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind configuration
│   ├── postcss.config.js            # PostCSS configuration
│   ├── .env.example                 # Environment template
│   └── .gitignore
│
├── README.md                        # Main documentation
├── QUICKSTART.md                    # Quick setup guide
├── DEPLOYMENT.md                    # Deployment instructions
├── setup.sh                         # Automated setup script
├── .gitignore                       # Git ignore
└── PROJECT_STRUCTURE.md             # This file

```

## Key Directories Explained

### Backend
- **models/**: Mongoose schemas defining database structure
- **controllers/**: Business logic for handling requests
- **routes/**: API endpoint definitions
- **middleware/**: Request processing (auth, error handling)
- **config/**: Database and external service configuration

### Frontend
- **pages/**: Full page components
- **components/**: Reusable UI components
- **services/**: API client functions
- **context/**: Global state management
- **hooks/**: Custom React hooks

## Database Collections

### users
- Stores user accounts and authentication
- Fields: _id, name, email, password (hashed), role, profileImage, createdAt

### projects
- Stores project information
- Fields: _id, name, description, admin, members[], createdAt, updatedAt

### tasks
- Stores task information
- Fields: _id, title, description, dueDate, priority, status, projectId, assignedTo, createdBy, createdAt, updatedAt

### activities
- Stores project activity logs
- Fields: _id, userId, projectId, action, createdAt

## API Structure

```
/api
├── /auth
│   ├── POST /register
│   ├── POST /login
│   └── GET /profile
│
├── /projects
│   ├── GET / (list all)
│   ├── POST / (create)
│   ├── GET /:id
│   ├── POST /:id/member (add)
│   ├── DELETE /:id/member/:userId (remove)
│   └── DELETE /:id
│
├── /tasks
│   ├── GET /project/:projectId
│   ├── POST / (create)
│   ├── PATCH /:id/status
│   ├── PATCH /:id (update)
│   └── DELETE /:id
│
└── /dashboard
    ├── GET /stats/:projectId
    └── GET /activity/:projectId
```

## File Naming Conventions

- **Controllers**: camelCase + Controller (e.g., `authController.js`)
- **Routes**: camelCase + Routes (e.g., `projectRoutes.js`)
- **Models**: PascalCase + .js (e.g., `User.js`)
- **Components**: PascalCase + .jsx (e.g., `TaskCard.jsx`)
- **Pages**: PascalCase + .jsx (e.g., `Dashboard.jsx`)
- **Utilities**: camelCase + .js (e.g., `api.js`)

## Configuration Files

- `vite.config.js` - Frontend build configuration
- `tailwind.config.js` - Tailwind CSS customization
- `postcss.config.js` - CSS post-processing
- `package.json` - Dependencies and scripts (backend & frontend)

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
SMTP_USER=email
SMTP_PASS=password
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

## Getting Started

1. Install dependencies: `./setup.sh`
2. Configure environment variables
3. Start backend: `cd backend && npm run dev`
4. Start frontend: `cd frontend && npm run dev`
5. Open http://localhost:5173

## Building for Production

### Backend
```bash
cd backend
NODE_ENV=production npm start
```

### Frontend
```bash
cd frontend
npm run build
```

## Deployment Targets

- **Backend**: Railway (railway.app)
- **Frontend**: Vercel (vercel.com)
- **Database**: MongoDB Atlas (mongodb.com/cloud/atlas)

See DEPLOYMENT.md for detailed instructions.
