# Architecture Diagram - TaskFlow Application

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Client Layer                                 │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Browser / Mobile Device                                      │  │
│  │  - React Components (Next.js Frontend)                        │  │
│  │  - HTML, CSS (Tailwind), JavaScript                           │  │
│  │  - Local Storage (User Session Management)                    │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              ↓ HTTPS
┌─────────────────────────────────────────────────────────────────────┐
│                    Vercel CDN / Edge Network                         │
│  - Static asset delivery                                             │
│  - Image optimization                                                │
│  - Request caching                                                   │
└─────────────────────────────────────────────────────────────────────┘
                              ↓ HTTPS
┌─────────────────────────────────────────────────────────────────────┐
│                   Application Layer (Vercel)                         │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Next.js Runtime                                              │  │
│  │                                                               │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │  Pages & Components                                     │ │  │
│  │  │  - app/page.tsx (Home)                                  │ │  │
│  │  │  - app/tasks/page.tsx (Task Browse)                     │ │  │
│  │  │  - app/dashboard/page.tsx (User Dashboard)              │ │  │
│  │  │  - app/auth/* (Authentication)                          │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  │                          ↓                                    │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │  API Routes                                             │ │  │
│  │  │  ├── /api/auth/signup                                   │ │  │
│  │  │  ├── /api/auth/login                                    │ │  │
│  │  │  ├── /api/tasks (GET, POST, PATCH)                      │ │  │
│  │  │  ├── /api/tasks/[id] (GET, PATCH)                       │ │  │
│  │  │  └── /api/tasks/offers (POST)                           │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  │                          ↓                                    │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │  Business Logic Layer                                   │ │  │
│  │  │  - Authentication (bcryptjs password hashing)           │ │  │
│  │  │  - Task management logic                                │ │  │
│  │  │  - Offer processing                                     │ │  │
│  │  │  - User rating calculations                             │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  │                          ↓                                    │  │
│  │  ┌─────────────────────────────────────────────────────────┐ │  │
│  │  │  Data Access Layer (Prisma ORM)                         │ │  │
│  │  │  - User queries                                         │ │  │
│  │  │  - Task queries                                         │ │  │
│  │  │  - Offer queries                                        │ │  │
│  │  │  - Review and notification queries                      │ │  │
│  │  │  - Transaction management                               │ │  │
│  │  └─────────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              ↓ TCP/IP
┌─────────────────────────────────────────────────────────────────────┐
│                   Database Layer (AWS)                               │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Aurora PostgreSQL (Recommended)                             │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │  Tables:                                                 │ │  │
│  │  │  ├── User (Authentication & Profile)                     │ │  │
│  │  │  │   - id, email, password_hash, name, rating, avatar   │ │  │
│  │  │  │                                                       │ │  │
│  │  │  ├── Task (Task Listings)                                │ │  │
│  │  │  │   - id, title, description, category, budget, status │ │  │
│  │  │  │   - creatorId, deadline, created_at, updated_at      │ │  │
│  │  │  │                                                       │ │  │
│  │  │  ├── TaskOffer (Bidding System)                          │ │  │
│  │  │  │   - id, taskId, workerId, amount, message, status    │ │  │
│  │  │  │   - created_at, updated_at                           │ │  │
│  │  │  │                                                       │ │  │
│  │  │  ├── Review (Ratings & Feedback)                         │ │  │
│  │  │  │   - id, taskId, reviewerId, rating, comment          │ │  │
│  │  │  │                                                       │ │  │
│  │  │  └── Notification (Activity Tracking)                    │ │  │
│  │  │      - id, userId, type, message, read, created_at      │ │  │
│  │  │                                                           │ │  │
│  │  │  Indexes:                                                │ │  │
│  │  │  - User.email (UNIQUE)                                   │ │  │
│  │  │  - Task.creatorId, Task.status                           │ │  │
│  │  │  - TaskOffer.taskId, TaskOffer.workerId                  │ │  │
│  │  │  - Review.taskId, Review.reviewerId                      │ │  │
│  │  │  - Notification.userId                                   │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  │                                                               │  │
│  │  Features:                                                   │  │
│  │  - Automated backups                                         │  │
│  │  - Read replicas for scalability                             │  │
│  │  - SSL/TLS encryption in transit                             │  │
│  │  - At-rest encryption                                        │  │
│  │  - Multi-AZ deployment for HA                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### User Authentication Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ 1. POST /api/auth/signup
       │    {email, password, name}
       ↓
┌─────────────────────────────┐
│  Next.js API Route          │
│  /api/auth/signup           │
└──────┬──────────────────────┘
       │
       │ 2. Hash password with bcryptjs
       │ 3. Check user doesn't exist
       ↓
┌─────────────────────────────┐
│  Prisma ORM                 │
│  user.create({...})         │
└──────┬──────────────────────┘
       │
       │ 4. INSERT INTO User
       ↓
┌─────────────────────────────┐
│  Aurora PostgreSQL          │
│  Stores user record         │
└──────┬──────────────────────┘
       │
       │ 5. Return user data
       ↓
┌─────────────┐
│   Browser   │
│ Store token │
│ in localStorage
└─────────────┘
```

### Task Listing & Browse Flow

```
┌─────────────┐
│   Browser   │
│ /tasks page │
└──────┬──────┘
       │
       │ 1. GET /api/tasks?status=open&category=web
       ↓
┌─────────────────────────────┐
│  Next.js API Route          │
│  /api/tasks                 │
└──────┬──────────────────────┘
       │
       │ 2. Apply filters
       │ 3. Query with Prisma
       ↓
┌─────────────────────────────┐
│  Prisma ORM                 │
│  task.findMany({...})       │
└──────┬──────────────────────┘
       │
       │ 4. SELECT * FROM Task
       │    JOIN User creator
       │    WHERE status = 'open'
       ↓
┌─────────────────────────────┐
│  Aurora PostgreSQL          │
│  Returns filtered tasks     │
└──────┬──────────────────────┘
       │
       │ 5. Return task list
       ↓
┌─────────────┐
│   Browser   │
│ Render      │
│ task cards  │
└─────────────┘
```

### Task Offer Submission Flow

```
┌─────────────────────────────┐
│   Worker Browser            │
│ Viewing task details        │
└──────┬──────────────────────┘
       │
       │ 1. POST /api/tasks/offers
       │    {taskId, workerId, amount, message}
       ↓
┌─────────────────────────────┐
│  Next.js API Route          │
│  /api/tasks/offers          │
└──────┬──────────────────────┘
       │
       │ 2. Validate inputs
       │ 3. Check duplicate offers
       │ 4. Create offer record
       ↓
┌─────────────────────────────┐
│  Prisma ORM                 │
│  taskOffer.create({...})    │
└──────┬──────────────────────┘
       │
       │ 5. INSERT INTO TaskOffer
       ↓
┌─────────────────────────────┐
│  Aurora PostgreSQL          │
│  Stores offer record        │
└──────┬──────────────────────┘
       │
       │ 6. Return offer confirmation
       ↓
┌──────────────────────────────────────┐
│   Task Creator Browser               │
│ Receives notification                │
│ (via polling or WebSocket)           │
│ Shows new offer in dashboard         │
└──────────────────────────────────────┘
```

## Database Schema Relationships

```
User (1) ──────────── (Many) Task
  │                      │
  │ creator_id           │ creator_id
  │                      │
  │                      └─ (Many) TaskOffer
  │                                  │
  │                                  │ worker_id
  └────────────────────────────────────┘
  
  │ reviewer_id
  └─ (Many) Review
                │
                └─ task_id
                └─ (to) Task

  │ user_id
  └─ (Many) Notification
```

## Technology Stack Architecture

```
Frontend Tier:
├── React 19 (UI Components)
├── Next.js 15 (SSR/SSG/API)
├── TypeScript (Type Safety)
├── Tailwind CSS (Styling)
└── Vercel (Deployment & CDN)

Backend Tier:
├── Next.js API Routes (Serverless Functions)
├── bcryptjs (Password Security)
├── Zod (Input Validation)
└── Node.js Runtime

Data Tier:
├── Prisma ORM (Database Abstraction)
├── Aurora PostgreSQL (Relational Database)
└── AWS (Infrastructure)
```

## Scalability Considerations

1. **Horizontal Scaling**
   - Vercel automatically scales API routes
   - Aurora read replicas for read-heavy operations
   - CDN caching for static assets

2. **Vertical Scaling**
   - Aurora storage can auto-scale
   - Database instance size can be increased
   - Vercel tier upgrades for higher concurrency

3. **Performance Optimization**
   - Database connection pooling (via Prisma)
   - Query optimization with proper indexes
   - API response caching
   - Next.js automatic code splitting

4. **Monitoring & Alerts**
   - Vercel analytics dashboard
   - AWS CloudWatch for database metrics
   - Error tracking (optional: Sentry)
   - Performance monitoring (optional: DataDog)

## Security Architecture

```
Layer 1: Transport Security
├── HTTPS/TLS encryption
├── Vercel DDoS protection
└── AWS WAF (optional)

Layer 2: Application Security
├── Input validation (Zod)
├── SQL injection prevention (Prisma ORM)
├── Password hashing (bcryptjs)
├── Environment variable secrets
└── CORS configuration

Layer 3: Data Security
├── Database encryption at rest
├── Encrypted backups
├── VPC isolation (AWS)
├── Database access controls
└── User authentication

Layer 4: Infrastructure Security
├── Vercel infrastructure protection
├── AWS security groups
├── IAM roles and policies
└── Audit logging
```

---

**This architecture is designed to be scalable, secure, and production-ready for the Vercel & AWS Databases Hackathon.**
