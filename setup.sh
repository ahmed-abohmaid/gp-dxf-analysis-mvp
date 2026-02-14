#!/bin/bash

echo "🚀 Setting up Electrical Load Estimation Dashboard..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
pip3 install ezdxf shapely --break-system-packages || pip3 install ezdxf shapely

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "  Frontend: npm run dev"
echo "  Backend:  cd backend && npm start"
echo ""
echo "Visit http://localhost:5173 to use the dashboard"
