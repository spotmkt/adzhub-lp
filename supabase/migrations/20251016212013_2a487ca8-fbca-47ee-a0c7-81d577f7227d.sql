-- Fix merge_contacts_with_metadata to handle null/invalid metadata
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
  v_contact_record RECORD;
BEGIN
  -- Calculate total contacts before merge
  SELECT COALESCE(SUM(total_contacts), 0) INTO v_total_before
  FROM contact_lists
  WHERE id = ANY(p_source_list_ids);
  
  -- Merge metadata for each unique identifier
  FOR v_contact_record IN
    SELECT 
      identifier,
      COALESCE(
        jsonb_object_agg(key, value) FILTER (
          WHERE key IS NOT NULL 
          AND value IS NOT NULL 
          AND value::text != '' 
          AND value::text != 'null'
        ),
        '{}'::jsonb
      ) as merged_metadata,
      (array_agg(list_id ORDER BY created_at))[1] as source_list_id
    FROM contacts
    LEFT JOIN LATERAL jsonb_each_text(
      CASE 
        WHEN jsonb_typeof(metadata) = 'object' THEN metadata
        ELSE '{}'::jsonb
      END
    ) ON true
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