# Cumbre Market - Migrated to Supabase

## What changed
- Backend: Base44 → Supabase
- Auth: Base44 Auth → Supabase Auth (Google OAuth)
- Database: Base44 entities → Supabase PostgreSQL
- Storage: Base44 file upload → Supabase Storage

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables
Copy `.env.example` to `.env` and fill in your Supabase credentials.
The `.env` file already has your credentials pre-filled.

### 3. Enable Google Auth in Supabase
- Go to Supabase Dashboard → Authentication → Providers
- Enable Google and add your OAuth credentials

### 4. Run locally
```bash
npm run dev
```

### 5. Deploy to Vercel
- Push to GitHub
- Connect repo in Vercel
- Add environment variables in Vercel dashboard:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY
