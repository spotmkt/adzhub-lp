import { Plus, Star, Settings, MessageSquare, Bookmark, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationBarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const navigationItems = [
  { id: 'new', icon: Plus, label: 'New Chat' },
  { id: 'chats', icon: MessageSquare, label: 'Chats' },
  { id: 'favorites', icon: Star, label: 'Favorites' },
  { id: 'bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export const NavigationBar = ({ activeItem = 'chats', onItemClick }: NavigationBarProps) => {
  return (
    <div className="w-16 bg-nav-background border-r border-border flex flex-col items-center py-6 space-y-4">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeItem === item.id;
        
        return (
          <Button
            key={item.id}
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
        );
      })}
    </div>
  );
};