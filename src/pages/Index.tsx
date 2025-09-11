import { ChatArea } from '@/components/ChatArea';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

const Index = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Load client from localStorage on initialization
  useEffect(() => {
    const savedClientId = localStorage.getItem('selectedClientId');
    if (savedClientId) {
      console.log('Restoring client from localStorage:', savedClientId);
      loadClientFromDatabase(savedClientId);
    }
  }, []);

  const loadClientFromDatabase = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (error) {
        console.error('Error loading client:', error);
        localStorage.removeItem('selectedClientId');
        return;
      }

      if (data) {
        const client: Client = {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone
        };
        setSelectedClient(client);
        loadChatHistory(client.id);
      }
    } catch (error) {
      console.error('Failed to load client from database:', error);
      localStorage.removeItem('selectedClientId');
    }
  };

  const handleSendMessage = async (message: string, messageData: Message) => {
    console.log('Sending message to n8n:', message);
    
    // Save user message to database
    if (selectedClient) {
      await saveMessageToHistory(selectedClient.id, message, 'user');
    }
    
    try {
      const response = await fetch('https://n8n-n8n.ascl7r.easypanel.host/webhook/7d06f022-1e56-4dad-ba4c-3684d9ee5562', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message,
          clientName: selectedClient?.name || 'Cliente não selecionado',
          clientId: selectedClient?.id || null,
          timestamp: new Date().toISOString(),
          userId: 'user-' + Date.now()
        })
      });
      
      if (response.ok) {
        const responseText = await response.text();
        console.log('Response from n8n:', responseText);
        
        if (responseText) {
          try {
            const data = JSON.parse(responseText);
            console.log('Parsed response:', data);
            
            // Add AI response to chat
            if (data.response) {
              (window as any).addAIResponse?.(data.response, data.audioUrl);
              
              // Save AI response to database
              if (selectedClient) {
                await saveMessageToHistory(selectedClient.id, data.response, 'ai');
              }
            }
            
          } catch (parseError) {
            console.error('Failed to parse n8n response as JSON:', parseError);
            (window as any).addAIResponse?.('Recebi sua mensagem, mas houve um erro no formato da resposta.');
          }
        } else {
          console.warn('Empty response from n8n');
          (window as any).addAIResponse?.('Mensagem recebida, mas sem resposta do servidor.');
        }
      } else {
        console.error('Error from n8n:', response.status, response.statusText);
        (window as any).addAIResponse?.('Erro ao processar sua solicitação. Tente novamente.');
      }
    } catch (error) {
      console.error('Failed to send message to n8n:', error);
      (window as any).addAIResponse?.('Erro de conexão com o servidor. Verifique sua conexão.');
    }
  };

  const saveMessageToHistory = async (clientId: string, content: string, sender: 'user' | 'ai') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          client_id: clientId,
          content,
          sender,
          user_id: user?.id
        });

      if (error) {
        console.error('Error saving message:', error);
      }
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  };

  const loadChatHistory = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('client_id', clientId)
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Error loading chat history:', error);
        return;
      }

      const messages: Message[] = data.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender: msg.sender as 'user' | 'ai',
        timestamp: new Date(msg.timestamp)
      }));

      setMessages(messages);
      (window as any).setChatHistory?.(messages);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    localStorage.setItem('selectedClientId', client.id);
    loadChatHistory(client.id);
  };

  const handleExitChat = () => {
    setSelectedClient(null);
    localStorage.removeItem('selectedClientId');
    setMessages([]);
    (window as any).clearChat?.();
  };

  const handleClearChatHistory = async () => {
    if (!selectedClient) return;
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('client_id', selectedClient.id);

      if (error) {
        console.error('Error clearing chat history:', error);
        return;
      }

      setMessages([]);
      (window as any).clearChat?.();
      console.log('Chat history cleared for client:', selectedClient.id);
    } catch (error) {
      console.error('Failed to clear chat history:', error);
    }
  };

  return (
    <ChatArea 
      onSendMessage={handleSendMessage}
      selectedClient={selectedClient}
      onExitChat={handleExitChat}
      onClearHistory={handleClearChatHistory}
      onClientSelect={handleClientSelect}
    />
  );
};

export default Index;