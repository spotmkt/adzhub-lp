-- Criar tabela de operações de mesclagem
CREATE TABLE contact_merge_operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  merged_list_id uuid REFERENCES contact_lists(id) ON DELETE CASCADE,
  source_list_ids uuid[] NOT NULL,
  merge_strategy text NOT NULL CHECK (merge_strategy IN ('union', 'deduplicate', 'merge_metadata')),
  total_contacts_before integer NOT NULL DEFAULT 0,
  total_contacts_after integer NOT NULL DEFAULT 0,
  duplicates_removed integer DEFAULT 0,
  deduplication_column text,
  status text NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  error_message text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Índices para performance
CREATE INDEX idx_merge_ops_user_id ON contact_merge_operations(user_id);
CREATE INDEX idx_merge_ops_status ON contact_merge_operations(status);

-- RLS Policies
ALTER TABLE contact_merge_operations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their merge operations"
ON contact_merge_operations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create merge operations"
ON contact_merge_operations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update merge operations"
ON contact_merge_operations FOR UPDATE
USING (auth.uid() = user_id);

-- Adicionar coluna source_list_id em contacts para rastreabilidade
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS source_list_id uuid REFERENCES contact_lists(id);

-- Preencher dados existentes
UPDATE contacts 
SET source_list_id = list_id
WHERE source_list_id IS NULL;

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_contacts_source_list_id ON contacts(source_list_id);

-- Função PostgreSQL: Merge UNION (mantém todos)
CREATE OR REPLACE FUNCTION merge_contacts_union(
  p_source_list_ids uuid[],
  p_target_list_id uuid,
  p_merge_op_id uuid
) RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_inserted integer := 0;
  v_rows_affected integer;
  v_source_list_id uuid;
BEGIN
  FOREACH v_source_list_id IN ARRAY p_source_list_ids
  LOOP
    INSERT INTO contacts (list_id, identifier, metadata, source_list_id)
    SELECT 
      p_target_list_id,
      identifier,
      metadata,
      v_source_list_id
    FROM contacts
    WHERE list_id = v_source_list_id;
    
    GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
    v_total_inserted := v_total_inserted + v_rows_affected;
  END LOOP;
  
  UPDATE contact_lists
  SET total_contacts = v_total_inserted
  WHERE id = p_target_list_id;
  
  RETURN v_total_inserted;
END;
$$;

-- Função PostgreSQL: Merge com DEDUPLICAÇÃO
CREATE OR REPLACE FUNCTION merge_contacts_deduplicate(
  p_source_list_ids uuid[],
  p_target_list_id uuid,
  p_merge_op_id uuid
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_inserted integer := 0;
  v_duplicates_removed integer := 0;
  v_total_before integer := 0;
BEGIN
  SELECT COALESCE(SUM(total_contacts), 0) INTO v_total_before
  FROM contact_lists
  WHERE id = ANY(p_source_list_ids);
  
  INSERT INTO contacts (list_id, identifier, metadata, source_list_id)
  SELECT DISTINCT ON (identifier)
    p_target_list_id,
    identifier,
    metadata,
    list_id as source_list_id
  FROM contacts
  WHERE list_id = ANY(p_source_list_ids)
  ORDER BY identifier, created_at ASC;
  
  GET DIAGNOSTICS v_total_inserted = ROW_COUNT;
  v_duplicates_removed := v_total_before - v_total_inserted;
  
  UPDATE contact_lists
  SET total_contacts = v_total_inserted
  WHERE id = p_target_list_id;
  
  RETURN jsonb_build_object(
    'total_inserted', v_total_inserted,
    'duplicates_removed', v_duplicates_removed,
    'total_before', v_total_before
  );
END;
$$;

-- Função PostgreSQL: Merge com METADATA COMPLETO
CREATE OR REPLACE FUNCTION merge_contacts_with_metadata(
  p_source_list_ids uuid[],
  p_target_list_id uuid,
  p_merge_op_id uuid
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_inserted integer := 0;
  v_duplicates_removed integer := 0;
  v_total_before integer := 0;
  v_contact_record RECORD;
BEGIN
  SELECT COALESCE(SUM(total_contacts), 0) INTO v_total_before
  FROM contact_lists
  WHERE id = ANY(p_source_list_ids);
  
  FOR v_contact_record IN
    SELECT 
      identifier,
      jsonb_object_agg(key, value) FILTER (WHERE value IS NOT NULL AND value::text != '' AND value::text != 'null') as merged_metadata,
      MIN(list_id) as source_list_id
    FROM contacts,
    LATERAL jsonb_each_text(metadata)
    WHERE list_id = ANY(p_source_list_ids)
    GROUP BY identifier
  LOOP
    INSERT INTO contacts (list_id, identifier, metadata, source_list_id)
    VALUES (
      p_target_list_id,
      v_contact_record.identifier,
      v_contact_record.merged_metadata,
      v_contact_record.source_list_id
    );
    
    v_total_inserted := v_total_inserted + 1;
  END LOOP;
  
  v_duplicates_removed := v_total_before - v_total_inserted;
  
  UPDATE contact_lists
  SET total_contacts = v_total_inserted
  WHERE id = p_target_list_id;
  
  RETURN jsonb_build_object(
    'total_inserted', v_total_inserted,
    'duplicates_removed', v_duplicates_removed,
    'total_before', v_total_before
  );
END;
$$;