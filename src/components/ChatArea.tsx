import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, LogOut, Bell, Eye, Calendar, History, FileText, Download, Play, Pause, Trash2, Settings, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [isAudioAnalyzerActive, setIsAudioAnalyzerActive] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [isImageEditorActive, setIsImageEditorActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

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

    // If image editor is active, send to image editor webhook
    if (isImageEditorActive) {
      if (!selectedImage) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: '❌ Por favor, selecione uma imagem antes de enviar a mensagem.',
          sender: 'ai',
          timestamp: new Date()
        }]);
        setIsLoading(false);
        return;
      }

      try {
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('prompt', inputValue);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutos timeout

        const response = await fetch('https://n8n-n8n.ascl7r.easypanel.host/webhook/c340cac2-ac07-43aa-b1c5-70e2fd0e64c5', {
          method: 'POST',
          body: formData,
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        console.log('Content-Type:', contentType);
        
        // Tenta processar como blob primeiro
        const blob = await response.blob();
        console.log('Blob type:', blob.type, 'size:', blob.size);
        
        if (blob.size === 0) {
          throw new Error('Webhook retornou resposta vazia. Verifique se o workflow n8n está configurado para retornar a imagem.');
        }
        
        // Se é uma imagem, cria URL e exibe
        if (blob.type.startsWith('image/')) {
          const imageUrl = URL.createObjectURL(blob);
          
          setTimeout(() => {
            const aiResponse: Message = {
              id: Date.now().toString(),
              content: '✅ Imagem editada com sucesso! Clique para baixar:',
              sender: 'ai',
              timestamp: new Date(),
              fileUrl: imageUrl,
              fileName: `edited-${selectedImage.name}`
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsLoading(false);
          }, 1000);
        } else if (blob.type.includes('json')) {
          // Se é JSON, tenta extrair a imagem
          const text = await blob.text();
          console.log('JSON response:', text);
          
          try {
            const parsedResult = JSON.parse(text);
            const imageData = parsedResult.editedImage || parsedResult.image || parsedResult.data || parsedResult.url || parsedResult.imageUrl || parsedResult.base64;
            
            if (imageData) {
              setTimeout(() => {
                const aiResponse: Message = {
                  id: Date.now().toString(),
                  content: '✅ Imagem editada com sucesso! Clique para baixar:',
                  sender: 'ai',
                  timestamp: new Date(),
                  fileUrl: imageData,
                  fileName: `edited-${selectedImage.name}`
                };
                setMessages(prev => [...prev, aiResponse]);
                setIsLoading(false);
              }, 1000);
            } else {
              throw new Error('JSON não contém dados de imagem. Resposta: ' + text);
            }
          } catch (parseError) {
            throw new Error('Erro ao processar JSON: ' + text);
          }
        } else {
          throw new Error(`Tipo de resposta inesperado: ${blob.type}. O webhook deve retornar uma imagem ou JSON com dados da imagem.`);
        }
      } catch (error) {
        console.error('Error sending to image editor:', error);
        
        setTimeout(() => {
          const errorResponse: Message = {
            id: Date.now().toString(),
            content: error instanceof Error && error.name === 'AbortError'
              ? '❌ Timeout: A edição da imagem demorou mais de 2 minutos. Tente novamente ou use uma imagem menor.'
              : `❌ Erro ao editar imagem:\n\n${error instanceof Error ? error.message : 'Erro desconhecido'}\n\n**Certifique-se de que:**\n- O webhook n8n está configurado para retornar "Binary Data" no node "Respond to Webhook"\n- O workflow está processando e retornando a imagem editada\n- A imagem selecionada é válida`,
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorResponse]);
          setIsLoading(false);
        }, 1000);
      }
    } else if (isAudioAnalyzerActive) {
      if (!selectedAudio) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: '❌ Por favor, selecione um áudio antes de enviar a mensagem.',
          sender: 'ai',
          timestamp: new Date()
        }]);
        setIsLoading(false);
        return;
      }

      try {
        // Convert audio to base64
        const reader = new FileReader();
        const audioBase64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const base64 = reader.result as string;
            resolve(base64.split(',')[1]); // Remove data:audio/...;base64, prefix
          };
          reader.onerror = reject;
          reader.readAsDataURL(selectedAudio);
        });

        const payload = {
          message: inputValue,
          audio: audioBase64,
          audioFileName: selectedAudio.name,
          audioMimeType: selectedAudio.type,
          client_id: selectedClient?.id || '',
          timestamp: new Date().toISOString()
        };

        const response = await fetch('https://n8n-n8n.ascl7r.easypanel.host/webhook/analisador-audio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.text();
        console.log('Audio analyzer response:', result);
        
        try {
          const parsedResult = JSON.parse(result);
          
          setTimeout(() => {
            const aiResponse: Message = {
              id: Date.now().toString(),
              content: parsedResult.output || result,
              sender: 'ai',
              timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsLoading(false);
          }, 1000);
        } catch (parseError) {
          setTimeout(() => {
            const aiResponse: Message = {
              id: Date.now().toString(),
              content: result || '✅ Processamento concluído com sucesso!',
              sender: 'ai',
              timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsLoading(false);
          }, 1000);
        }
      } catch (error) {
        console.error('Error sending to audio analyzer:', error);
        
        setTimeout(() => {
          const errorResponse: Message = {
            id: Date.now().toString(),
            content: `❌ Erro ao enviar para o analisador de áudio:\n\n${error instanceof Error ? error.message : 'Erro desconhecido'}\n\nVerifique se o webhook está funcionando: https://n8n-n8n.ascl7r.easypanel.host/webhook/analisador-audio`,
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorResponse]);
          setIsLoading(false);
        }, 1000);
      }
    } else if (isVideoAnalyzerActive) {
      if (!selectedVideo) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          content: '❌ Por favor, selecione um vídeo antes de enviar a mensagem.',
          sender: 'ai',
          timestamp: new Date()
        }]);
        setIsLoading(false);
        return;
      }

      try {
        const formData = new FormData();
        formData.append('message', inputValue);
        formData.append('video', selectedVideo);
        formData.append('client_id', selectedClient?.id || '');
        formData.append('timestamp', new Date().toISOString());

        const response = await fetch('https://n8n-n8n.ascl7r.easypanel.host/webhook/analisador_video', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.text();
        console.log('Video analyzer response:', result);
        
        try {
          const parsedResult = JSON.parse(result);
          
          setTimeout(() => {
            const aiResponse: Message = {
              id: Date.now().toString(),
              content: parsedResult.output || result,
              sender: 'ai',
              timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsLoading(false);
          }, 1000);
        } catch (parseError) {
          setTimeout(() => {
            const aiResponse: Message = {
              id: Date.now().toString(),
              content: result || '✅ Processamento concluído com sucesso!',
              sender: 'ai',
              timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsLoading(false);
          }, 1000);
        }
      } catch (error) {
        console.error('Error sending to video analyzer:', error);
        
        setTimeout(() => {
          const errorResponse: Message = {
            id: Date.now().toString(),
            content: `❌ Erro ao enviar para o analisador de vídeo:\n\n${error instanceof Error ? error.message : 'Erro desconhecido'}\n\nVerifique se o webhook está funcionando: https://n8n-n8n.ascl7r.easypanel.host/webhook/analisador_video`,
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorResponse]);
          setIsLoading(false);
        }, 1000);
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

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedVideo(file);
      event.target.value = '';
    }
  };

  const removeSelectedVideo = () => {
    setSelectedVideo(null);
  };

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedAudio(file);
      event.target.value = '';
    }
  };

  const removeSelectedAudio = () => {
    setSelectedAudio(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      event.target.value = '';
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
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
    <div className="h-full flex flex-col bg-background overflow-hidden">
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
                {isAudioAnalyzerActive && (
                  <Badge variant="secondary" className="text-xs">
                    <Settings className="h-3 w-3 mr-1" />
                    Analisador de Áudio
                  </Badge>
                )}
                {isVideoAnalyzerActive && (
                  <Badge variant="secondary" className="text-xs">
                    <Settings className="h-3 w-3 mr-1" />
                    Analisador de Vídeo
                  </Badge>
                )}
                {isImageEditorActive && (
                  <Badge variant="secondary" className="text-xs">
                    <Wand2 className="h-3 w-3 mr-1" />
                    Editor de Imagem
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
      <div className="flex-1 relative overflow-hidden">
        {/* Bottom fade overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background via-background/50 to-transparent z-10 pointer-events-none" />
        
        <ScrollArea className="h-full px-4 py-0">
          <div className="space-y-4 max-w-4xl mx-auto py-4">
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
      </div>

      {/* Input Area */}
      <div className="bg-card border-t border-border p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-2">
            <FileUpload 
              onFileSelect={handleFileUpload}
              onAudioRecord={handleAudioRecord}
            />
            <Popover open={isToolsMenuOpen} onOpenChange={setIsToolsMenuOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={isVideoAnalyzerActive || isAudioAnalyzerActive || isImageEditorActive ? "default" : "outline"}
                  size="icon"
                  title="Ferramentas"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2 bg-background border border-border shadow-lg" align="start" side="top">
                <div className="space-y-1">
                  <div className="px-2 py-1.5 text-sm font-medium text-foreground">Ferramentas</div>
                  <Separator />
                  <button
                    onClick={() => {
                      setIsVideoAnalyzerActive(!isVideoAnalyzerActive);
                      if (!isVideoAnalyzerActive) {
                        setIsAudioAnalyzerActive(false);
                        setIsImageEditorActive(false);
                      }
                      setIsToolsMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-2 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors ${
                      isVideoAnalyzerActive ? 'bg-primary/10 text-primary' : 'text-foreground'
                    }`}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Analisador de Vídeo
                    {isVideoAnalyzerActive && (
                      <Badge variant="secondary" className="ml-auto text-xs">Ativo</Badge>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsAudioAnalyzerActive(!isAudioAnalyzerActive);
                      if (!isAudioAnalyzerActive) {
                        setIsVideoAnalyzerActive(false);
                        setIsImageEditorActive(false);
                      }
                      setIsToolsMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-2 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors ${
                      isAudioAnalyzerActive ? 'bg-primary/10 text-primary' : 'text-foreground'
                    }`}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Analisador de Áudio
                    {isAudioAnalyzerActive && (
                      <Badge variant="secondary" className="ml-auto text-xs">Ativo</Badge>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsImageEditorActive(!isImageEditorActive);
                      if (!isImageEditorActive) {
                        setIsVideoAnalyzerActive(false);
                        setIsAudioAnalyzerActive(false);
                      }
                      setIsToolsMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-2 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors ${
                      isImageEditorActive ? 'bg-primary/10 text-primary' : 'text-foreground'
                    }`}
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Editor de Imagem
                    {isImageEditorActive && (
                      <Badge variant="secondary" className="ml-auto text-xs">Ativo</Badge>
                    )}
                  </button>
                </div>
              </PopoverContent>
            </Popover>
            <div className="flex-1 space-y-2">
              {isVideoAnalyzerActive && (
                <div className="flex items-center space-x-2">
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => videoInputRef.current?.click()}
                    className="text-sm"
                  >
                    Selecionar Vídeo
                  </Button>
                  {selectedVideo && (
                    <>
                      <span className="text-sm text-muted-foreground">
                        {selectedVideo.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeSelectedVideo}
                        className="h-6 w-6 p-0"
                      >
                        ×
                      </Button>
                    </>
                  )}
                </div>
              )}
              {isAudioAnalyzerActive && (
                <div className="flex items-center space-x-2">
                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => audioInputRef.current?.click()}
                    className="text-sm"
                  >
                    Selecionar Áudio
                  </Button>
                  {selectedAudio && (
                    <>
                      <span className="text-sm text-muted-foreground">
                        {selectedAudio.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeSelectedAudio}
                        className="h-6 w-6 p-0"
                      >
                        ×
                      </Button>
                    </>
                  )}
                </div>
              )}
              {isImageEditorActive && (
                <div className="flex items-center space-x-2">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => imageInputRef.current?.click()}
                    className="text-sm"
                  >
                    Selecionar Imagem
                  </Button>
                  {selectedImage && (
                    <>
                      <span className="text-sm text-muted-foreground">
                        {selectedImage.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeSelectedImage}
                        className="h-6 w-6 p-0"
                      >
                        ×
                      </Button>
                    </>
                  )}
                </div>
              )}
              <Input
                placeholder={
                  isImageEditorActive
                    ? "Descreva como deseja editar a imagem..."
                    : isAudioAnalyzerActive 
                    ? "Digite sua mensagem para análise de áudio..." 
                    : isVideoAnalyzerActive 
                    ? "Digite sua mensagem para análise de vídeo..." 
                    : "Digite sua mensagem..."
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className={`resize-none ${isAudioAnalyzerActive || isVideoAnalyzerActive || isImageEditorActive ? 'border-primary ring-1 ring-primary/20' : ''}`}
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