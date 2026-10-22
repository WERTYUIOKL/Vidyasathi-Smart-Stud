
INSERT INTO storage.buckets (id, name, public)
VALUES ('textbooks', 'textbooks', true);

CREATE POLICY "Anyone can read textbooks"
ON storage.objects FOR SELECT
USING (bucket_id = 'textbooks');
