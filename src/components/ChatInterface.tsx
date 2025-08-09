import { useState } from 'react';
import { NavigationBar } from './NavigationBar';
import { ChatArea } from './ChatArea';
import { ActionPanel } from './ActionPanel';

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

  const handleSendMessage = async (message: string, messageData: Message) => {
    console.log('Sending message to n8n:', message);
    
    try {
      const response = await fetch('https://n8n-n8n.ascl7r.easypanel.host/webhook/7d06f022-1e56-4dad-ba4c-3684d9ee5562', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message,
          timestamp: new Date().toISOString(),
          userId: 'user-' + Date.now() // You can replace with actual user ID if you have authentication
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Check if n8n returned actions array
        if (data.actions && Array.isArray(data.actions)) {
          setActions(prev => [...data.actions, ...prev]);
        }
        
        console.log('n8n response:', data);
      } else {
        console.error('Error from n8n:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to send message to n8n:', error);
      
      // Fallback to mock data if n8n is unavailable
      const mockActions: ActionCard[] = [
        {
          id: Date.now().toString(),
          title: 'Erro de conexão - Ação de exemplo',
          description: 'Esta é uma ação de exemplo pois não foi possível conectar com o n8n.',
          date: new Date().toLocaleDateString('pt-BR'),
          priority: 'high',
          category: 'Sistema'
        }
      ];
      
      setActions(prev => [...mockActions, ...prev]);
    }
  };

  const handleExecuteAction = (actionId: string) => {
    console.log('Executing action:', actionId);
    // Implement action execution logic
  };

  const handleEditAction = (actionId: string) => {
    console.log('Editing action:', actionId);
    // Implement action editing logic
  };

  const handleIgnoreAction = (actionId: string) => {
    console.log('Ignoring action:', actionId);
    setActions(prev => prev.filter(action => action.id !== actionId));
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