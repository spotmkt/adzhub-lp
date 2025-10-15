# Workflow n8n - Processamento de Bases de Contatos

## 📋 Visão Geral

Este workflow processa bases de contatos de forma assíncrona, permitindo acompanhamento em tempo real do progresso através de atualizações no banco de dados Supabase.

### Arquitetura do Fluxo

```
Frontend Upload → Edge Function → n8n Webhook → Processamento em Batches → Supabase
                       ↓
                 Job Status Table (atualizações em tempo real)
```

---

## 🎯 Objetivos do Workflow

1. **Receber** o payload do Edge Function `enqueue-contacts-processing`
2. **Atualizar** o status inicial do job para "processing"
3. **Processar** contatos em batches de 100
4. **Criar** a lista de contatos no primeiro batch
5. **Inserir** contatos no banco de dados
6. **Atualizar** o progresso após cada batch
7. **Finalizar** o job com status "completed" ou "failed"

---

## 📦 Payload do Webhook

O n8n receberá o seguinte payload da Edge Function:

```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "550e8400-e29b-41d4-a716-446655440001",
  "fileName": "base_contatos.csv",
  "identifierType": "phone",
  "identifierColumn": "telefone",
  "metadataColumns": ["nome", "email", "cidade"],
  "totalContacts": 1000,
  "contacts": [
    {
      "telefone": "5511999999999",
      "nome": "João Silva",
      "email": "joao@example.com",
      "cidade": "São Paulo"
    }
    // ... mais 999 contatos
  ],
  "supabaseUrl": "https://xciubsogktecqcgafwaa.supabase.co",
  "supabaseKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> **⚠️ Importante**: O array `contacts` já vem **pré-filtrado** do frontend, contendo apenas contatos válidos (sem linhas vazias). O campo `totalContacts` reflete a quantidade real de contatos válidos a serem processados. **Não é necessário filtrar linhas vazias no n8n**.

---

## 🔧 Estrutura do Workflow

### Diagrama de Fluxo

```
┌─────────────────┐
│ Webhook Trigger │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ Update Job Status: Processing│
└────────┬────────────────────┘
         │
         ▼
┌───────────────────────┐
│ Split In Batches (100)│
└────────┬──────────────┘
         │
         ▼
    ┌────────────────────────┐
    │  Loop de Processamento │
    │                        │
    │  ┌──────────────────┐  │
    │  │ Prepare Batch    │  │
    │  └────────┬─────────┘  │
    │           │            │
    │           ▼            │
    │  ┌──────────────────┐  │
    │  │ Create List (1st)│  │
    │  └────────┬─────────┘  │
    │           │            │
    │           ▼            │
    │  ┌──────────────────┐  │
    │  │ Insert Contacts  │  │
    │  └────────┬─────────┘  │
    │           │            │
    │           ▼            │
    │  ┌──────────────────┐  │
    │  │ Update Progress  │  │
    │  └──────────────────┘  │
    └────────────────────────┘
         │
         ▼
┌──────────────────────┐
│ Finalize Job Status  │
└──────────────────────┘
         │
         ▼
┌──────────────────┐
│ Error Handler    │
│ (if any failure) │
└──────────────────┘
```

---

## 🛠️ Configuração dos Nodes

### Node 1: Webhook Trigger

**Tipo:** `Webhook`

**Configuração:**
- **HTTP Method:** `POST`
- **Path:** `/contacts-processing` (ou qualquer path de sua escolha)
- **Authentication:** `None` (ou configure conforme necessário)
- **Response Mode:** `Immediately`

**Importante:** 
- Copie a URL do webhook gerada pelo n8n
- Configure esta URL na secret `BASE_PROCESSING` no Supabase

---

### Node 2: Update Job Status - Processing

**Tipo:** `HTTP Request`

**Configuração:**
```javascript
Method: PATCH
URL: {{$json.supabaseUrl}}/rest/v1/contact_upload_jobs

Headers:
  apikey: {{$json.supabaseKey}}
  Authorization: Bearer {{$json.supabaseKey}}
  Content-Type: application/json
  Prefer: return=representation

Query Parameters:
  id=eq.{{$json.jobId}}

