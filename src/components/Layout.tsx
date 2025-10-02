import { useState, useEffect } from 'react';
import { NavigationBar } from './NavigationBar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [activeNavItem, setActiveNavItem] = useState('home');

  // Update active nav item based on current route
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/') setActiveNavItem('home');
    else if (path === '/chat') setActiveNavItem('chats');
    else if (path === '/content') setActiveNavItem('content');
    else if (path === '/apps') setActiveNavItem('apps');
    else if (path === '/settings') setActiveNavItem('settings');
  }, []);

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <NavigationBar 
          activeItem={activeNavItem}
          onItemClick={setActiveNavItem}
        />
      </div>
      
      <div className="flex-1 min-w-0 h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
};