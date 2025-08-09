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
          userId: 'user-' + Date.now()
        })
      });
      
      if (response.ok) {
        const responseText = await response.text();
        console.log('Raw n8n response:', responseText);
        
        if (responseText.trim()) {
          try {
            const data = JSON.parse(responseText);
            
            // Add AI response to chat
            if (data.response || data.message) {
              (window as any).addAIResponse?.(data.response || data.message);
            }
            
            // Add actions if provided
            if (data.actions && Array.isArray(data.actions)) {
              setActions(prev => [...data.actions, ...prev]);
            }
            
            console.log('Parsed n8n response:', data);
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