import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function base64ToUint8Array(dataUrl: string): {
  bytes: Uint8Array;
  mime: string;
} {
  const [header, encoded] = dataUrl.split(",", 2);
  const mime = header.match(/data:([^;]+)/)?.[1] ?? "image/png";
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return { bytes, mime };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      imageData,
      maskData,
      prompt,
      size,
      model,
      quality,
      input_fidelity,
    } = await req.json();

    const keys = [
      Deno.env.get("OPENAI_API_KEY")?.trim(),
      Deno.env.get("OPENAI_IMAGE_EDIT_KEY")?.trim(),
    ].filter((k): k is string => !!k);
    const uniqueKeys = [...new Set(keys)];
    if (uniqueKeys.length === 0) {
      throw new Error(
        "Configure OPENAI_API_KEY ou OPENAI_IMAGE_EDIT_KEY nos secrets do Supabase"
      );
    }

    if (!imageData || !prompt) {
      return new Response(
        JSON.stringify({ error: "imageData and prompt are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const img = base64ToUint8Array(imageData);
    const maskParsed = maskData ? base64ToUint8Array(maskData) : null;

    /** Modelo padrão: gpt-image-1.5 (melhor fidelidade que gpt-image-1, ver docs OpenAI). */
    const modelId = (typeof model === "string" && model.trim()) || "gpt-image-1.5";

    let promptForApi = typeof prompt === "string" ? prompt.trim() : "";
    if (maskParsed && promptForApi) {
      promptForApi +=
        "\n\n[Instrução de edição (máscara PNG da API): pixels totalmente transparentes na máscara = únicas regiões que podem ser alteradas; pixels opacos (brancos) = congelar e manter idênticos ao original. Aplique o pedido do usuário somente sobre as áreas transparentes; não redesenhe o restante da cena.]";
    }

    console.log(
      "edit-image-mask: prompt=",
      promptForApi.slice(0, 120),
      "hasMask=",
      !!maskData
    );

    const buildForm = () => {
      const form = new FormData();
      form.append("model", modelId);
      form.append("prompt", promptForApi);
      if (size) form.append("size", size);
      form.append("quality", quality || "high");
      if (modelId.startsWith("gpt-image") || modelId.startsWith("chatgpt")) {
        form.append("input_fidelity", input_fidelity || "high");
      }
      form.append("image", new Blob([img.bytes], { type: img.mime }), "image.png");
      if (maskParsed) {
        form.append(
          "mask",
          new Blob([maskParsed.bytes], { type: maskParsed.mime }),
          "mask.png"
        );
      }
      return form;
    };

    let response: Response | null = null;
    let lastErrBody = "";
    for (let i = 0; i < uniqueKeys.length; i++) {
      const apiKey = uniqueKeys[i];
      response = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: buildForm(),
      });
      if (response.ok) break;
      lastErrBody = await response.text();
      console.error(
        "OpenAI images/edits error:",
        response.status,
        "keyIndex=",
        i,
        lastErrBody.slice(0, 500)
      );
      if (response.status === 401 && i < uniqueKeys.length - 1) {
        continue;
      }
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Please try again later.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      return new Response(
        JSON.stringify({
          error: `OpenAI returned ${response.status}`,
          detail: lastErrBody,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!response?.ok) {
      return new Response(
        JSON.stringify({
          error: "OpenAI request failed",
          detail: lastErrBody,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();

    const editedImageUrl = data.data?.[0]?.url ?? data.data?.[0]?.b64_json;
    if (!editedImageUrl) {
      console.error("No image in OpenAI response:", JSON.stringify(data));
      throw new Error("No image returned from OpenAI");
    }

    const isB64 = !editedImageUrl.startsWith("http");
    const editedImage = isB64
      ? `data:image/png;base64,${editedImageUrl}`
      : editedImageUrl;

    return new Response(
      JSON.stringify({
        success: true,
        editedImage,
        revisedPrompt: data.data?.[0]?.revised_prompt ?? "",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("edit-image-mask error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
