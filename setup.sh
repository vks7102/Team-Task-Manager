#!/bin/bash

# Team Task Manager - Quick Setup Script

echo "🚀 Team Task Manager Setup"
echo "=========================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first."
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd backend
npm install

if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️  Created .env file. Please edit it with your MongoDB URI and JWT secret."
fi

echo "✅ Backend setup complete!"

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd ../frontend
npm install

if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local file"
fi

echo "✅ Frontend setup complete!"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Terminal 1: cd backend && npm run dev"
echo "2. Terminal 2: cd frontend && npm run dev"
echo ""
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
