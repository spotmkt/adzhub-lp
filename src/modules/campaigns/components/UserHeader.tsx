import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Settings, BarChart3 } from 'lucide-react';
import { useCampaignsAuth } from '../contexts/CampaignsAuthContext';
import { useNavigate } from 'react-router-dom';

interface UserHeaderProps {
  onEditProfile?: () => void;
}

const UserHeader = ({ onEditProfile }: UserHeaderProps) => {
  const { user, logout } = useCampaignsAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src={user.profileImage} alt="Foto de perfil" />
            <AvatarFallback className="bg-orange-primary text-white">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.username && user.username.length > 0 ? user.username.charAt(0).toUpperCase() : '?')}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-dark-primary truncate">
              Olá, {user.displayName || user.username}!
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <Button
            onClick={() => navigate('/campaigns/dashboard')}
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center gap-2 border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden md:inline">Dashboard</span>
          </Button>
          
          <Button
            onClick={() => navigate('/campaigns/dashboard')}
            variant="outline"
            size="sm"
            className="sm:hidden flex items-center gap-2 border-gray-200 text-gray-600 hover:bg-gray-50 px-2"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          
          {onEditProfile && (
            <>
              <Button
                onClick={onEditProfile}
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center gap-2 border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden md:inline">Editar Perfil</span>
              </Button>
              
              <Button
                onClick={onEditProfile}
                variant="outline"
                size="sm"
                className="sm:hidden flex items-center gap-2 border-gray-200 text-gray-600 hover:bg-gray-50 px-2"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </>
          )}
          
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Sair</span>
          </Button>
          
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="sm:hidden flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 px-2"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
