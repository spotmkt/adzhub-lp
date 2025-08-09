import { useState, useEffect } from 'react';
import { NavigationBar } from './NavigationBar';
import { ChatArea } from './ChatArea';
import { ActionPanel } from './ActionPanel';
import { ClientSelector } from './ClientSelector';
import { ActionViewDialog } from './ActionViewDialog';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ActionCard {
  id: string;
  title: string;
  description: string;
  briefing?: string;
  date: string;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
}

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export const ChatInterface = () => {
  const [activeNavItem, setActiveNavItem] = useState('chats');
  const [actions, setActions] = useState<ActionCard[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionCard | null>(null);

  // Fetch actions from Supabase
  useEffect(() => {
    fetchActions();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('actions-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'actions'
        },
        (payload) => {
          console.log('New action received:', payload);
          const newAction = payload.new as any;
          setActions(prev => [{
            id: newAction.id,
            title: newAction.title,
            description: newAction.description,
            briefing: newAction.briefing,
            date: newAction.date,
            priority: newAction.priority as 'high' | 'medium' | 'low',
            category: newAction.category
          }, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchActions = async () => {
    try {
      const { data, error } = await supabase
        .from('actions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching actions:', error);
        return;
      }

      const formattedActions = data.map(action => ({
        id: action.id,
        title: action.title,
        description: action.description,
        briefing: action.briefing,
        date: action.date,
        priority: action.priority as 'high' | 'medium' | 'low',
        category: action.category
      }));

      setActions(formattedActions);
    } catch (error) {
      console.error('Failed to fetch actions:', error);
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
        console.log('Raw n8n response:', responseText);
        
        if (responseText.trim()) {
          try {
            const data = JSON.parse(responseText);
            console.log('Parsed n8n response:', data);
            
            // Add AI response to chat
            if (data.response || data.message || data.output) {
              const aiMessage = data.response || data.message || data.output;
              console.log('Adding AI response:', aiMessage);
              console.log('addAIResponse function exists:', typeof (window as any).addAIResponse);
              (window as any).addAIResponse?.(aiMessage);
              
              // Save AI response to database
              if (selectedClient) {
                await saveMessageToHistory(selectedClient.id, aiMessage, 'ai');
              }
            } else {
              console.log('No response field found in data:', Object.keys(data));
              (window as any).addAIResponse?.('Recebi sua mensagem.');
            }
            
            // Add actions if provided
            if (data.actions && Array.isArray(data.actions)) {
              setActions(prev => [...data.actions, ...prev]);
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
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          client_id: clientId,
          content,
          sender
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

      setChatHistory(messages);
      
      // Set messages in ChatArea
      (window as any).setChatHistory?.(messages);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    loadChatHistory(client.id);
  };

  const handleExitChat = () => {
    setSelectedClient(null);
    setChatHistory([]);
    (window as any).clearChat?.();
  };

  const saveActionToHistory = async (action: ActionCard, actionType: 'executed' | 'ignored') => {
    try {
      const { error } = await supabase
        .from('action_history')
        .insert({
          action_id: action.id,
          action_type: actionType,
          title: action.title,
          description: action.description,
          briefing: action.briefing,
          category: action.category,
          priority: action.priority,
          original_date: action.date,
        });

      if (error) {
        console.error('Error saving to history:', error);
      }
    } catch (error) {
      console.error('Failed to save to history:', error);
    }
  };

  const handleExecuteAction = async (actionId: string) => {
    try {
      const action = actions.find(a => a.id === actionId);
      if (!action) return;

      // Save to history before removing from actions
      await saveActionToHistory(action, 'executed');

      const { error } = await supabase
        .from('actions')
        .update({ status: 'executed' })
        .eq('id', actionId);

      if (error) {
        console.error('Error executing action:', error);
        return;
      }

      setActions(prev => prev.filter(action => action.id !== actionId));
      console.log('Action executed:', actionId);
    } catch (error) {
      console.error('Failed to execute action:', error);
    }
  };

  const handleEditAction = (actionId: string) => {
    console.log('Editing action:', actionId);
    // TODO: Implement action editing logic
  };

  const handleIgnoreAction = async (actionId: string) => {
    try {
      const action = actions.find(a => a.id === actionId);
      if (!action) return;

      // Save to history before removing from actions
      await saveActionToHistory(action, 'ignored');

      const { error } = await supabase
        .from('actions')
        .update({ status: 'ignored' })
        .eq('id', actionId);

      if (error) {
        console.error('Error ignoring action:', error);
        return;
      }

      setActions(prev => prev.filter(action => action.id !== actionId));
      console.log('Action ignored:', actionId);
    } catch (error) {
      console.error('Failed to ignore action:', error);
    }
  };

  const handleViewAction = (actionId: string) => {
    const action = actions.find(a => a.id === actionId);
    if (action) {
      setSelectedAction(action);
      setViewDialogOpen(true);
    }
  };

  // Show client selector if no client is selected
  if (!selectedClient) {
    return <ClientSelector onClientSelect={handleClientSelect} />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <NavigationBar 
        activeItem={activeNavItem}
        onItemClick={setActiveNavItem}
      />
      
      <ChatArea 
        onSendMessage={handleSendMessage} 
        selectedClient={selectedClient}
        onExitChat={handleExitChat}
      />
      
      <ActionPanel
        actions={actions}
        onExecute={handleExecuteAction}
        onEdit={handleEditAction}
        onIgnore={handleIgnoreAction}
        onView={handleViewAction}
      />
      
      <ActionViewDialog
        action={selectedAction}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </div>
  );
};