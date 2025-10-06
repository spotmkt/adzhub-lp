import { Settings, MessageSquare, LayoutGrid, Home, LogOut, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ProfileSelector } from '@/components/ProfileSelector';
import adzHubLogo from '@/assets/adzhub-logo-final.png';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NavigationBarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const navigationItems = [
  { id: 'home', icon: Home, label: 'Home', path: '/' },
  { id: 'chats', icon: MessageSquare, label: 'Chats', path: '/chat' },
  { id: 'tasks', icon: CheckSquare, label: 'Tarefas', path: '/tasks' },
  { id: 'apps', icon: LayoutGrid, label: 'Apps', path: '/apps' },
  { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
];

export const NavigationBar = ({ activeItem = 'home', onItemClick }: NavigationBarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: 'Logout realizado',
        description: 'Você foi desconectado com sucesso.',
      });
      
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: 'Erro ao deslogar',
        description: error.message || 'Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="w-16 h-full bg-nav-background border-r border-border flex flex-col items-center py-6 space-y-4">
      {/* Logo */}
      <div className="mb-4">
        <img 
          src={adzHubLogo} 
          alt="AdzHub" 
          className="w-10 h-10 object-contain"
        />
      </div>
      
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeItem === item.id;
        
        return (
          <Link key={item.id} to={item.path || '/'}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "w-12 h-12 rounded-full transition-all duration-300",
                "hover:bg-nav-item hover:shadow-glow",
                isActive && "bg-nav-item-active text-primary-foreground shadow-glow-lg"
              )}
              onClick={() => onItemClick?.(item.id)}
              title={item.label}
            >
              <Icon 
                className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  isActive && "scale-110"
                )} 
              />
            </Button>
          </Link>
        );
      })}
      
      {/* Profile Selector */}
      <ProfileSelector />
      
      {/* Logout Button */}
      <Button
        variant="ghost"
        size="icon"
        className="w-12 h-12 rounded-full transition-all duration-300 hover:bg-destructive/10 hover:text-destructive"
        onClick={handleLogout}
        title="Sair"
      >
        <LogOut className="h-5 w-5" />
      </Button>
      
      {/* Theme Toggle */}
      <div className="mt-auto">
        <ThemeToggle />
      </div>
    </div>
  );
};