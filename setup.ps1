# TaskFlow Setup Script for Windows
# Run with: powershell -ExecutionPolicy Bypass -File setup.ps1

Write-Host "========================================"
Write-Host "   TaskFlow Setup Script" -ForegroundColor Green
Write-Host "========================================"
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please download and install Node.js 18+ from https://nodejs.org" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Check npm
Write-Host "Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm -v
    Write-Host "✅ npm $npmVersion found" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Generate Prisma client
Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npm run db:generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma client generated" -ForegroundColor Green
Write-Host ""

# Database setup prompt
Write-Host "========================================"
Write-Host "   Database Setup" -ForegroundColor Green
Write-Host "========================================"
Write-Host ""
Write-Host "Please choose a database option:"
Write-Host "1. Local PostgreSQL"
Write-Host "2. AWS Aurora PostgreSQL"
Write-Host "3. Vercel Postgres"
Write-Host "4. Skip (configure manually later)"
Write-Host ""

$dbChoice = Read-Host "Enter your choice (1-4)"

switch ($dbChoice) {
    "1" {
        Write-Host ""
        Write-Host "Local PostgreSQL Setup" -ForegroundColor Yellow
        Write-Host "Please ensure PostgreSQL is running on your system."
        Write-Host ""
        
        $pgUser = Read-Host "Enter PostgreSQL user (default: postgres)"
        $pgPassword = Read-Host "Enter PostgreSQL password"
        $pgDb = Read-Host "Enter database name (default: taskflow)"
        
        if ([string]::IsNullOrEmpty($pgUser)) { $pgUser = "postgres" }
        if ([string]::IsNullOrEmpty($pgDb)) { $pgDb = "taskflow" }
        
        $databaseUrl = "postgresql://$($pgUser):$($pgPassword)@localhost:5432/$($pgDb)"
        Add-Content -Path ".env.local" -Value "DATABASE_URL=$databaseUrl"
        Write-Host "✅ Database configuration saved to .env.local" -ForegroundColor Green
    }
    "2" {
        Write-Host ""
        Write-Host "AWS Aurora PostgreSQL Setup" -ForegroundColor Yellow
        Write-Host "Ensure your Aurora cluster is created and accessible."
        Write-Host ""
        
        $auroraEndpoint = Read-Host "Enter Aurora endpoint"
        $auroraUser = Read-Host "Enter database user"
        $auroraPassword = Read-Host "Enter database password"
        $auroraDb = Read-Host "Enter database name (default: taskflow)"
        
        if ([string]::IsNullOrEmpty($auroraDb)) { $auroraDb = "taskflow" }
        
        $databaseUrl = "postgresql://$($auroraUser):$($auroraPassword)@$($auroraEndpoint):5432/$($auroraDb)"
        Add-Content -Path ".env.local" -Value "DATABASE_URL=$databaseUrl"
        Write-Host "✅ Aurora configuration saved to .env.local" -ForegroundColor Green
    }
    "3" {
        Write-Host ""
        Write-Host "Vercel Postgres Setup" -ForegroundColor Yellow
        
        $vercelUrl = Read-Host "Enter Vercel Postgres connection string"
        Add-Content -Path ".env.local" -Value "DATABASE_URL=$vercelUrl"
        Write-Host "✅ Vercel Postgres configuration saved to .env.local" -ForegroundColor Green
    }
    "4" {
        Write-Host ""
        Write-Host "Skipped database configuration" -ForegroundColor Yellow
        Write-Host "Please update DATABASE_URL in .env.local manually"
    }
    default {
        Write-Host "Invalid choice" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================"
Write-Host "   Setup Complete!" -ForegroundColor Green
Write-Host "========================================"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update .env.local with your database credentials"
Write-Host "2. Create your database if not already created"
Write-Host "3. Run database migrations:"
Write-Host "   npm run db:migrate" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Start development server:"
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "5. Open http://localhost:3000 in your browser"
Write-Host ""
Write-Host "For more information, see QUICKSTART.md or README.md" -ForegroundColor Gray
Write-Host ""
