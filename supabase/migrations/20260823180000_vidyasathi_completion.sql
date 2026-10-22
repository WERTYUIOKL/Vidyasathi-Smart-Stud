-- VidyaSathi persistent application data
CREATE TABLE IF NOT EXISTS public.user_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  mime_type TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing','ready','failed')),
  extracted_characters INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.user_documents(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(document_id, chunk_index)
);

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('chapter','mock')),
  subject TEXT NOT NULL,
  chapter TEXT NOT NULL,
  grade TEXT NOT NULL,
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  score_percent INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT 'General',
  grade TEXT NOT NULL DEFAULT 'General',
  note TEXT NOT NULL DEFAULT '',
  mastered BOOLEAN NOT NULL DEFAULT false,
  kind TEXT NOT NULL DEFAULT 'chat',
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.study_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT 'General',
  done BOOLEAN NOT NULL DEFAULT false,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Chat',
  grade TEXT NOT NULL DEFAULT '10th',
  board TEXT NOT NULL DEFAULT 'SSC',
  subject TEXT NOT NULL DEFAULT '',
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can CRUD own documents" ON public.user_documents;
CREATE POLICY "Users can CRUD own documents" ON public.user_documents FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can CRUD own document chunks" ON public.document_chunks;
CREATE POLICY "Users can CRUD own document chunks" ON public.document_chunks FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.user_documents d WHERE d.id = document_id AND d.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.user_documents d WHERE d.id = document_id AND d.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can CRUD own quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Users can CRUD own quiz attempts" ON public.quiz_attempts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Teachers can read all quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Teachers can read all quiz attempts" ON public.quiz_attempts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can CRUD own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can CRUD own bookmarks" ON public.bookmarks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can CRUD own tasks" ON public.study_tasks;
CREATE POLICY "Users can CRUD own tasks" ON public.study_tasks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can CRUD own chats" ON public.chat_sessions;
CREATE POLICY "Users can CRUD own chats" ON public.chat_sessions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can CRUD own activity" ON public.activity_log;
CREATE POLICY "Users can CRUD own activity" ON public.activity_log FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Teachers can read all activity" ON public.activity_log;
CREATE POLICY "Teachers can read all activity" ON public.activity_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Teachers can read student profiles" ON public.profiles;
CREATE POLICY "Teachers can read student profiles" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'));

INSERT INTO storage.buckets (id, name, public)
VALUES ('user-documents', 'user-documents', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users can upload own documents" ON storage.objects;
CREATE POLICY "Users can upload own documents" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'user-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Users can read own documents" ON storage.objects;
CREATE POLICY "Users can read own documents" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'user-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
DROP POLICY IF EXISTS "Users can delete own documents" ON storage.objects;
CREATE POLICY "Users can delete own documents" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'user-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Teachers can read all roles" ON public.user_roles;
CREATE POLICY "Teachers can read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'teacher') OR public.has_role(auth.uid(), 'admin'));
