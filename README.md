# Team Task Manager

A full-stack collaborative task management application built with React, Node.js, and MongoDB.

## Features

### Core Features
- **User Authentication**: Secure signup and login with JWT
- **Project Management**: Create projects, add/remove members
- **Task Management**: Create, assign, and track tasks
- **Dashboard**: Real-time statistics and task overview
- **Activity Log**: Track all project activities
- **Drag & Drop**: Move tasks between columns (To Do, In Progress, Done)
- **Role-Based Access**: Admin and Member roles with permissions

### Extra Features
- Dark mode support
- Email notifications (when a task is assigned)
- Real-time activity tracking
- Responsive design for mobile and desktop


## Login Details:
For admin:
email - admin@gmail.com
pass - 123456

for member:
email - abhishek@gmail.com
pass - 123456

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **@hello-pangea/dnd** - Drag and drop
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email notifications

## Installation

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- Git

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and add your MongoDB URI and JWT secret:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager
JWT_SECRET=your_secret_key
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

Start the backend:
```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
```

Edit `.env.local` (change API_URL if backend is not on localhost):
```
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Projects
- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `POST /api/projects/:id/member` - Add member to project
- `DELETE /api/projects/:id/member/:userId` - Remove member from project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks/project/:projectId` - Get project tasks
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/:id/status` - Update task status
- `PATCH /api/tasks/:id` - Update task details
- `DELETE /api/tasks/:id` - Delete task

### Dashboard
- `GET /api/dashboard/stats/:projectId` - Get project statistics
- `GET /api/dashboard/activity/:projectId` - Get project activity log

## Environment Variables

### Backend
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend
```
VITE_API_URL=http://localhost:5000/api
```

## Deployment

### Deploy Backend to Railway

1. Create Railway account at https://railway.app
2. Connect GitHub repository
3. Add environment variables in Railway dashboard
4. Deploy automatically on push

## Database Design

### Users Collection
```json
{
  "_id": ObjectId,
  "name": "string",
  "email": "string",
  "password": "hashed",
  "role": "Admin|Member",
  "profileImage": "url",
  "createdAt": "date"
}
```

### Projects Collection
```json
{
  "_id": ObjectId,
  "name": "string",
  "description": "string",
  "admin": ObjectId,
  "members": [ObjectId],
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Tasks Collection
```json
{
  "_id": ObjectId,
  "title": "string",
  "description": "string",
  "dueDate": "date",
  "priority": "Low|Medium|High",
  "status": "To Do|In Progress|Done",
  "projectId": ObjectId,
  "assignedTo": ObjectId,
  "createdBy": ObjectId,
  "createdAt": "date",
  "updatedAt": "date"
}
```

## Usage

1. **Sign Up**: Create a new account
2. **Create Project**: Start a new project from the Projects page
3. **Add Members**: Invite team members to collaborate
4. **Create Tasks**: Add tasks with title, description, priority, and due date
5. **Assign Tasks**: Assign tasks to team members
6. **Track Progress**: Move tasks through different statuses
7. **View Dashboard**: Monitor project statistics and activity

## Testing

### Backend
```bash
cd backend
npm run dev
curl http://localhost:5000/api/health
```

### Frontend
```bash
cd frontend
npm run dev
```

## Project Structure

```
team-task-manager/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── context/        # React context
│   │   ├── hooks/          # Custom hooks
│   │   ├── App.jsx         # Main app
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── models/             # Mongoose schemas
│   ├── controllers/        # Request handlers
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── config/             # Configuration
│   ├── server.js           # Express app
│   └── package.json
│
└── README.md
```

## Support

For issues or questions, please open an issue on GitHub or contact the maintainer.

---

Built with ❤️ for collaborative task management
# Team-Task-Manager
