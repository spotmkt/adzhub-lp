import { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatAreaProps {
  onSendMessage?: (message: string, messageData: Message) => void;
}

export const ChatArea = ({ onSendMessage }: ChatAreaProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Sou seu assistente pessoal para gestão de tarefas criativas. Como posso ajudá-lo hoje?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: inputValue,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      onSendMessage?.(inputValue, newMessage);
      setInputValue('');
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: 'Entendi sua solicitação. Estou processando e criando algumas ações recomendadas para você.',
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 bg-chat-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-6">
        <h1 className="text-2xl font-semibold text-foreground">Assistente Criativo</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas tarefas criativas com inteligência artificial
        </p>
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
                <p className="text-sm leading-relaxed">{message.content}</p>
                <span className={cn(
                  "text-xs mt-2 block opacity-70",
                  message.sender === 'user' ? "text-primary-foreground" : "text-muted-foreground"
                )}>
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
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