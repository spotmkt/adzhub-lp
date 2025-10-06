-- Insert default configuration for Image Editor app
INSERT INTO app_configurations (app_id, app_name, user_id, input_form, output_template)
SELECT 
  10,
  'Editor de Imagens',
  auth.uid(),
  '[
    {
      "id": "image",
      "label": "Imagem",
      "type": "file",
      "required": true,
      "placeholder": "Selecione uma imagem para editar"
    },
    {
      "id": "prompt",
      "label": "Prompt de Edição",
      "type": "textarea",
      "required": true,
      "placeholder": "Descreva como você quer editar a imagem (ex: adicione um pôr do sol, remova o fundo, estilo aquarela)"
    }
  ]'::jsonb,
  '{
    "template": "Exibir comparação antes/depois da imagem com botões de download e gerar outra edição"
  }'::jsonb
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;