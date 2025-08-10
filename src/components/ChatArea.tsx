import React, { useState, useEffect } from 'react';
import { Send, Bot, User, Loader2, LogOut, Bell, Eye, Calendar, History, FileText, Download, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ClientDropdown } from './ClientDropdown';
import { ThemeToggle } from './ThemeToggle';
import { FileUpload } from './FileUpload';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
  fileData?: {
    file: File;
    type: 'image' | 'audio' | 'document';
    url?: string;
  };
  cardData?: {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  };
}

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface ChatAreaProps {
  onSendMessage?: (message: string, messageData: Message) => void;
  selectedClient?: Client;
  onExitChat?: () => void;
  onViewCard?: (cardId: string) => void;
  onClientSelect?: (client: Client) => void;
  activeNavItem?: string;
  onNavItemClick?: (item: string) => void;
}

export const ChatArea = ({ 
  onSendMessage, 
  selectedClient, 
  onExitChat, 
  onViewCard, 
  onClientSelect,
  activeNavItem,
  onNavItemClick 
}: ChatAreaProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  // Initialize with welcome message when client is selected
  useEffect(() => {
    if (selectedClient) {
      const welcomeMessage: Message = {
        id: 'welcome',
        content: `Olá! Bem-vindo ao atendimento para ${selectedClient.name}. Como posso ajudá-lo hoje?`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [selectedClient]);

  // Handle viewport changes for iOS Safari URL bar
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    const handleVisualViewportChange = () => {
      if (window.visualViewport) {
        setViewportHeight(window.visualViewport.height);
      }
    };

    // Listen to both window resize and visual viewport changes
    window.addEventListener('resize', handleResize);
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportChange);
      }
    };
  }, []);

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: inputValue,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsThinking(true);
      onSendMessage?.(inputValue, newMessage);
      setInputValue('');
    }
  };

  const handleFileSelect = (file: File, type: 'image' | 'audio' | 'document') => {
    const url = URL.createObjectURL(file);
    const fileMessage: Message = {
      id: Date.now().toString(),
      content: `Enviou ${type === 'image' ? 'uma imagem' : type === 'audio' ? 'um áudio' : 'um documento'}: ${file.name}`,
      sender: 'user',
      timestamp: new Date(),
      fileData: {
        file,
        type,
        url
      }
    };
    
    setMessages(prev => [...prev, fileMessage]);
    setIsThinking(true);
    onSendMessage?.(fileMessage.content, fileMessage);
  };

  // Add function to receive AI response
  const addAIResponse = (content: string) => {
    const aiResponse: Message = {
      id: Date.now().toString(),
      content,
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiResponse]);
    setIsThinking(false);
  };

  // Add function to add card notification
  const addCardNotification = (cardData: any) => {
    console.log('addCardNotification called with:', cardData);
    
    const cardNotification: Message = {
      id: `card-${cardData.id}-${Date.now()}`,
      content: '',
      sender: 'system',
      timestamp: new Date(),
      cardData: {
        id: cardData.id,
        title: cardData.title,
        description: cardData.description,
        priority: cardData.priority
      }
    };
    
    console.log('Adding card notification to messages:', cardNotification);
    setMessages(prev => {
      const newMessages = [...prev, cardNotification];
      console.log('New messages array:', newMessages);
      return newMessages;
    });
  };

  // Functions to manage chat history
  const setChatHistory = (history: Message[]) => {
    setMessages(history);
  };

  const clearChat = () => {
    setMessages([]);
  };

  // Expose functions globally
  useEffect(() => {
    (window as any).addAIResponse = addAIResponse;
    (window as any).setChatHistory = setChatHistory;
    (window as any).clearChat = clearChat;
    (window as any).addCardNotification = addCardNotification;
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div 
      className="bg-chat-background flex flex-col min-w-0 relative"
      style={{ height: `${viewportHeight}px` }}
    >
      {/* Mobile Header with Navigation */}
      <div className="md:hidden bg-chat-header border-b border-border p-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavItemClick?.('actions')}
            className="h-8 w-8"
          >
            <Calendar className="h-4 w-4" />
          </Button>
          <ClientDropdown
            selectedClient={selectedClient}
            onClientSelect={onClientSelect}
            onExitChat={onExitChat}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavItemClick?.('history')}
            className="h-8 w-8"
          >
            <History className="h-4 w-4" />
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block border-b border-border p-4 flex-shrink-0">
        <ClientDropdown
          selectedClient={selectedClient}
          onClientSelect={onClientSelect}
          onExitChat={onExitChat}
        />
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 min-h-0">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start space-x-3",
                message.sender === 'user' && "flex-row-reverse space-x-reverse"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                message.sender === 'user' 
                  ? "bg-chat-bubble-user" 
                  : "bg-chat-bubble-ai"
              )}>
                {message.sender === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              
              <div className={cn(
                "max-w-[70%] p-3 rounded-2xl shadow-sm break-words",
                message.sender === 'user'
                  ? "bg-chat-bubble-user text-primary-foreground ml-auto"
                  : "bg-chat-bubble-ai text-foreground"
              )}>
                {message.content && <p className="text-sm leading-relaxed break-words">{message.content}</p>}
                
                {/* File attachments */}
                {message.fileData && (
                  <div className="mt-2">
                    {message.fileData.type === 'image' && (
                      <div className="relative">
                        <img 
                          src={message.fileData.url} 
                          alt={message.fileData.file.name}
                          className="max-w-full h-auto rounded-lg border border-border max-h-64 object-contain"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = message.fileData!.url!;
                            link.download = message.fileData!.file.name;
                            link.click();
                          }}
                          className="absolute top-2 right-2 h-7 w-7 p-0"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    
                    {message.fileData.type === 'audio' && (
                      <div className="bg-accent rounded-lg p-3 flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Play className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{message.fileData.file.name}</p>
                          <audio controls className="w-full mt-1">
                            <source src={message.fileData.url} type={message.fileData.file.type} />
                          </audio>
                        </div>
                      </div>
                    )}
                    
                    {message.fileData.type === 'document' && (
                      <div className="bg-accent rounded-lg p-3 flex items-center gap-3">
                        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{message.fileData.file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(message.fileData.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = message.fileData!.url!;
                            link.download = message.fileData!.file.name;
                            link.click();
                          }}
                          className="h-7 px-2 text-xs"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Baixar
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Card notification - single line */}
                {message.cardData && (
                  <div className="mt-2 p-2 bg-chat-bubble-ai rounded-lg flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium text-sm truncate">{message.cardData.title}</span>
                      <Badge 
                        variant={message.cardData.priority === 'high' ? 'destructive' : 
                                message.cardData.priority === 'medium' ? 'default' : 'secondary'} 
                        className="text-xs flex-shrink-0"
                      >
                        {message.cardData.priority}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewCard?.(message.cardData!.id)}
                      className="flex items-center gap-1 h-7 px-2 text-xs flex-shrink-0"
                    >
                      <Eye className="h-3 w-3" />
                      Ver
                    </Button>
                  </div>
                )}
                
                <span className={cn(
                  "text-xs mt-2 block opacity-70",
                  message.sender === 'user' ? "text-primary-foreground" : "text-muted-foreground"
                )}>
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          
          {/* Thinking Animation */}
          {isThinking && (
            <div className="flex items-start space-x-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-chat-bubble-ai">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-chat-bubble-ai text-foreground p-3 rounded-2xl shadow-sm">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Pensando...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border p-4 flex-shrink-0 bg-chat-background">
        <div className="relative max-w-full flex gap-2">
          <FileUpload onFileSelect={handleFileSelect} />
          <div className="relative flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="pr-12 w-full bg-chat-input border-border rounded-xl h-10 text-foreground placeholder:text-muted-foreground"
              style={{ 
                paddingBottom: 'env(safe-area-inset-bottom)',
                marginBottom: 'env(safe-area-inset-bottom)'
              }}
            />
            <Button
              onClick={handleSend}
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-lg bg-primary hover:bg-primary/90 shadow-glow"
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};