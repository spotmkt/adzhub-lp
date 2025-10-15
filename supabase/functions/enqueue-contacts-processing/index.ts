import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactUploadRequest {
  fileName: string;
  identifierType: 'phone' | 'email';
  identifierColumn: string;
  metadataColumns: string[];
  contacts: Array<{
    [key: string]: any;
  }>;
  totalContacts: number;
  lgpdConsent: boolean;
  dataUsageConsent: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const requestData: ContactUploadRequest = await req.json();
    console.log('Processing contact upload request:', {
      fileName: requestData.fileName,
      totalContacts: requestData.totalContacts,
      userId: user.id,
    });

    // Validate required fields
    if (!requestData.fileName || !requestData.identifierType || 
        !requestData.identifierColumn || !requestData.contacts || 
        requestData.contacts.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate LGPD consent
    if (!requestData.lgpdConsent || !requestData.dataUsageConsent) {
      return new Response(
        JSON.stringify({ error: 'LGPD and data usage consents are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create job record in database
    const { data: job, error: jobError } = await supabaseClient
      .from('contact_upload_jobs')
      .insert({
        user_id: user.id,
        file_name: requestData.fileName,
        status: 'queued',
        total_contacts: requestData.totalContacts,
        identifier_type: requestData.identifierType,
        identifier_column: requestData.identifierColumn,
        metadata_columns: requestData.metadataColumns || [],
        lgpd_consent: requestData.lgpdConsent,
        data_usage_consent: requestData.dataUsageConsent,
      })
      .select()
      .single();

    if (jobError || !job) {
      console.error('Error creating job:', jobError);
      return new Response(
        JSON.stringify({ error: 'Failed to create job', details: jobError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Job created successfully:', job.id);

    // Send data to n8n webhook for processing
    const n8nWebhookUrl = Deno.env.get('BASE_PROCESSING');
    
    if (!n8nWebhookUrl) {
      console.error('BASE_PROCESSING not configured');
      
      // Update job status to failed
      await supabaseClient
        .from('contact_upload_jobs')
        .update({
          status: 'failed',
          error_message: 'n8n webhook URL not configured',
        })
        .eq('id', job.id);

      return new Response(
        JSON.stringify({ 
          error: 'Serviço de processamento não configurado',
          jobId: job.id,
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send to n8n (fire and forget - don't await)
    fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId: job.id,
        userId: user.id,
        fileName: requestData.fileName,
        identifierType: requestData.identifierType,
        identifierColumn: requestData.identifierColumn,
        metadataColumns: requestData.metadataColumns || [],
        contacts: requestData.contacts,
        totalContacts: requestData.totalContacts,
        lgpdConsent: requestData.lgpdConsent,
        dataUsageConsent: requestData.dataUsageConsent,
        supabaseUrl: Deno.env.get('SUPABASE_URL'),
        supabaseKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
      }),
    }).catch((error) => {
      console.error('Error sending to n8n:', error);
      // Update job status to failed
      supabaseClient
        .from('contact_upload_jobs')
        .update({
          status: 'failed',
          error_message: `Failed to send to n8n: ${error.message}`,
        })
        .eq('id', job.id);
    });

    console.log('Data sent to n8n for processing');

    // Return job information immediately
    return new Response(
      JSON.stringify({
        success: true,
        jobId: job.id,
        status: 'queued',
        totalContacts: requestData.totalContacts,
        message: 'Upload enfileirado com sucesso. O processamento começará em breve.',
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
