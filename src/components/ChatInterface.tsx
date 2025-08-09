import { useState, useEffect } from 'react';
import { NavigationBar } from './NavigationBar';
import { ChatArea } from './ChatArea';
import { ActionPanel } from './ActionPanel';
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
  date: string;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
}

export const ChatInterface = () => {
  const [activeNavItem, setActiveNavItem] = useState('chats');
  const [actions, setActions] = useState<ActionCard[]>([]);

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
    
    try {
      const response = await fetch('https://n8n-n8n.ascl7r.easypanel.host/webhook/7d06f022-1e56-4dad-ba4c-3684d9ee5562', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message,
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

  const handleExecuteAction = async (actionId: string) => {
    try {
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

  return (
    <div className="min-h-screen bg-background flex">
      <NavigationBar 
        activeItem={activeNavItem}
        onItemClick={setActiveNavItem}
      />
      
      <ChatArea onSendMessage={handleSendMessage} />
      
      <ActionPanel
        actions={actions}
        onExecute={handleExecuteAction}
        onEdit={handleEditAction}
        onIgnore={handleIgnoreAction}
      />
    </div>
  );
};