import { useState, useEffect } from 'react';
import { NavigationBar } from './NavigationBar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [activeNavItem, setActiveNavItem] = useState('chats');

  // Update active nav item based on current route
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/') setActiveNavItem('chats');
    else if (path === '/content') setActiveNavItem('content');
    else if (path === '/settings') setActiveNavItem('settings');
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <NavigationBar 
          activeItem={activeNavItem}
          onItemClick={setActiveNavItem}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
};