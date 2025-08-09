import React, { useState, useEffect } from 'react';
import { Send, Bot, User, Loader2, LogOut, Bell, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
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
}

export const ChatArea = ({ onSendMessage, selectedClient, onExitChat, onViewCard }: ChatAreaProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);

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
    const cardNotification: Message = {
      id: `card-${cardData.id}-${Date.now()}`,
      content: `📋 Novo card recebido: ${cardData.title}`,
      sender: 'system',
      timestamp: new Date(),
      cardData: {
        id: cardData.id,
        title: cardData.title,
        description: cardData.description,
        priority: cardData.priority
      }
    };
    setMessages(prev => [...prev, cardNotification]);
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
    <div className="flex-1 bg-chat-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Chat - {selectedClient?.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            {selectedClient?.email && `${selectedClient.email} • `}
            {selectedClient?.phone || 'Assistente IA'}
          </p>
        </div>
        
        {onExitChat && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExitChat}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair do Chat</span>
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
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
                "max-w-[70%] p-4 rounded-2xl shadow-sm",
                message.sender === 'user'
                  ? "bg-chat-bubble-user text-primary-foreground ml-auto"
                  : "bg-chat-bubble-ai text-foreground"
              )}>
                {message.content && <p className="text-sm leading-relaxed">{message.content}</p>}
                
                {/* Card notification - single line */}
                {message.cardData && (
                  <div className="mt-2 p-2 bg-chat-bubble-ai rounded-lg flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{message.cardData.title}</span>
                      <Badge 
                        variant={message.cardData.priority === 'high' ? 'destructive' : 
                                message.cardData.priority === 'medium' ? 'default' : 'secondary'} 
                        className="text-xs"
                      >
                        {message.cardData.priority}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewCard?.(message.cardData!.id)}
                      className="flex items-center gap-1 h-7 px-2 text-xs"
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
              <div className="bg-chat-bubble-ai text-foreground p-4 rounded-2xl shadow-sm">
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
      <div className="border-t border-border p-6">
        <div className="relative">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="pr-12 bg-chat-input border-border rounded-xl h-12 text-foreground placeholder:text-muted-foreground"
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-primary hover:bg-primary/90 shadow-glow"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};