import { useState, useEffect, useCallback } from 'react';
import { ChatArea } from './ChatArea';
import { ActionPanel } from './ActionPanel';
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
  profile_photo_url?: string;
}

export const ChatInterface = () => {
  const [activeNavItem, setActiveNavItem] = useState('chats');
  const [actions, setActions] = useState<ActionCard[]>([]);
  const [contentIdeasCount, setContentIdeasCount] = useState(0);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionCard | null>(null);
  const [actionsLoading, setActionsLoading] = useState(false);

  // Load client from localStorage on initialization  
  useEffect(() => {
    const savedClientId = localStorage.getItem('selectedClientId');
    if (savedClientId) {
      console.log('ChatInterface - Restoring client from localStorage:', savedClientId);
      loadClientFromDatabase(savedClientId);
    }
  }, []);

  // Listen for profile changes from ProfileSelector
  useEffect(() => {
    const handleProfileChange = (event: CustomEvent) => {
      const client = event.detail;
      console.log('ChatInterface - Profile changed:', client);
      setSelectedClient(client);
      loadChatHistory(client.id);
      fetchActions();
    };

    window.addEventListener('profileChanged', handleProfileChange as EventListener);

    return () => {
      window.removeEventListener('profileChanged', handleProfileChange as EventListener);
    };
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

  // Load chat history when selectedClient changes
  useEffect(() => {
    if (selectedClient) {
      loadChatHistory(selectedClient.id);
      fetchActions();
    }
  }, [selectedClient]);

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
          const actionCard: ActionCard = {
            id: newAction.id,
            title: newAction.title,
            description: newAction.description,
            briefing: newAction.briefing,
            date: newAction.date,
            priority: newAction.priority as 'high' | 'medium' | 'low',
            category: newAction.category
          };
          
          setActions(prev => [actionCard, ...prev]);
          
          // Add notification to chat always when a new action is created
          console.log('Adding card notification:', actionCard);
          console.log('addCardNotification function available:', typeof (window as any).addCardNotification);
          
          if ((window as any).addCardNotification) {
            (window as any).addCardNotification(actionCard);
          } else {
            console.warn('addCardNotification function not available on window');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchActions = async () => {
    if (!selectedClient) {
      setActions([]);
      setContentIdeasCount(0);
      return;
    }

    setActionsLoading(true);
    try {
      const { data, error } = await supabase
        .from('actions')
        .select('*')
        .eq('status', 'pending')
        .eq('client_id', selectedClient.id)
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

      // Fetch content ideas count for selected client
      const { data: contentIdeasData, error: contentError } = await supabase
        .from('content_ideas')
        .select('id')
        .eq('client_id', selectedClient.id)
        .eq('status', 'pending');

      if (!contentError) {
        setContentIdeasCount(contentIdeasData?.length || 0);
      }
    } catch (error) {
      console.error('Failed to fetch actions:', error);
      setActions([]);
      setContentIdeasCount(0);
    } finally {
      setActionsLoading(false);
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
      // Get current user - for now we'll handle the case where auth isn't implemented yet
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          client_id: clientId,
          content,
          sender,
          user_id: user?.id // This will be null if user isn't authenticated
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

  const handleClientSelect = useCallback((client: Client) => {
    setSelectedClient(client);
    localStorage.setItem('selectedClientId', client.id);
    loadChatHistory(client.id);
    fetchActions(); // Refresh actions and content ideas count
  }, []);

  const handleExitChat = () => {
    setSelectedClient(null);
    localStorage.removeItem('selectedClientId');
    setChatHistory([]);
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

      setChatHistory([]);
      (window as any).clearChat?.();
      console.log('Chat history cleared for client:', selectedClient.id);
    } catch (error) {
      console.error('Failed to clear chat history:', error);
    }
  };

  const saveActionToHistory = async (action: ActionCard, actionType: 'executed' | 'ignored') => {
    if (!selectedClient) return;

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
          client_id: selectedClient.id,
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

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <div className="flex-1 min-w-0 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 min-w-0 h-full overflow-hidden">
          <ChatArea 
            onSendMessage={handleSendMessage}
            selectedClient={selectedClient}
            onExitChat={handleExitChat}
            onClearHistory={handleClearChatHistory}
            onViewCard={handleViewAction}
            onClientSelect={handleClientSelect}
            activeNavItem={activeNavItem}
            onNavItemClick={setActiveNavItem}
          />
        </div>
        
        {/* Desktop Action Panel */}
        <div className="hidden lg:block w-80 flex-shrink-0 h-full overflow-hidden">
          <ActionPanel
            actions={actions}
            contentIdeasCount={contentIdeasCount}
            loading={actionsLoading}
            onExecute={handleExecuteAction}
            onEdit={handleEditAction}
            onIgnore={handleIgnoreAction}
            onView={handleViewAction}
          />
        </div>
      </div>
      
      {/* Mobile Action Panel - Shows as overlay when needed */}
      <div className="lg:hidden">
        {activeNavItem === 'actions' && (
          <div className="absolute inset-0 z-50 bg-background">
            <ActionPanel
              actions={actions}
              contentIdeasCount={contentIdeasCount}
              loading={actionsLoading}
              onExecute={handleExecuteAction}
              onEdit={handleEditAction}
              onIgnore={handleIgnoreAction}
              onView={handleViewAction}
              onBack={() => setActiveNavItem('chats')}
            />
          </div>
        )}
      </div>
      
      <ActionViewDialog
        action={selectedAction}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </div>
  );
};