Body (JSON):
{
  "status": "processing",
  "processed_contacts": 0,
  "updated_at": "{{$now.toISOString()}}"
}
```

**Objetivo:** Marcar o job como "em processamento" e resetar o contador.

---

### Node 3: Split In Batches

**Tipo:** `Split In Batches`

**Configuração:**
- **Batch Size:** `100`
- **Options:**
  - Reset: `true`
  - Input Field Name: `contacts`

**Objetivo:** Dividir o array de contatos em lotes de 100 para processamento incremental.

---

### Node 4: Prepare Batch Data

**Tipo:** `Code` (JavaScript)

**Código:**
```javascript
// Acessar dados do batch atual
const allItems = $input.all();
const item = allItems[0].json;
const currentBatch = $node["Split In Batches"].context["currentRunIndex"];
const isFirstBatch = currentBatch === 0;

// Processar os contatos do batch
const batchContacts = item.contacts;
const identifierColumn = item.identifierColumn;
const metadataColumns = item.metadataColumns;

// Normalizar contatos para o formato do banco
// NOTA: Não é necessário filtrar linhas vazias aqui, pois já vêm filtradas do frontend
const normalizedContacts = batchContacts.map(contact => {
  // Montar objeto de metadata
  const metadata = {};
  metadataColumns.forEach(col => {
    if (contact[col] !== undefined && contact[col] !== null && contact[col] !== '') {
      metadata[col] = contact[col];
    }
  });

  return {
    identifier: contact[identifierColumn]?.toString().trim(),
    metadata: metadata
  };
});

// Calcular progresso
const processedCount = (currentBatch + 1) * 100;
const totalContacts = item.totalContacts;
const actualProcessed = Math.min(processedCount, totalContacts);

// Retornar dados preparados
return [{
  json: {
    // Dados originais necessários
    jobId: item.jobId,
    userId: item.userId,
    fileName: item.fileName,
    identifierType: item.identifierType,
    identifierColumn: item.identifierColumn,
    metadataColumns: item.metadataColumns,
    supabaseUrl: item.supabaseUrl,
    supabaseKey: item.supabaseKey,
    
    // Dados do batch
    contacts: normalizedContacts,
    isFirstBatch: isFirstBatch,
    processedCount: actualProcessed,
    totalContacts: totalContacts,
    currentBatch: currentBatch,
    
    // Para criar a lista (apenas no primeiro batch)
    listId: item.listId || null
  }
}];
```

**Objetivo:** Normalizar dados do batch e preparar para inserção.

> **💡 Nota**: A filtragem de linhas vazias foi removida deste node pois agora é feita no frontend antes de enviar ao n8n.

---

### Node 5: Create Contact List (Conditional - Primeiro Batch Apenas)

**Tipo:** `HTTP Request`

**Configuração:**
```javascript
Method: POST
URL: {{$json.supabaseUrl}}/rest/v1/contact_lists

Headers:
  apikey: {{$json.supabaseKey}}
  Authorization: Bearer {{$json.supabaseKey}}
  Content-Type: application/json
  Prefer: return=representation

Execute Only If:
  {{$json.isFirstBatch}} === true

Body (JSON):
{
  "user_id": "{{$json.userId}}",
  "job_id": "{{$json.jobId}}",
  "list_name": "{{$json.fileName}}",
  "identifier_type": "{{$json.identifierType}}",
  "identifier_column": "{{$json.identifierColumn}}",
  "metadata_columns": {{$json.metadataColumns}},
  "total_contacts": {{$json.totalContacts}}
}
```

**Objetivo:** Criar registro da lista de contatos (somente no primeiro batch).

---

### Node 6: Set List ID

**Tipo:** `Set` (ou `Code`)

**Configuração:**
```javascript
// Se for o primeiro batch, pegar o ID da lista criada
if ($json.isFirstBatch && $('Create Contact List').item.json.id) {
  return [{
    json: {
      ...$json,
      listId: $('Create Contact List').item.json.id
    }
  }];
}

// Se não for o primeiro batch, manter o listId existente
return [$input.item];
```

**Objetivo:** Armazenar o ID da lista criada para usar nos próximos batches.

---

### Node 7: Insert Contacts Batch

**Tipo:** `HTTP Request`

**Configuração:**
```javascript
Method: POST
URL: {{$json.supabaseUrl}}/rest/v1/contacts

