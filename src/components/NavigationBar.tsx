import { Plus, Settings, MessageSquare, User, History, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ProfileSelector } from '@/components/ProfileSelector';
import adzHubLogo from '@/assets/adzhub-logo-final.png';

interface NavigationBarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
  onClientSelect?: (client: any) => void;
}

const navigationItems = [
  { id: 'new', icon: Plus, label: 'New Chat', path: '/' },
  { id: 'chats', icon: MessageSquare, label: 'Chats', path: '/' },
  { id: 'history', icon: History, label: 'Histórico', path: '/history' },
  { id: 'content', icon: FileText, label: 'Conteúdo', path: '/content' },
  { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
];

export const NavigationBar = ({ activeItem = 'chats', onItemClick, onClientSelect }: NavigationBarProps) => {
  return (
    <div className="w-16 bg-nav-background border-r border-border flex flex-col items-center py-6 space-y-4">
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
      <ProfileSelector onClientSelect={onClientSelect} />
      
      {/* Theme Toggle */}
      <div className="mt-auto">
        <ThemeToggle />
      </div>
    </div>
  );
};