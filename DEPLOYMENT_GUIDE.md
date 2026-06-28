# TaskFlow - Deployment Guide

Complete step-by-step guide to deploy TaskFlow to Vercel with AWS Databases.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Setup AWS Database](#setup-aws-database)
3. [Prepare Application](#prepare-application)
4. [Deploy to Vercel](#deploy-to-vercel)
5. [Post-Deployment Configuration](#post-deployment-configuration)
6. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

Before starting, ensure you have:

- ✅ GitHub account ([github.com](https://github.com))
- ✅ Vercel account ([vercel.com](https://vercel.com))
- ✅ AWS account ([aws.amazon.com](https://aws.amazon.com))
- ✅ Local Node.js 18+ installed
- ✅ Git installed
- ✅ This project code locally

---

## Setup AWS Database

### Option 1: Aurora PostgreSQL (Recommended)

#### Step 1: Create RDS Aurora Cluster

1. **Go to AWS Console**
   - Navigate to RDS (Relational Database Service)
   - Region: Choose closest to users (e.g., us-east-1)

2. **Create Database**
   - Click "Create database"
   - Engine: PostgreSQL
   - Edition: Aurora PostgreSQL
   - Version: Latest stable (14.7+)

3. **Configure Instance**
   - DB cluster identifier: `taskflow-prod`
   - DB instance class: `db.t4g.small` (free tier or small instance)
   - Multi-AZ deployment: Yes (for production)
   - Storage: Auto-scaling enabled
   - Max allocated storage: 100 GB

4. **Network Settings**
   - VPC: Default VPC
   - Subnet group: Create new or use default
   - Public accessibility: Yes (for Vercel access)
   - VPC security groups: Create new
     - Security group name: `taskflow-db-sg`

5. **Database Options**
   - Initial database name: `taskflow`
   - Port: 5432 (default)
   - Backup retention: 7 days
   - Encryption: Enable (KMS key: AWS managed)

6. **Create Database**
   - Click "Create database"
   - Wait ~10-15 minutes for creation

#### Step 2: Configure Security Group

1. **Add Vercel IP Ranges**
   - Go to EC2 → Security Groups
   - Find `taskflow-db-sg`
   - Add inbound rule:
     - Type: PostgreSQL
     - Source: Custom IP
     - CIDR: 0.0.0.0/0 (or specific Vercel IPs)
     - Description: "Vercel access"

2. **Save Rules**

#### Step 3: Get Connection String

1. **In RDS Console**
   - Find your cluster under "Databases"
   - Copy endpoint: `taskflow-prod.c123456.us-east-1.rds.amazonaws.com`

2. **Connection String Format**
   ```
   postgresql://username:password@taskflow-prod.c123456.us-east-1.rds.amazonaws.com:5432/taskflow
   ```

### Option 2: Aurora DSQL

#### Step 1: Create Aurora DSQL Cluster

1. **Go to AWS Console**
   - Navigate to Aurora DSQL service
   - Click "Create database"

2. **Configure Cluster**
   - Cluster name: `taskflow-dsql`
   - Node type: `db.t4g.medium`
   - Number of nodes: 3 (minimum recommended)

3. **Get Connection Details**
   - Copy endpoint and credentials
   - Use PostgreSQL connection format

### Option 3: DynamoDB

If using DynamoDB, you'll need to modify the Prisma schema to use DynamoDB adapter.

---

## Prepare Application

### Step 1: Initialize Git Repository

```bash
cd taskflow
git init
git add .
git commit -m "Initial commit - TaskFlow application"
```

### Step 2: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `taskflow` (or your choice)
3. Description: "Task Management & Marketplace Platform"
4. Visibility: Public or Private
5. Click "Create repository"

### Step 3: Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/taskflow.git
git branch -M main
git push -u origin main
```

### Step 4: Setup Environment Variables

Create `.env.local` with your AWS database credentials:

```env
# AWS Aurora PostgreSQL
DATABASE_URL="postgresql://username:password@taskflow-prod.xxx.us-east-1.rds.amazonaws.com:5432/taskflow"

# Authentication
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="https://taskflow.vercel.app"  # Update with your domain

# API
NEXT_PUBLIC_API_URL="https://taskflow.vercel.app/api"
```

### Step 5: Test Locally (Optional)

```bash
npm install
npm run db:migrate
npm run dev
```

---

## Deploy to Vercel

### Step 1: Connect GitHub to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select "GitHub"
4. Authorize Vercel to access your GitHub account
5. Find and select your `taskflow` repository
6. Click "Import"

### Step 2: Configure Project Settings

1. **Project Name**: `taskflow`

2. **Framework Preset**: Next.js (auto-detected)

3. **Environment Variables**
   - Add your `.env` variables:
   ```
   DATABASE_URL: postgresql://...
   NEXTAUTH_SECRET: your-secret-key
   NEXTAUTH_URL: https://taskflow.vercel.app
   NEXT_PUBLIC_API_URL: https://taskflow.vercel.app/api
   ```

4. **Build Settings**
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

5. **Click "Deploy"**

### Step 3: Monitor Deployment

- Vercel will build and deploy automatically
- Check "Deployments" tab for status
- Wait for green checkmark ✅
- Typical deployment: 2-5 minutes

### Step 4: Access Your App

1. Vercel provides a URL: `https://taskflow.vercel.app`
2. Test homepage, signup, login flows
3. Check browser console for errors (F12)

---

## Post-Deployment Configuration

### Step 1: Run Database Migrations

Use Vercel CLI to run migrations:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run migration with production database
vercel env pull
npm run db:migrate
```

Or manually in AWS:

```bash
# With production DATABASE_URL
DATABASE_URL="your-production-db-url" npm run db:migrate
```

### Step 2: Verify Database Connection

1. Test signup: `https://taskflow.vercel.app/auth/signup`
2. Create test account
3. Check AWS RDS to confirm data:

```bash
# Connect to database
psql "postgresql://username:password@endpoint:5432/taskflow"

# Query users
SELECT * FROM "User" LIMIT 5;
SELECT * FROM "Task" LIMIT 5;
```

### Step 3: Setup Custom Domain (Optional)

1. In Vercel dashboard:
   - Go to Settings → Domains
   - Add your domain (e.g., `taskflow.com`)

2. Update DNS records:
   - Point domain to Vercel nameservers
   - Or add CNAME record

3. Update environment variable:
   ```
   NEXTAUTH_URL=https://taskflow.com
   ```

### Step 4: Enable HTTPS & Security

- Vercel automatically enables SSL/TLS
- Check "Settings → Security" in Vercel
- Enable DDoS protection (if available)

### Step 5: Setup Monitoring

1. **Vercel Analytics**
   - Dashboard → Analytics
   - Monitor API routes and page performance

2. **AWS CloudWatch**
   - Monitor database metrics
   - Set up alarms for high CPU/connections

3. **Logs**
   - Vercel: Deployments → Logs
   - AWS RDS: Enhanced monitoring (optional)

---

## Environment Variables Reference

### Required Variables

```env
# Database Connection
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# Authentication Secrets
NEXTAUTH_SECRET="random-string-from-openssl-rand"
NEXTAUTH_URL="https://your-domain.com"

# API Configuration
NEXT_PUBLIC_API_URL="https://your-domain.com/api"
```

### Generate Secure Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Or using Node
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Troubleshooting

### Database Connection Errors

**Error**: `Error: connect ECONNREFUSED`

**Solution**:
1. Check DATABASE_URL is correct
2. Verify security group allows Vercel IPs
3. Ensure RDS instance is running
4. Test locally with connection string

### Build Failures

**Error**: `Build failed: cannot find module`

**Solution**:
```bash
# Locally
rm -rf node_modules package-lock.json
npm install
npm run build

# Push to GitHub
git add .
git commit -m "Fix: dependencies"
git push

# Vercel redeploys automatically
```

### Migration Errors

**Error**: `Migration timeout`

**Solution**:
1. Run migrations locally before deployment
2. Use larger RDS instance type
3. Check network connectivity
4. Verify DATABASE_URL in Vercel env vars

### Authentication Issues

**Error**: `Session invalid` or `Login fails`

**Solution**:
1. Verify NEXTAUTH_SECRET is set
2. Check NEXTAUTH_URL matches domain
3. Clear browser cookies
4. Check API logs in Vercel

---

## Post-Launch Checklist

- [ ] Application loads without errors
- [ ] Signup flow works
- [ ] Login flow works
- [ ] Can create tasks
- [ ] Can browse tasks
- [ ] Database records appear in AWS
- [ ] Email notifications configured (if applicable)
- [ ] Security headers enabled
- [ ] HTTPS working
- [ ] Custom domain setup (if needed)
- [ ] Monitoring/alerts configured
- [ ] Backups scheduled
- [ ] Documentation complete

---

## Scaling & Optimization

### Database Optimization

1. **Enable Aurora Read Replicas**
   - For read-heavy operations
   - Use read replica endpoint for queries

2. **Add Database Indexes**
   - Already configured in schema
   - Monitor slow query logs

3. **Connection Pooling**
   - Prisma handles automatically
   - Monitor connection count

### Application Optimization

1. **Edge Caching**
   - Vercel caches responses
   - Configure cache headers

2. **Code Splitting**
   - Next.js does automatically
   - Monitor bundle size

3. **Image Optimization**
   - Use Next.js Image component
   - Vercel optimizes automatically

### Monitoring

- Vercel Analytics for performance
- AWS CloudWatch for database
- Error tracking (consider Sentry)
- Uptime monitoring (consider UptimeRobot)

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **AWS RDS**: https://docs.aws.amazon.com/rds/
- **Prisma Docs**: https://www.prisma.io/docs
- **Vercel Support**: https://vercel.com/support

---

## Success! 🎉

Your TaskFlow application is now live on Vercel with AWS Aurora PostgreSQL!

Next steps:
- Monitor performance metrics
- Gather user feedback
- Iterate and improve features
- Scale infrastructure as needed

**Good luck with the Vercel & AWS Databases Hackathon!**