Headers:
  apikey: {{$json.supabaseKey}}
  Authorization: Bearer {{$json.supabaseKey}}
  Content-Type: application/json
  Prefer: resolution=merge-duplicates,return=minimal

Body (JSON):
{{
  $json.contacts.map(contact => ({
    list_id: $json.listId,
    identifier: contact.identifier,
    metadata: contact.metadata
  }))
}}
```

**⚠️ IMPORTANTE - Configuração do Campo `metadata`:**

O campo `metadata` no Supabase é do tipo `JSONB`, então é crucial que o n8n envie um **objeto JSON válido**, não uma string.

**✅ Configuração Correta no n8n:**
- No node "Insert Contacts Batch", ao mapear o campo `metadata`:
  - Use a expressão: `={{ $json.contacts.map(c => ({ ...c, metadata: c.metadata })) }}`
  - **OU** certifique-se de que o `Content-Type` está como `application/json`
  - O n8n deve automaticamente serializar o objeto metadata como JSON

**❌ Erros Comuns:**
- Se o metadata estiver sendo salvo como string (ex: `"Juliane,Rua...,blog"`), significa que o n8n está convertendo o objeto em string
- Solução: Garanta que o body está com expressão JavaScript (`{{ ... }}`) e não como string literal

**Objetivo:** Inserir os contatos do batch no banco de dados.

**Observações:**
- `Prefer: resolution=merge-duplicates` evita erros em duplicatas
- `return=minimal` reduz o payload de resposta

---

### Node 8: Update Job Progress

**Tipo:** `HTTP Request`

**Configuração:**
```javascript
Method: PATCH
URL: {{$json.supabaseUrl}}/rest/v1/contact_upload_jobs

Headers:
  apikey: {{$json.supabaseKey}}
  Authorization: Bearer {{$json.supabaseKey}}
  Content-Type: application/json
  Prefer: return=minimal

Query Parameters:
  id=eq.{{$json.jobId}}

Body (JSON):
{
  "processed_contacts": {{$json.processedCount}},
  "updated_at": "{{$now.toISOString()}}"
}
```

**Objetivo:** Atualizar o progresso do job no banco (dispara update realtime para o frontend).

---

### Node 9: Check If Last Batch

**Tipo:** `IF`

**Configuração:**
```javascript
Conditions:
  - {{$node["Split In Batches"].context["noItemsLeft"]}} === true
```

**Objetivo:** Verificar se todos os batches foram processados.

---

### Node 10: Finalize Job - Success

**Tipo:** `HTTP Request`

**Conectado a:** Saída `true` do Node 9

**Configuração:**
```javascript
Method: PATCH
URL: {{$json.supabaseUrl}}/rest/v1/contact_upload_jobs

Headers:
  apikey: {{$json.supabaseKey}}
  Authorization: Bearer {{$json.supabaseKey}}
  Content-Type: application/json
  Prefer: return=representation

Query Parameters:
  id=eq.{{$json.jobId}}

Body (JSON):
{
  "status": "completed",
  "processed_contacts": {{$json.totalContacts}},
  "completed_at": "{{$now.toISOString()}}",
  "updated_at": "{{$now.toISOString()}}"
}
```

**Objetivo:** Marcar o job como concluído com sucesso.

---

### Node 11: Error Trigger

**Tipo:** `Error Trigger`

**Configuração:**
- Conecte este node a **todos** os nodes que podem falhar
- Configure para capturar qualquer erro no workflow

---

### Node 12: Handle Error - Update Job Status

**Tipo:** `Code`

**Conectado a:** Error Trigger

**Código:**
```javascript
// Obter dados do erro
const errorData = $input.item.json;
const errorMessage = errorData.error?.message || 
                    errorData.message || 
                    'Erro desconhecido durante o processamento';

// Buscar dados originais (podem estar em diferentes contextos)
let jobId, supabaseUrl, supabaseKey;

try {
  // Tentar pegar dos dados anteriores
  const previousData = $('Webhook').item.json;
  jobId = previousData.jobId;
  supabaseUrl = previousData.supabaseUrl;
  supabaseKey = previousData.supabaseKey;
} catch (e) {
  console.error('Não foi possível recuperar dados do job:', e);
}

