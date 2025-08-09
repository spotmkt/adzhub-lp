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
    console.log('Sending message to API:', message);
    
    // Here you would typically call your API endpoint
    // const response = await fetch('/api/n8n-agent', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ message })
    // });
    
    // For now, simulate API response with mock data
    setTimeout(() => {
      const mockActions: ActionCard[] = [
        {
          id: Date.now().toString(),
          title: 'Criar mockup de interface',
          description: 'Desenvolver protótipo visual baseado nos requisitos mencionados.',
          date: new Date().toLocaleDateString('pt-BR'),
          priority: 'high',
          category: 'Design'
        },
        {
          id: (Date.now() + 1).toString(),
          title: 'Pesquisar referências',
          description: 'Buscar inspirações visuais para o projeto atual.',
          date: new Date().toLocaleDateString('pt-BR'),
          priority: 'medium',
          category: 'Pesquisa'
        }
      ];
      
      setActions(prev => [...mockActions, ...prev]);
    }, 1500);
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