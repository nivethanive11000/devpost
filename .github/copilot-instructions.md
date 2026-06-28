# TaskFlow Development Guidelines

This file provides guidelines for developers working on the TaskFlow project using GitHub Copilot and other AI assistants.

## Project Overview

TaskFlow is a full-stack task management and marketplace platform built with:
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel with AWS Databases

## Code Standards

### TypeScript
- Use strict mode (`strict: true` in tsconfig.json)
- Always define types for function parameters and return values
- Use interfaces for object types
- Avoid using `any` type

### Component Guidelines
- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable UI patterns to separate components
- Use TypeScript for prop definitions (not PropTypes)

Example:
```typescript
interface TaskCardProps {
  title: string;
  budget: number;
  description: string;
  onSelect: (id: string) => void;
}

export function TaskCard({ title, budget, description, onSelect }: TaskCardProps) {
  return (
    <div className="card">
      {/* Component content */}
    </div>
  );
}
```

### API Routes
- Use `/api/[resource]/route.ts` for RESTful endpoints
- Always validate input using Zod
- Return appropriate HTTP status codes
- Include error handling with try-catch
- Use TypeScript for request/response types

Example:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json());
    // Process request
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
}
```

### Styling
- Use Tailwind CSS utility classes
- Define reusable component styles in globals.css
- Use Tailwind's @apply directive for custom components
- Maintain consistent spacing and color schemes

### Database
- Use Prisma for all database operations
- Define relationships clearly in schema.prisma
- Create indexes for frequently queried fields
- Use migrations for schema changes
- Validate data before database operations

## Folder Structure

```
app/
├── api/                    # API routes (RESTful)
│   ├── auth/              # Authentication endpoints
│   ├── tasks/             # Task management endpoints
│   └── [resource]/        # Other resources
├── auth/                  # Authentication pages
├── tasks/                 # Task management pages
├── dashboard/             # User dashboard
├── layout.tsx             # Root layout
├── page.tsx               # Home page
└── globals.css            # Global styles

prisma/
└── schema.prisma          # Database schema

components/               # Reusable React components
lib/                      # Utility functions and helpers
public/                   # Static assets
```

## Development Workflow

### Local Setup
```bash
npm install
npm run db:generate
npm run db:migrate
npm run dev
```

### Making Changes
1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes following code standards
3. Test locally at `http://localhost:3000`
4. Commit with clear messages: `git commit -m "feat: add task filtering"`
5. Push and create pull request

### Git Commit Messages
- Use conventional commits: `type(scope): description`
- Types: feat, fix, docs, style, refactor, perf, test, chore
- Example: `feat(tasks): add task filtering by category`

## Common Patterns

### Authentication Check
```typescript
const user = localStorage.getItem('user');
if (!user) {
  router.push('/auth/login');
  return;
}
```

### API Call Pattern
```typescript
const response = await fetch('/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

if (!response.ok) {
  throw new Error('API request failed');
}

const result = await response.json();
```

### Form Handling
```typescript
const [formData, setFormData] = useState({ field: '' });
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  
  try {
    // Handle submission
  } catch (err) {
    setError('Error message');
  } finally {
    setLoading(false);
  }
};
```

## Testing Guidelines

- Write tests for API routes and utilities
- Use meaningful test descriptions
- Test both happy and error paths
- Mock external dependencies

## Performance Guidelines

- Use Next.js Image component for images
- Implement lazy loading for lists
- Optimize database queries with proper indexes
- Monitor bundle size with `next/bundle-analyzer`
- Use React.memo for expensive components

## Security Guidelines

- Never store secrets in code
- Use environment variables for configuration
- Validate all user inputs
- Use HTTPS in production
- Implement CORS properly
- Use parameterized queries (Prisma does this)
- Hash passwords with bcryptjs

## Debugging

- Use browser DevTools (F12) for frontend debugging
- Check server logs in terminal for API issues
- Use Vercel logs for production debugging
- Check Prisma Studio: `npx prisma studio`

## Documentation

- Update README.md for major features
- Add JSDoc comments to complex functions
- Document API endpoints in code comments
- Update QUICKSTART.md for setup changes

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Documentation](https://react.dev)

## Common Issues & Solutions

### Database Connection Errors
- Check DATABASE_URL format
- Verify PostgreSQL is running
- Check firewall/security groups
- Test connection with Prisma Studio

### Build Failures
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run build`

### Git Merge Conflicts
- Resolve conflicts manually in editor
- Test after resolving
- Commit with message explaining resolution

## Code Review Checklist

When submitting PR, ensure:
- [ ] Code follows TypeScript standards
- [ ] No console.log or debug code remains
- [ ] Error handling is implemented
- [ ] Tests pass locally
- [ ] No security issues
- [ ] Performance optimized
- [ ] Documentation updated
- [ ] No merge conflicts

## Questions or Improvements?

Create an issue or discussion in the repository to suggest improvements to these guidelines.
