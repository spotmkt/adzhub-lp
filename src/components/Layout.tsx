import { useState, useEffect } from 'react';
import { NavigationBar } from './NavigationBar';
import { ActionPanel } from './ActionPanel';
import { supabase } from '@/integrations/supabase/client';

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

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [activeNavItem, setActiveNavItem] = useState('chats');
  const [actions, setActions] = useState<ActionCard[]>([]);
  const [contentIdeasCount, setContentIdeasCount] = useState(0);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Load client from localStorage on initialization
  useEffect(() => {
    const savedClientId = localStorage.getItem('selectedClientId');
    if (savedClientId) {
      console.log('Restoring client from localStorage:', savedClientId);
      const restoredClient: Client = {
        id: savedClientId,
        name: savedClientId,
      };
      setSelectedClient(restoredClient);
    }
  }, []);

  // Fetch actions and content ideas count
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
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Update actions and content ideas when client changes
  useEffect(() => {
    if (selectedClient) {
      fetchActions();
    }
  }, [selectedClient]);

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

      // Fetch content ideas count for selected client
      if (selectedClient) {
        const { data: contentIdeasData, error: contentError } = await supabase
          .from('content_ideas')
          .select('id')
          .eq('client_id', selectedClient.id)
          .eq('status', 'pending');

        if (!contentError) {
          setContentIdeasCount(contentIdeasData?.length || 0);
        }
      }
    } catch (error) {
      console.error('Failed to fetch actions:', error);
    }
  };

  const handleExecuteAction = async (actionId: string) => {
    try {
      const { error } = await supabase
        .from('actions')
        .update({ status: 'executed' })
        .eq('id', actionId);

      if (error) throw error;

      setActions(prev => prev.filter(action => action.id !== actionId));
    } catch (error) {
      console.error('Error executing action:', error);
    }
  };

  const handleIgnoreAction = async (actionId: string) => {
    try {
      const { error } = await supabase
        .from('actions')
        .update({ status: 'ignored' })
        .eq('id', actionId);

      if (error) throw error;

      setActions(prev => prev.filter(action => action.id !== actionId));
    } catch (error) {
      console.error('Error ignoring action:', error);
    }
  };

  const handleViewAction = (actionId: string) => {
    console.log('View action:', actionId);
  };

  // Update active nav item based on current route
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/') setActiveNavItem('chats');
    else if (path === '/history') setActiveNavItem('history');
    else if (path === '/content') setActiveNavItem('content');
    else if (path === '/settings') setActiveNavItem('settings');
  }, []);

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <NavigationBar 
          activeItem={activeNavItem}
          onItemClick={setActiveNavItem}
          onClientSelect={(client) => {
            setSelectedClient(client);
            fetchActions();
          }}
        />
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col md:flex-row">
        <div className="flex-1 min-w-0">
          {children}
        </div>
        
        {/* Desktop Action Panel */}
        <div className="hidden lg:block w-80 flex-shrink-0 h-screen overflow-hidden">
          <ActionPanel
            actions={actions}
            contentIdeasCount={contentIdeasCount}
            onExecute={handleExecuteAction}
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
              onExecute={handleExecuteAction}
              onIgnore={handleIgnoreAction}
              onView={handleViewAction}
              onBack={() => setActiveNavItem('chats')}
            />
          </div>
        )}
      </div>
    </div>
  );
};