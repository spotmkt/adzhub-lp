-- Fix merge_contacts_with_metadata - simplified approach
CREATE OR REPLACE FUNCTION public.merge_contacts_with_metadata(
  p_source_list_ids uuid[], 
  p_target_list_id uuid, 
  p_merge_op_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_total_inserted integer := 0;
  v_duplicates_removed integer := 0;
  v_total_before integer := 0;
BEGIN
  -- Calculate total contacts before merge
  SELECT COALESCE(SUM(total_contacts), 0) INTO v_total_before
  FROM contact_lists
  WHERE id = ANY(p_source_list_ids);
  
  -- Insert merged contacts with consolidated metadata
  INSERT INTO contacts (list_id, identifier, metadata, source_list_id)
  SELECT 
    p_target_list_id as list_id,
    identifier,
    -- Merge all metadata fields from all sources for this identifier
    jsonb_object_agg(
      meta.key, 
      meta.value
    ) FILTER (
      WHERE meta.key IS NOT NULL 
      AND meta.value IS NOT NULL 
      AND meta.value != 'null'
      AND meta.value != ''
    ) as merged_metadata,
    MIN(list_id) as source_list_id
  FROM contacts
  CROSS JOIN LATERAL jsonb_each_text(
    CASE 
      WHEN metadata IS NOT NULL AND jsonb_typeof(metadata) = 'object' 
      THEN metadata
      ELSE '{}'::jsonb
    END
  ) as meta
  WHERE list_id = ANY(p_source_list_ids)
  GROUP BY identifier;
  
  GET DIAGNOSTICS v_total_inserted = ROW_COUNT;
  v_duplicates_removed := v_total_before - v_total_inserted;
  
  -- Update total contacts in the target list
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