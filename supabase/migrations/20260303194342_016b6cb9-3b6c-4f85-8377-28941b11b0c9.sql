
-- Enable pgvector for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Textbooks table
CREATE TABLE public.textbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  board TEXT NOT NULL, -- 'SSC' or 'HSC'
  grade TEXT NOT NULL, -- '10' or '12'
  subject TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Textbook chunks for RAG
CREATE TABLE public.textbook_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  textbook_id UUID REFERENCES public.textbooks(id) ON DELETE CASCADE NOT NULL,
  chapter TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(768),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for vector search
CREATE INDEX idx_textbook_chunks_embedding ON public.textbook_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Index for filtering
CREATE INDEX idx_textbook_chunks_textbook ON public.textbook_chunks(textbook_id);
CREATE INDEX idx_textbooks_board_grade ON public.textbooks(board, grade);

-- Enable RLS
ALTER TABLE public.textbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.textbook_chunks ENABLE ROW LEVEL SECURITY;

-- Public read access (educational content)
CREATE POLICY "Anyone can read textbooks" ON public.textbooks FOR SELECT USING (true);
CREATE POLICY "Anyone can read chunks" ON public.textbook_chunks FOR SELECT USING (true);

-- Only service role can insert/update/delete
CREATE POLICY "Service role can manage textbooks" ON public.textbooks FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role can manage chunks" ON public.textbook_chunks FOR ALL USING (auth.role() = 'service_role');

-- Function for similarity search
CREATE OR REPLACE FUNCTION public.search_textbook_chunks(
  query_embedding vector(768),
  match_count INT DEFAULT 5,
  filter_board TEXT DEFAULT NULL,
  filter_grade TEXT DEFAULT NULL,
  filter_subject TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  chapter TEXT,
  content TEXT,
  subject TEXT,
  grade TEXT,
  board TEXT,
  title TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    tc.id,
    tc.chapter,
    tc.content,
    t.subject,
    t.grade,
    t.board,
    t.title,
    1 - (tc.embedding <=> query_embedding) AS similarity
  FROM textbook_chunks tc
  JOIN textbooks t ON tc.textbook_id = t.id
  WHERE
    (filter_board IS NULL OR t.board = filter_board) AND
    (filter_grade IS NULL OR t.grade = filter_grade) AND
    (filter_subject IS NULL OR t.subject = filter_subject)
  ORDER BY tc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
