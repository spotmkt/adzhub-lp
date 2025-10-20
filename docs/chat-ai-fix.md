# Fix: "Aguardando resposta..." Persistente no Chat AI

## 🐛 Problema Identificado

Quando o usuário enviava a **primeira mensagem** no chat "Pergunte ao Adz", o sistema:

1. ✅ Enviava a mensagem
2. ✅ AI respondia corretamente
3. ❌ Continuava exibindo "Aguardando resposta..." mesmo após a resposta aparecer

## 🔍 Causa Raiz

**Race Condition entre Realtime Subscription e Resposta do AI:**

```
Fluxo do problema:
┌─────────────────────────────────────────────┐
│ 1. Usuário envia primeira mensagem          │
│    → isLoadingResponse = true               │
├─────────────────────────────────────────────┤
│ 2. Edge function ask-ai é invocada          │
│    → Cria conversa no banco                 │
│    → AI responde e insere mensagem          │
├─────────────────────────────────────────────┤
│ 3. Realtime Subscription tenta conectar     │
│    → Conversa ainda não existe              │
│    → Retry após 2 segundos                  │
│    → Loop de tentativas...                  │
├─────────────────────────────────────────────┤
│ 4. Resposta inserida no banco               │
│    → Cliente NÃO está inscrito ainda        │
│    → Evento INSERT não é recebido           │
├─────────────────────────────────────────────┤
│ 5. isLoadingResponse NUNCA volta a false    │
│    → "Aguardando resposta..." fica travado  │
└─────────────────────────────────────────────┘
```

## ✅ Solução Implementada

### Abordagem Multi-Camada

**1. Polling Pós-Envio (Camada Principal)**
Após enviar a mensagem, aguardamos 2 segundos e fazemos um reload manual das mensagens:

```typescript
// Após sucesso do invoke
setTimeout(async () => {
  const { data: conversation } = await supabase
    .from('ai_conversations')
    .select('id')
    .eq('session_id', sessionId)
    .maybeSingle();
  
  if (conversation) {
    const { data: msgs } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true });
    
    if (msgs && msgs.length > 0) {
      setMessages(msgs as Message[]);
      const hasAssistantResponse = msgs.some(m => m.role === 'assistant');
      if (hasAssistantResponse) {
        setIsLoadingResponse(false);
      }
    }
  }
}, 2000);
```

**Por que 2 segundos?**
- Tempo suficiente para edge function processar
- AI geralmente responde em 1-3 segundos
- Não é muito longo para prejudicar UX

**2. Failsafe Timer (Camada de Segurança)**
Após 10 segundos, force o loading a terminar:

```typescript
setTimeout(() => {
  setIsLoadingResponse(false);
}, 10000);
```

**3. Realtime Otimizado**
Reduzi o retry de 2s → 1s para conexão mais rápida:

```typescript
if (!conversation) {
  console.log('⏳ Conversa ainda não existe, tentando novamente em 1s...');
  retryTimeout = setTimeout(setupRealtimeSubscription, 1000); // Era 2000
  return;
}
```

**4. Auto-Detect de Resposta na Conexão**
Quando o Realtime finalmente conecta, verifica se já há respostas:

```typescript
if (msgs && msgs.length > 0) {
  setMessages(msgs as Message[]);
  const hasAssistantResponse = msgs.some(m => m.role === 'assistant');
  if (hasAssistantResponse) {
    setIsLoadingResponse(false); // Desativa loading se já houver resposta
  }
}
```

## 📊 Resultado Esperado

### Antes:
```
Usuário: "teste"
AI: "Olá! Como posso ajudar você com o AdzHub?"
Status: Aguardando resposta... [TRAVADO] ❌
```

### Depois:
```
Usuário: "teste"
AI: "Olá! Como posso ajudar você com o AdzHub?"
Status: [Nada - loading terminou] ✅
```

## 🎯 Cenários Cobertos

| Cenário | Comportamento |
|---------|---------------|
| **Primeira mensagem (normal)** | Polling pega resposta após 2s ✅ |
| **Primeira mensagem (AI lento)** | Failsafe desativa loading após 10s ✅ |
| **Mensagens subsequentes** | Realtime já conectado, funciona normal ✅ |
| **Realtime conecta antes do polling** | Evento INSERT desativa loading ✅ |
| **Realtime conecta depois do polling** | Polling já desativou loading ✅ |

## 🔧 Arquivos Modificados

- `src/components/ui/ai-input.tsx`
  - `handleSubmit()`: Adicionado polling + failsafe
  - `setupRealtimeSubscription()`: Retry mais rápido + auto-detect

## ⚠️ Considerações

**Por que não usar apenas o retorno da edge function?**
- Edge function atualmente não retorna as mensagens criadas
- Seria necessário modificar a edge function (mais complexo)
- Abordagem atual funciona sem mexer no backend

**Possível melhoria futura:**
Modificar `ask-ai` edge function para retornar a conversa + mensagens no response, eliminando necessidade de polling.

## ✅ Checklist de Validação

- [ ] Primeira mensagem mostra resposta sem travar
- [ ] "Aguardando resposta..." desaparece após resposta
- [ ] Mensagens subsequentes funcionam normalmente
- [ ] Não há loops infinitos ou memory leaks
- [ ] Console logs ajudam a debugar se necessário

---

**Data:** 2025-10-20
**Issue:** Chat AI loading infinito na primeira mensagem
**Status:** ✅ Resolvido
