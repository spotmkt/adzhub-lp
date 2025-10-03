import { Settings, MessageSquare, LayoutGrid, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ProfileSelector } from '@/components/ProfileSelector';
import adzHubLogo from '@/assets/adzhub-logo-final.png';

interface NavigationBarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const navigationItems = [
  { id: 'home', icon: Home, label: 'Home', path: '/' },
  { id: 'chats', icon: MessageSquare, label: 'Chats', path: '/chat' },
  { id: 'apps', icon: LayoutGrid, label: 'Apps', path: '/apps' },
  { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
];

export const NavigationBar = ({ activeItem = 'home', onItemClick }: NavigationBarProps) => {
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
      
      {/* Theme Toggle */}
      <div className="mt-auto">
        <ThemeToggle />
      </div>
    </div>
  );
};