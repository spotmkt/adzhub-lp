import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Bell, Calendar, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const AgendaSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: true,
    emailReminders: true,
    defaultView: 'month',
    weekStartDay: '0', // Sunday
    workingHoursStart: '09:00',
    workingHoursEnd: '18:00',
    showWeekends: true,
    defaultEventDuration: '60',
    autoLinkContent: true,
  });

  const handleSaveSettings = () => {
    localStorage.setItem('agendaSettings', JSON.stringify(settings));
    toast({
      title: 'Sucesso',
      description: 'Configurações salvas com sucesso.',
    });
  };

  return (
    <div className="h-full p-6 bg-background overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/agenda')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Configurações da Agenda</h1>
            <p className="text-muted-foreground mt-1">
              Personalize sua experiência de agendamento
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações
              </CardTitle>
              <CardDescription>
                Configure como deseja ser notificado sobre seus eventos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações push</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações no navegador
                  </p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, notifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Lembretes por email</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba lembretes dos eventos por email
                  </p>
                </div>
                <Switch
                  checked={settings.emailReminders}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailReminders: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Calendar View */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Visualização do Calendário
              </CardTitle>
              <CardDescription>
                Personalize como o calendário é exibido
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Visualização padrão</Label>
                <Select
                  value={settings.defaultView}
                  onValueChange={(value) =>
                    setSettings({ ...settings, defaultView: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Dia</SelectItem>
                    <SelectItem value="week">Semana</SelectItem>
                    <SelectItem value="month">Mês</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Primeiro dia da semana</Label>
                <Select
                  value={settings.weekStartDay}
                  onValueChange={(value) =>
                    setSettings({ ...settings, weekStartDay: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Domingo</SelectItem>
                    <SelectItem value="1">Segunda-feira</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mostrar fins de semana</Label>
                  <p className="text-sm text-muted-foreground">
                    Exibir sábado e domingo no calendário
                  </p>
                </div>
                <Switch
                  checked={settings.showWeekends}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, showWeekends: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Working Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Horário de Trabalho</CardTitle>
              <CardDescription>
                Defina seu horário de trabalho padrão
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Início</Label>
                  <Select
                    value={settings.workingHoursStart}
                    onValueChange={(value) =>
                      setSettings({ ...settings, workingHoursStart: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fim</Label>
                  <Select
                    value={settings.workingHoursEnd}
                    onValueChange={(value) =>
                      setSettings({ ...settings, workingHoursEnd: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Defaults */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Padrões de Eventos
              </CardTitle>
              <CardDescription>
                Configure valores padrão para novos eventos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Duração padrão (minutos)</Label>
                <Select
                  value={settings.defaultEventDuration}
                  onValueChange={(value) =>
                    setSettings({ ...settings, defaultEventDuration: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="120">2 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-vincular conteúdo</Label>
                  <p className="text-sm text-muted-foreground">
                    Vincular automaticamente posts agendados à agenda
                  </p>
                </div>
                <Switch
                  checked={settings.autoLinkContent}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoLinkContent: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => navigate('/agenda')}>
              Cancelar
            </Button>
            <Button onClick={handleSaveSettings}>Salvar Configurações</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgendaSettings;
