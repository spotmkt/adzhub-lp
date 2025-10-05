import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    console.log('Starting image upload process...');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const clientId = formData.get('client_id') as string;
    const customFileName = formData.get('fileName') as string;

    if (!file) {
      console.log('No file provided in request');
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`File received: ${file.name}, size: ${file.size}, type: ${file.type}`);

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      console.log(`Invalid file type: ${file.type}`);
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.log(`File too large: ${file.size} bytes`);
      return new Response(
        JSON.stringify({ error: 'File size exceeds 10MB limit' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = crypto.randomUUID().substring(0, 8);
    const fileExtension = file.name.split('.').pop();
    const baseName = customFileName || file.name.split('.')[0];
    const fileName = `${timestamp}-${randomId}-${baseName}.${fileExtension}`;
    
    // Organize by client_id if provided
    const filePath = clientId ? `${clientId}/${fileName}` : fileName;

    console.log(`Uploading file to path: ${filePath}`);

    // Convert file to ArrayBuffer
    const fileBuffer = await file.arrayBuffer();

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('company-profiles')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return new Response(
        JSON.stringify({ error: 'Upload failed', details: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Upload successful:', data);

    // Generate public URL
    const { data: urlData } = supabase.storage
      .from('company-profiles')
      .getPublicUrl(filePath);

    const response = {
      success: true,
      url: urlData.publicUrl,
      file_path: filePath,
      file_name: fileName,
      file_size: file.size,
      file_type: file.type,
      client_id: clientId || null,
      uploaded_at: new Date().toISOString()
    };

    console.log('Upload completed successfully:', response);

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});