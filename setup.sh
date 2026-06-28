#!/bin/bash

# TaskFlow Setup Script
# This script helps setup the TaskFlow project for local development

echo "========================================"
echo "   TaskFlow Setup Script"
echo "========================================"
echo ""

# Check Node.js
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please download and install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js $NODE_VERSION found"
echo ""

# Check npm
echo "Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm $NPM_VERSION found"
echo ""

# Install dependencies
echo "Installing dependencies..."
echo "This may take a few minutes..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Generate Prisma client
echo "Generating Prisma client..."
npm run db:generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi
echo "✅ Prisma client generated"
echo ""

# Database setup prompt
echo "========================================"
echo "   Database Setup"
echo "========================================"
echo ""
echo "Please choose a database option:"
echo "1. Local PostgreSQL"
echo "2. AWS Aurora PostgreSQL"
echo "3. Vercel Postgres"
echo "4. Skip (configure manually later)"
echo ""
read -p "Enter your choice (1-4): " db_choice

case $db_choice in
    1)
        echo ""
        echo "Local PostgreSQL Setup"
        echo "Please ensure PostgreSQL is running on your system."
        echo ""
        read -p "Enter PostgreSQL user (default: postgres): " pg_user
        read -p "Enter PostgreSQL password: " pg_password
        read -p "Enter database name (default: taskflow): " pg_db
        
        pg_user=${pg_user:-postgres}
        pg_db=${pg_db:-taskflow}
        
        DATABASE_URL="postgresql://${pg_user}:${pg_password}@localhost:5432/${pg_db}"
        echo "DATABASE_URL=$DATABASE_URL" >> .env.local
        echo "✅ Database configuration saved to .env.local"
        ;;
    2)
        echo ""
        echo "AWS Aurora PostgreSQL Setup"
        echo "Ensure your Aurora cluster is created and accessible."
        echo ""
        read -p "Enter Aurora endpoint: " aurora_endpoint
        read -p "Enter database user: " aurora_user
        read -p "Enter database password: " aurora_password
        read -p "Enter database name (default: taskflow): " aurora_db
        
        aurora_db=${aurora_db:-taskflow}
        
        DATABASE_URL="postgresql://${aurora_user}:${aurora_password}@${aurora_endpoint}:5432/${aurora_db}"
        echo "DATABASE_URL=$DATABASE_URL" >> .env.local
        echo "✅ Aurora configuration saved to .env.local"
        ;;
    3)
        echo ""
        echo "Vercel Postgres Setup"
        read -p "Enter Vercel Postgres connection string: " vercel_url
        echo "DATABASE_URL=$vercel_url" >> .env.local
        echo "✅ Vercel Postgres configuration saved to .env.local"
        ;;
    4)
        echo ""
        echo "Skipped database configuration"
        echo "Please update DATABASE_URL in .env.local manually"
        ;;
    *)
        echo "Invalid choice"
        ;;
esac

echo ""
echo "========================================"
echo "   Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your database credentials"
echo "2. Create your database if not already created"
echo "3. Run database migrations:"
echo "   npm run db:migrate"
echo ""
echo "4. Start development server:"
echo "   npm run dev"
echo ""
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "For more information, see QUICKSTART.md or README.md"
echo ""
