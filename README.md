# VidyaSathi — Rural Education Platform

VidyaSathi is a React + TypeScript learning platform for students with authentication, persistent study data, quizzes, notes, bookmarks, planning, teacher analytics, textbook content, and private document upload/processing.

## Completed modules

- Student registration/login with protected routes
- Student/teacher/admin role support
- Supabase-backed profiles and learning data
- PDF, DOCX, PPTX, TXT and Markdown document upload
- Private per-user document storage
- Browser-side text extraction and chunk storage
- Persistent study notes
- Persistent bookmarks with mastered state and notes
- Persistent quiz attempts and study progress
- Persistent study planner
- Persistent chat sessions
- Real teacher dashboard using database student/progress data
- Dashboard analytics based on the signed-in user's saved data
- Existing AI/chat functionality retained separately

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and add your Supabase project URL and publishable key.

```bash
cp .env.example .env
```

Do **not** put an OpenRouter/AI secret in a `VITE_*` variable. AI secrets belong in Supabase Edge Function secrets.

### 3. Apply the database migrations

Run all files in `supabase/migrations/` against the same Supabase project, including:

`20260823180000_vidyasathi_completion.sql`

The migration creates the persistent application tables, RLS policies, and the private `user-documents` storage bucket.

### 4. Assign a teacher

New accounts are created as students. To promote a trusted account to teacher, run this SQL in the Supabase SQL editor:

```sql
insert into public.user_roles (user_id, role)
select id, 'teacher'::public.app_role
from auth.users
where email = 'teacher@example.com'
on conflict (user_id, role) do nothing;
```

### 5. Start the app

```bash
npm run dev
```

## Document processing

The Documents page accepts PDF, DOCX, PPTX, TXT and Markdown files up to 25 MB. Files are stored privately under the authenticated user's storage folder. PDF.js, Mammoth and JSZip are loaded from their browser distributions for extraction; the extracted text is chunked and saved in Supabase.

## Important security note

Never commit `.env` or a client-side AI secret. The distributed project contains only `.env.example`.

## Validation

TypeScript validation:

```bash
npx tsc --noEmit
```

The source package intentionally does not include `node_modules`; run `npm install` after extracting the ZIP.
