import React, { useState, useEffect } from 'react';
import { Send, Bot, User, Loader2, LogOut, Bell, Eye, Calendar, History, FileText, Download, Play, Pause, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ClientDropdown } from './ClientDropdown';
import { FileUpload } from './FileUpload';
import { AudioRecorder } from './AudioRecorder';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  audioUrl?: string;
  fileUrl?: string;
  fileName?: string;
}

interface ActionCard {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: string;
  category: string;
}

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  profile_photo_url?: string;
}

interface ChatAreaProps {
  onSendMessage?: (message: string, messageData: Message) => void;
  selectedClient?: Client | null;
  onExitChat?: () => void;
  onClearHistory?: () => void;
  onViewCard?: (actionId: string) => void;
  onClientSelect?: (client: Client) => void;
  activeNavItem?: string;
  onNavItemClick?: (item: string) => void;
}

export const ChatArea = ({ 
  onSendMessage, 
  selectedClient, 
  onExitChat, 
  onClearHistory, 
  onViewCard,
  onClientSelect,
  activeNavItem,
  onNavItemClick 
}: ChatAreaProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<ActionCard[]>([]);
  const [isVideoAnalyzerActive, setIsVideoAnalyzerActive] = useState(false);

  // Make functions available globally for external calls
  useEffect(() => {
    (window as any).addAIResponse = (content: string, audioUrl?: string) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: 'ai',
        timestamp: new Date(),
        audioUrl
      };
      setMessages(prev => [...prev, newMessage]);
      setIsLoading(false);
    };

    (window as any).addCardNotification = (card: ActionCard) => {
      setNotifications(prev => [card, ...prev]);
    };

    (window as any).setChatHistory = (history: Message[]) => {
      setMessages(history);
    };

    (window as any).clearChat = () => {
      setMessages([]);
      setInputValue('');
      setIsLoading(false);
    };

    return () => {
      delete (window as any).addAIResponse;
      delete (window as any).addCardNotification;
      delete (window as any).setChatHistory;
      delete (window as any).clearChat;
    };
  }, []);

  // Show client selector if no client is selected
  if (!selectedClient) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30">
        <ClientDropdown 
          selectedClient={null}
          onClientSelect={onClientSelect || (() => {})} 
          onExitChat={onExitChat || (() => {})}
        />
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const messageData: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, messageData]);
    setIsLoading(true);

    // If video analyzer is active, send to video analyzer webhook
    if (isVideoAnalyzerActive) {
      try {
        await fetch('https://n8n-n8n.ascl7r.easypanel.host/webhook/analisador_video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: inputValue,
            client_id: selectedClient?.id,
            timestamp: new Date().toISOString(),
          }),
        });
        
        // Add a response indicating the message was sent to video analyzer
        setTimeout(() => {
          const aiResponse: Message = {
            id: Date.now().toString(),
            content: 'Mensagem enviada para o analisador de vídeo. Aguarde o processamento...',
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiResponse]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error sending to video analyzer:', error);
        setIsLoading(false);
      }
    } else {
      // Normal message handling
      if (onSendMessage) {
        onSendMessage(inputValue, messageData);
      }
    }

    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const dismissNotification = (cardId: string) => {
    setNotifications(prev => prev.filter(card => card.id !== cardId));
  };

  const viewCard = (cardId: string) => {
    if (onViewCard) {
      onViewCard(cardId);
    }
    dismissNotification(cardId);
  };

  const handleFileUpload = (file: File, type: 'image' | 'audio' | 'document') => {
    const fileName = file.name;
    const fileUrl = URL.createObjectURL(file);
    
    const messageData: Message = {
      id: Date.now().toString(),
      content: `Arquivo enviado: ${fileName}`,
      sender: 'user',
      timestamp: new Date(),
      fileUrl,
      fileName
    };

    setMessages(prev => [...prev, messageData]);

    if (onSendMessage) {
      onSendMessage(`Arquivo enviado: ${fileName}`, messageData);
    }
  };

  const handleAudioRecord = (audioBlob: Blob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    
    const messageData: Message = {
      id: Date.now().toString(),
      content: 'Áudio enviado',
      sender: 'user',
      timestamp: new Date(),
      audioUrl
    };

    setMessages(prev => [...prev, messageData]);

    if (onSendMessage) {
      onSendMessage('Áudio enviado', messageData);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage 
                src={selectedClient.profile_photo_url} 
                alt={selectedClient.name} 
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-foreground flex items-center space-x-2">
                <span>{selectedClient.name}</span>
                {isVideoAnalyzerActive && (
                  <Badge variant="secondary" className="text-xs">
                    <Settings className="h-3 w-3 mr-1" />
                    Analisador de Vídeo
                  </Badge>
                )}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedClient.email || selectedClient.phone || 'Online'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {onClearHistory && (
              <Button variant="outline" size="sm" onClick={onClearHistory}>
                <Trash2 className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
            {onExitChat && (
              <Button variant="outline" size="sm" onClick={onExitChat}>
                <LogOut className="h-4 w-4 mr-1" />
                Sair
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="bg-primary/5 border-b border-primary/20 p-3">
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {notifications.map((card) => (
              <div 
                key={card.id} 
                className="flex items-center justify-between bg-card p-3 rounded-lg border border-primary/20"
              >
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{card.title}</p>
                    <p className="text-xs text-muted-foreground">Nova ação recomendada</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => viewCard(card.id)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => dismissNotification(card.id)}
                  >
                    ×
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Olá! Como posso ajudar?</h3>
              <p className="text-muted-foreground">
                Digite sua mensagem, envie um arquivo ou grave um áudio para começar nossa conversa.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[70%] ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {message.sender === 'user' ? (
                      <Avatar className="w-8 h-8">
                        <AvatarImage 
                          src={selectedClient.profile_photo_url} 
                          alt={selectedClient.name} 
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}>
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    
                    {/* Audio playback */}
                    {message.audioUrl && (
                      <div className="mt-2">
                        <audio controls className="max-w-full">
                          <source src={message.audioUrl} type="audio/wav" />
                        </audio>
                      </div>
                    )}
                    
                    {/* File download */}
                    {message.fileUrl && (
                      <div className="mt-2">
                        <a 
                          href={message.fileUrl} 
                          download={message.fileName}
                          className="inline-flex items-center text-xs underline hover:no-underline"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          {message.fileName}
                        </a>
                      </div>
                    )}
                    
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-[70%]">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Digitando...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-card border-t border-border p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-2">
            <FileUpload 
              onFileSelect={handleFileUpload}
              onAudioRecord={handleAudioRecord}
            />
            <Button
              variant={isVideoAnalyzerActive ? "default" : "outline"}
              size="icon"
              onClick={() => setIsVideoAnalyzerActive(!isVideoAnalyzerActive)}
              title={isVideoAnalyzerActive ? "Analisador de Vídeo Ativo" : "Ativar Analisador de Vídeo"}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <Input
                placeholder={isVideoAnalyzerActive ? "Digite sua mensagem para análise de vídeo..." : "Digite sua mensagem..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className={`resize-none ${isVideoAnalyzerActive ? 'border-primary ring-1 ring-primary/20' : ''}`}
              />
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};