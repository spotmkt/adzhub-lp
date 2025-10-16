import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MergeRequest {
  sourceListIds: string[];
  targetListName: string;
  mergeStrategy: 'union' | 'deduplicate' | 'merge_metadata';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Autenticar usuário
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { sourceListIds, targetListName, mergeStrategy }: MergeRequest = await req.json();

    console.log('Merge request:', { sourceListIds, targetListName, mergeStrategy, userId: user.id });

    // Validações
    if (!sourceListIds || sourceListIds.length < 2) {
      throw new Error('Selecione pelo menos 2 bases para mesclar');
    }

    if (!targetListName || targetListName.trim() === '') {
      throw new Error('Nome da nova base é obrigatório');
    }

    // Buscar listas fonte para validações
    const { data: sourceLists, error: listsError } = await supabaseClient
      .from('contact_lists')
      .select('id, list_name, identifier_type, identifier_column, total_contacts, metadata_columns')
      .in('id', sourceListIds)
      .eq('user_id', user.id);

    if (listsError) {
      console.error('Error fetching source lists:', listsError);
      throw new Error('Erro ao buscar bases fonte');
    }

    if (!sourceLists || sourceLists.length !== sourceListIds.length) {
      throw new Error('Bases não encontradas ou você não tem permissão');
    }

    console.log('Source lists found:', sourceLists.length);

    // Validar que todas têm o mesmo identifier_type
    const identifierTypes = [...new Set(sourceLists.map(l => l.identifier_type))];
    if (identifierTypes.length > 1) {
      throw new Error('Todas as bases devem ter o mesmo tipo de identificador (telefone ou email)');
    }

    // Calcular total de contatos
    const totalContactsBefore = sourceLists.reduce((sum, list) => sum + list.total_contacts, 0);
    console.log('Total contacts before merge:', totalContactsBefore);

    // Criar nova contact_list
    const { data: newList, error: createListError } = await supabaseClient
      .from('contact_lists')
      .insert({
        user_id: user.id,
        list_name: targetListName,
        identifier_type: sourceLists[0].identifier_type,
        identifier_column: sourceLists[0].identifier_column,
        metadata_columns: [...new Set(sourceLists.flatMap(l => l.metadata_columns || []))],
        total_contacts: 0,
        job_id: crypto.randomUUID()
      })
      .select()
      .single();

    if (createListError || !newList) {
      console.error('Error creating new list:', createListError);
      throw new Error('Erro ao criar nova base');
    }

    console.log('New list created:', newList.id);

    // Criar operação de merge
    const { data: mergeOp, error: mergeOpError } = await supabaseClient
      .from('contact_merge_operations')
      .insert({
        user_id: user.id,
        merged_list_id: newList.id,
        source_list_ids: sourceListIds,
        merge_strategy: mergeStrategy,
        total_contacts_before: totalContactsBefore,
        status: 'processing'
      })
      .select()
      .single();

    if (mergeOpError || !mergeOp) {
      console.error('Error creating merge operation:', mergeOpError);
      throw new Error('Erro ao criar operação de merge');
    }

    console.log('Merge operation created:', mergeOp.id);
    console.log('Executing merge strategy:', mergeStrategy);

    // Executar função PostgreSQL apropriada
    let result: any;
    
    if (mergeStrategy === 'union') {
      const { data, error } = await supabaseClient.rpc('merge_contacts_union', {
        p_source_list_ids: sourceListIds,
        p_target_list_id: newList.id,
        p_merge_op_id: mergeOp.id
      });
      
      if (error) {
        console.error('Error in merge_contacts_union:', error);
        throw error;
      }
      result = { total_inserted: data, duplicates_removed: 0, total_before: totalContactsBefore };
      console.log('Union merge completed:', result);
      
    } else if (mergeStrategy === 'deduplicate') {
      const { data, error } = await supabaseClient.rpc('merge_contacts_deduplicate', {
        p_source_list_ids: sourceListIds,
        p_target_list_id: newList.id,
        p_merge_op_id: mergeOp.id
      });
      
      if (error) {
        console.error('Error in merge_contacts_deduplicate:', error);
        throw error;
      }
      result = data;
      console.log('Deduplicate merge completed:', result);
      
    } else if (mergeStrategy === 'merge_metadata') {
      const { data, error } = await supabaseClient.rpc('merge_contacts_with_metadata', {
        p_source_list_ids: sourceListIds,
        p_target_list_id: newList.id,
        p_merge_op_id: mergeOp.id
      });
      
      if (error) {
        console.error('Error in merge_contacts_with_metadata:', error);
        throw error;
      }
      result = data;
      console.log('Metadata merge completed:', result);
    }

    // Atualizar operação como completa
    await supabaseClient
      .from('contact_merge_operations')
      .update({
        status: 'completed',
        total_contacts_after: result.total_inserted,
        duplicates_removed: result.duplicates_removed || 0,
        completed_at: new Date().toISOString()
      })
      .eq('id', mergeOp.id);

    console.log('Merge operation completed successfully');

    return new Response(JSON.stringify({
      success: true,
      mergeOperationId: mergeOp.id,
      newListId: newList.id,
      totalContactsBefore: result.total_before,
      totalContactsAfter: result.total_inserted,
      duplicatesRemoved: result.duplicates_removed || 0
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Merge error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Erro ao mesclar bases',
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
