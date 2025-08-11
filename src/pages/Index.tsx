import { ChatInterface } from '@/components/ChatInterface';
import { AuthGuard } from '@/components/AuthGuard';

const Index = () => {
  return (
    <AuthGuard>
      <ChatInterface />
    </AuthGuard>
  );
};

export default Index;
