# TaskFlow - Task Management & Marketplace Platform

A full-stack application for managing tasks and connecting task creators with workers. Built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL.

## 🚀 Features

- **Task Marketplace**: Post tasks or browse available work opportunities
- **User Authentication**: Secure signup and login with bcrypt password hashing
- **Task Management**: Create, view, and manage tasks with detailed descriptions
- **Bidding System**: Workers can submit offers for tasks with custom pricing
- **Rating System**: Build reputation with user ratings and reviews
- **Real-time Notifications**: Get updates on task activity
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Database Persistence**: PostgreSQL with Prisma ORM

## 📋 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom JWT-based authentication
- **Deployment**: Vercel
- **Additional Tools**: Zod for validation, bcryptjs for password hashing

## 📁 Project Structure

```
taskflow/
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/
│   │   │   ├── signup/
│   │   │   └── login/
│   │   └── tasks/
│   │       ├── route.ts
│   │       ├── [id]/
│   │       └── offers/
│   ├── auth/                # Authentication pages
│   │   ├── signup/
│   │   └── login/
│   ├── tasks/               # Tasks pages
│   │   ├── page.tsx
│   │   └── [id]/
│   ├── dashboard/           # User dashboard
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── prisma/
│   └── schema.prisma        # Database schema
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── vercel.json              # Vercel deployment config
└── README.md                # This file
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database
- Git

### 1. Clone or Setup Project

```bash
# Navigate to project directory
cd taskflow
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/taskflow"

# Next Auth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# API
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### 4. Setup Database

```bash
# Run Prisma migrations to create database tables
npm run db:migrate

# Generate Prisma client
npm run db:generate
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Database Schema

### User Model
- Stores user profile information
- Includes authentication credentials (password hash)
- Tracks user ratings and reputation

### Task Model
- Task details (title, description, budget, deadline)
- Status tracking (open, assigned, completed)
- Creator reference
- Category classification

### TaskOffer Model
- Worker bids for tasks
- Tracks offer amount and message
- Status management (pending, accepted, rejected)

### Review Model
- Task completion feedback
- Rating and comment from reviewer
- Links reviewer to task

### Notification Model
- User activity notifications
- Read status tracking
- Notification types

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks with filters
- `POST /api/tasks` - Create new task
- `GET /api/tasks/[id]` - Get task details
- `PATCH /api/tasks/[id]` - Update task status

### Task Offers
- `POST /api/tasks/offers` - Submit task offer

## 🌐 Pages

### Public Pages
- `/` - Home page with features and CTA
- `/tasks` - Browse all available tasks
- `/auth/signup` - User registration
- `/auth/login` - User login

### Protected Pages
- `/dashboard` - User dashboard (requires authentication)
- `/tasks/[id]` - Task details with offers

## 🚀 Deployment to Vercel

### Prerequisites
- Vercel account (sign up at [vercel.com](https://vercel.com))
- GitHub account with repository pushed

### Deployment Steps

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will detect Next.js and suggest settings
   - Click "Deploy"

3. **Set Environment Variables in Vercel**
   - Go to Settings → Environment Variables
   - Add your production PostgreSQL DATABASE_URL
   - Add NEXTAUTH_SECRET
   - Add NEXTAUTH_URL (your Vercel domain)

4. **Setup PostgreSQL Database**
   
   **Option A: Vercel Postgres (Recommended)**
   - In Vercel dashboard, go to Storage → Create Database
   - Connect Postgres database
   - Copy connection string to DATABASE_URL
   
   **Option B: External PostgreSQL (Aurora, etc.)**
   - Use your AWS Aurora PostgreSQL connection string
   - Ensure firewall allows Vercel IPs
   - Add connection string to environment variables

5. **Run Database Migrations on Production**
   ```bash
   # In your local terminal with production DATABASE_URL
   DATABASE_URL="your-production-db-url" npm run db:migrate
   ```

6. **Deploy**
   - Vercel automatically redeploys on main branch push
   - Monitor deployment in Vercel dashboard

## 🏗️ AWS Database Options

This project supports three AWS database options:

### 1. Aurora PostgreSQL
- Managed relational database
- High availability and automatic backups
- Perfect for this application
- Connection: Standard PostgreSQL connection string
- Add to `DATABASE_URL` environment variable

### 2. Aurora DSQL
- Amazon's distributed SQL database
- Designed for global applications
- Use PostgreSQL connection string format

### 3. DynamoDB (Alternative)
- NoSQL document database
- Requires schema adaptation
- Better for unstructured data
- Would need SDK integration (aws-sdk)

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Vercel CDN                             │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   Next.js App                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Frontend (React Components)                 │   │
│  │  - Home, Tasks, Dashboard, Auth Pages              │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │      API Routes (Backend Logic)                     │   │
│  │  - /api/auth/* (Authentication)                    │   │
│  │  - /api/tasks/* (Task Management)                  │   │
│  │  - /api/tasks/offers/* (Bidding)                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↓                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Prisma ORM                                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│        Aurora PostgreSQL / AWS Database                      │
│  - Users, Tasks, Offers, Reviews, Notifications            │
└─────────────────────────────────────────────────────────────┘
```

## 🔒 Security Features

- Password hashing with bcryptjs
- Environment variables for secrets
- SQL injection protection via Prisma
- CORS headers in API routes
- User authentication checks on protected routes

## 📱 Responsive Design

- Mobile-first approach with Tailwind CSS
- Grid layouts that adapt to screen sizes
- Touch-friendly buttons and inputs
- Optimized navigation for all devices

## 🚀 Performance Optimizations

- Next.js automatic code splitting
- Image optimization
- API route optimization
- Database query optimization with Prisma

## 🐛 Troubleshooting

### Database Connection Issues
- Check DATABASE_URL format
- Verify PostgreSQL is running
- Ensure firewall allows connections

### Build Failures
- Run `npm install` to ensure all dependencies
- Clear `.next` folder: `rm -rf .next`
- Check for TypeScript errors: `npm run build`

### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Check localStorage in browser console
- Ensure cookies are enabled

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [AWS Database Services](https://aws.amazon.com/databases)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on GitHub or contact the development team.

---

**Happy Coding! 🎉**

Built with ❤️ for the Vercel & v0.app AWS Databases Hackathon
