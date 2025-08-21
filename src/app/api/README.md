# Next.js App Router API Pattern with Prisma & Supabase

## 🚀 Local Development Setup

### Running the Development Environment

This project uses both Vite (for the React frontend) and Next.js (for API routes):

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase and Clerk credentials

3. **Run the development servers:**
   ```bash
   npm run dev
   ```
   This will start:
   - Vite on `http://localhost:5173` (React app)
   - Next.js on `http://localhost:3000` (API routes only)
   
   The Vite server is configured to proxy `/api/*` requests to the Next.js server.

4. **Alternative: Run servers separately:**
   ```bash
   # Terminal 1: Vite frontend
   npm run dev:vite
   
   # Terminal 2: Next.js API
   npm run dev:next
   ```

### Important Notes for Local Development

- The frontend (Vite) runs on port 5173
- The API routes (Next.js) run on port 3000
- All `/api/*` requests from Vite are automatically proxied to Next.js
- Make sure both servers are running for the app to work properly

## Architecture Overview

This app uses:
- **Next.js App Router** for serverless API routes
- **Prisma** for database ORM (server-side only)
- **Supabase** for the PostgreSQL database
- **Clerk** for authentication

## The Pattern

### 1. API Routes (Server-Side)
Located in `src/app/api/[endpoint]/route.js`

```javascript
// Example: src/app/api/users/route.js
import prisma from '../../../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  // Handle GET requests
  const data = await prisma.user.findMany()
  return NextResponse.json(data)
}

export async function POST(request) {
  // Handle POST requests
  const body = await request.json()
  const data = await prisma.user.create({ data: body })
  return NextResponse.json(data)
}
```

### 2. Prisma Client (Server-Side Only)
Located in `src/lib/prisma.js`

```javascript
import { PrismaClient } from '../generated/prisma'

const globalForPrisma = globalThis
export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
```

### 3. React Hooks (Client-Side)
Located in `src/hooks/[hookName].js`

```javascript
// Example: src/hooks/useUsers.js
export function useUsers() {
  const fetchUsers = async () => {
    const response = await fetch('/api/users')
    const data = await response.json()
    return data
  }
  
  // ... more methods
}
```

### 4. Supabase Client (Client-Side)
Located in `src/lib/supabase.js`

Used for real-time subscriptions, file uploads, or direct queries when needed.

## Important Rules

### ❌ DON'T:
- Never import Prisma in React components or hooks
- Never use `import.meta.env` in API routes (use `process.env`)
- Never create API routes outside of `src/app/api/`

### ✅ DO:
- Always use Prisma only in API routes
- Always use `NextResponse` for API responses
- Always handle errors properly in API routes
- Always use `fetch()` to call API routes from React

## File Structure

```
src/
├── app/
│   └── api/
│       ├── users/
│       │   └── route.js        # User CRUD operations
│       ├── auth/
│       │   └── sync/
│       │       └── route.js    # Sync Clerk with database
│       └── README.md           # This file
├── hooks/
│   ├── useAuth.js             # Auth hook using /api/auth/sync
│   └── useUsers.js            # Users hook using /api/users
└── lib/
    ├── prisma.js              # Prisma client (server-side)
    └── supabase.js            # Supabase client (client-side)
```

## Example Usage

### In a React Component:

```javascript
import { useUsers } from '../hooks/useUsers'

function UserList() {
  const { users, isLoading, createUser } = useUsers()
  
  const handleCreate = async () => {
    await createUser({
      email: 'test@example.com',
      firstName: 'John',
      // ...
    })
  }
  
  // ... render UI
}
```

### Authentication Flow:

1. User signs in with Clerk
2. `useAuth` hook automatically syncs with database via `/api/auth/sync`
3. Database user is created/updated with Clerk ID
4. User role and permissions are stored in database

## Adding New API Endpoints

1. Create folder: `src/app/api/[endpoint]/`
2. Create `route.js` file
3. Export named functions: `GET`, `POST`, `PUT`, `DELETE`
4. Use `prisma` from `src/lib/prisma.js`
5. Return `NextResponse.json()`

## Environment Variables

Required in `.env.local`:
- `DATABASE_URL` - Supabase database URL
- `DIRECT_URL` - Supabase direct connection URL
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key
- Clerk environment variables 