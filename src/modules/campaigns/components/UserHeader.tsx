import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Settings, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserHeaderProps {
  userName?: string;
  userAvatar?: string;
  instanceCount?: number;
  onEditProfile?: () => void;
}

const UserHeader = ({ userName = 'Usuário', userAvatar, instanceCount = 0, onEditProfile }: UserHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card shadow-sm border-b px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Avatar className="w-12 h-12 flex-shrink-0 border-2 border-primary/20">
            <AvatarImage src={userAvatar} alt="Foto de perfil" />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground truncate">
              Olá, {userName}!
            </p>
            <p className="text-sm text-muted-foreground">
              Instâncias: {instanceCount}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            onClick={() => navigate('/campaigns/dashboard')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>
          
          {onEditProfile && (
            <Button
              onClick={onEditProfile}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Editar Perfil</span>
            </Button>
          )}
          
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
