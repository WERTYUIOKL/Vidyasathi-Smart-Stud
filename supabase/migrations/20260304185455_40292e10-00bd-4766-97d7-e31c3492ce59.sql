
CREATE TABLE public.cached_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_hash text NOT NULL UNIQUE,
  question text NOT NULL,
  answer text NOT NULL,
  board text,
  grade text,
  subject text,
  hit_count integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cached_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cached responses" ON public.cached_responses FOR SELECT USING (true);

CREATE INDEX idx_cached_responses_hash ON public.cached_responses(question_hash);
CREATE INDEX idx_cached_responses_filters ON public.cached_responses(board, grade, subject);
