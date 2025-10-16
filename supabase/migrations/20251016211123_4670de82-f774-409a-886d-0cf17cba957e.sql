-- Fix merge_contacts_union to handle duplicates
CREATE OR REPLACE FUNCTION public.merge_contacts_union(
  p_source_list_ids uuid[], 
  p_target_list_id uuid, 
  p_merge_op_id uuid
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_total_inserted integer := 0;
  v_rows_affected integer;
  v_source_list_id uuid;
BEGIN
  -- Insert all contacts from source lists, skipping duplicates
  FOREACH v_source_list_id IN ARRAY p_source_list_ids
  LOOP
    INSERT INTO contacts (list_id, identifier, metadata, source_list_id)
    SELECT 
      p_target_list_id,
      identifier,
      metadata,
      v_source_list_id
    FROM contacts
    WHERE list_id = v_source_list_id
    ON CONFLICT (list_id, identifier) DO NOTHING;
    
    GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
    v_total_inserted := v_total_inserted + v_rows_affected;
  END LOOP;
  
  -- Update total contacts in the target list
  UPDATE contact_lists
  SET total_contacts = v_total_inserted
  WHERE id = p_target_list_id;
  
  RETURN v_total_inserted;
END;
$$;

-- Fix merge_contacts_with_metadata to use proper UUID handling
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
      jsonb_object_agg(key, value) FILTER (
        WHERE value IS NOT NULL 
        AND value::text != '' 
        AND value::text != 'null'
      ) as merged_metadata,
      (array_agg(list_id ORDER BY created_at))[1] as source_list_id
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