if (!jobId || !supabaseUrl || !supabaseKey) {
  throw new Error('Dados insuficientes para registrar erro do job');
}

return [{
  json: {
    jobId,
    supabaseUrl,
    supabaseKey,
    errorMessage: errorMessage.substring(0, 500), // Limitar tamanho
    timestamp: new Date().toISOString()
  }
}];
```

---

### Node 13: Update Job Status - Failed

**Tipo:** `HTTP Request`

**Conectado a:** Handle Error

**Configuração:**
```javascript
Method: PATCH
URL: {{$json.supabaseUrl}}/rest/v1/contact_upload_jobs

Headers:
  apikey: {{$json.supabaseKey}}
  Authorization: Bearer {{$json.supabaseKey}}
  Content-Type: application/json
  Prefer: return=minimal

Query Parameters:
  id=eq.{{$json.jobId}}

Body (JSON):
{
  "status": "failed",
  "error_message": "{{$json.errorMessage}}",
  "completed_at": "{{$json.timestamp}}",
  "updated_at": "{{$json.timestamp}}"
}
```

**Objetivo:** Registrar a falha no banco de dados para informar o usuário.

---

## 📊 Variáveis e Contexto

### Variáveis Globais do Workflow

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `jobId` | UUID | ID único do job de processamento |
| `userId` | UUID | ID do usuário que fez o upload |
| `listId` | UUID | ID da lista criada (após primeiro batch) |
| `supabaseUrl` | String | URL base do Supabase |
| `supabaseKey` | String | Chave de API do Supabase |

### Contexto do Split In Batches

| Propriedade | Descrição |
|-------------|-----------|
| `currentRunIndex` | Índice do batch atual (0, 1, 2...) |
| `noItemsLeft` | `true` quando é o último batch |

---

## 🔍 Logs e Monitoramento

### Pontos Críticos para Logging

Adicione logs nos seguintes pontos:

1. **Início do processamento**
```javascript
console.log(`[JOB ${jobId}] Iniciando processamento de ${totalContacts} contatos`);
```

2. **Cada batch processado**
```javascript
console.log(`[JOB ${jobId}] Batch ${currentBatch + 1} processado: ${processedCount}/${totalContacts}`);
```

3. **Criação da lista**
```javascript
console.log(`[JOB ${jobId}] Lista criada com ID: ${listId}`);
```

4. **Erros**
```javascript
console.error(`[JOB ${jobId}] ERRO: ${errorMessage}`);
```

5. **Finalização**
```javascript
console.log(`[JOB ${jobId}] Processamento concluído com sucesso`);
```

---

## ⚠️ Tratamento de Erros

### Cenários de Erro Comum

| Erro | Causa | Solução |
|------|-------|---------|
| `401 Unauthorized` | Chave Supabase inválida | Verificar secret `BASE_PROCESSING` |
| `404 Not Found` | URL Supabase incorreta | Verificar payload do webhook |
| `409 Conflict` | Duplicatas na inserção | Usar `Prefer: resolution=merge-duplicates` |
| `500 Server Error` | Problema no Supabase | Retry automático ou marcar como failed |
| `Timeout` | Batch muito grande | Reduzir tamanho do batch |

### Estratégia de Retry

Configure retry em nodes HTTP críticos:

```javascript
// Em HTTP Request nodes
Retry On Fail: true
Max Tries: 3
Wait Between Tries: 2000 (2 segundos)
```

---

## 📈 Performance e Otimização

### Recomendações

1. **Tamanho do Batch**
   - **Ideal:** 100 contatos
   - **Ajustar para:** 50-200 dependendo do tamanho dos metadados

2. **Timeout**
   - Configure timeout de 5 minutos por batch
   - Para bases muito grandes, considere aumentar

3. **Concorrência**
   - Processar 1 batch por vez (sequencial)
   - Evita sobrecarga no banco

4. **Memory**
   - Para bases > 10.000 contatos, considere chunking adicional

---

## 🧪 Testes

### Teste 1: Base Pequena (10 contatos)

**Payload de Teste:**
```json
{
  "jobId": "test-job-001",
  "userId": "test-user-001",
  "fileName": "teste_10_contatos.csv",
  "identifierType": "phone",
  "identifierColumn": "telefone",
  "metadataColumns": ["nome"],
  "totalContacts": 10,
  "contacts": [
    {"telefone": "11999999901", "nome": "Teste 1"},
    {"telefone": "11999999902", "nome": "Teste 2"}
    // ... até 10
  ],
  "supabaseUrl": "https://xciubsogktecqcgafwaa.supabase.co",
  "supabaseKey": "sua-chave-aqui"
}
```

**Resultado Esperado:**
- 1 batch processado
- Status: "completed"
- 10 contatos inseridos

---

### Teste 2: Base Média (500 contatos)

**Resultado Esperado:**
- 5 batches processados
- Progresso atualizado 5 vezes (100, 200, 300, 400, 500)
- Status final: "completed"

---

### Teste 3: Duplicatas

**Cenário:** Enviar a mesma base duas vezes

**Resultado Esperado:**
- Segunda execução deve atualizar contatos existentes (merge)
- Sem erros de constraint

---

### Teste 4: Erro Simulado

**Cenário:** Usar chave Supabase inválida

**Resultado Esperado:**
- Error trigger ativado
- Status atualizado para "failed"
- Error message preenchida

---

## 📝 Checklist de Implementação

- [ ] Criar workflow no n8n
- [ ] Configurar webhook trigger
- [ ] Adicionar todos os 13 nodes
- [ ] Conectar nodes conforme diagrama
- [ ] Configurar headers e authentication
- [ ] Adicionar logs em pontos críticos
- [ ] Configurar error handling
- [ ] Configurar retry policies
- [ ] Testar com base pequena (10 contatos)
- [ ] Testar com base média (500 contatos)
- [ ] Testar cenário de erro
- [ ] Copiar URL do webhook
- [ ] Configurar secret `BASE_PROCESSING` no Supabase
- [ ] Testar integração completa (Frontend → Edge Function → n8n → Supabase)
- [ ] Verificar updates em tempo real no frontend
- [ ] Documentar URL do webhook para o time

---

## 🔗 Recursos Adicionais

### Links Úteis

- [n8n Documentation](https://docs.n8n.io/)
- [Supabase REST API](https://supabase.com/docs/guides/api)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)

### Suporte

Em caso de problemas:
1. Verificar logs do n8n
2. Verificar logs da Edge Function
3. Consultar tabela `contact_upload_jobs` no Supabase
4. Verificar políticas RLS das tabelas envolvidas

---

## 📄 Apêndice A: Tabelas Supabase Envolvidas

### contact_upload_jobs
```sql
- id: uuid (PK)
- user_id: uuid
- file_name: text
- identifier_type: text
- identifier_column: text
- metadata_columns: jsonb
- total_contacts: integer
- processed_contacts: integer
- status: text (queued|processing|completed|failed)
- error_message: text
- lgpd_consent: boolean
- data_usage_consent: boolean
- created_at: timestamptz
- updated_at: timestamptz
- completed_at: timestamptz
```

### contact_lists
```sql
- id: uuid (PK)
- user_id: uuid
- job_id: uuid (FK)
- list_name: text
- identifier_type: text
- identifier_column: text
- metadata_columns: jsonb
- total_contacts: integer
- created_at: timestamptz
- updated_at: timestamptz
```

### contacts
```sql
- id: uuid (PK)
- list_id: uuid (FK)
- identifier: text
- metadata: jsonb
- created_at: timestamptz
```

---

## 📄 Apêndice B: Exemplo de Execução Completa

### Timeline de Processamento (1000 contatos)

```
[00:00.000] Webhook recebe payload
[00:00.050] Job status → "processing"
[00:00.100] Batch 1/10 iniciado (contatos 1-100)
[00:00.150] Lista criada: list-uuid-123
[00:00.200] 100 contatos inseridos
[00:00.250] Progresso atualizado: 100/1000 (10%)
[00:00.300] Batch 2/10 iniciado (contatos 101-200)
...
[00:02.500] Batch 10/10 finalizado (contatos 901-1000)
[00:02.550] Progresso atualizado: 1000/1000 (100%)
[00:02.600] Job status → "completed"
[00:02.650] Workflow finalizado ✓
```

**Tempo total:** ~2.6 segundos para 1000 contatos

---

**Versão:** 1.0  
**Última atualização:** 2025-01-15  
**Autor:** Equipe de Desenvolvimento
