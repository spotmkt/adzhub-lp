import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Generic skeleton components
export const PageHeaderSkeleton = () => (
  <div className="flex justify-between items-center mb-6">
    <Skeleton className="h-8 w-64" />
    <div className="flex gap-2">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-6 w-36" />
    </div>
  </div>
);

export const CardSkeleton = ({ showActions = false }: { showActions?: boolean }) => (
  <Card className="w-full">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex gap-2 ml-4 shrink-0">
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        {showActions && (
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

// Content-specific skeletons
export const ContentLoadingSkeleton = () => (
  <div className="h-full p-6 bg-background">
    <div className="max-w-6xl mx-auto">
      <PageHeaderSkeleton />
      
      <Tabs defaultValue="ideas" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ideas">Central de Big Ideias</TabsTrigger>
          <TabsTrigger value="posts">Postagens Pendentes</TabsTrigger>
          <TabsTrigger value="history">Calendário de Postagens</TabsTrigger>
        </TabsList>

        <TabsContent value="ideas" className="space-y-4 mt-6">
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} showActions={true} />
            ))}
          </div>
          
          <div className="mt-8">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
);

// Chat-specific skeletons
export const ChatLoadingSkeleton = () => (
  <div className="flex flex-col h-full">
    <div className="flex-1 space-y-4 p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-xs ${i % 2 === 0 ? 'bg-primary/10' : 'bg-muted'} rounded-lg p-3`}>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      ))}
    </div>
    <div className="border-t p-4">
      <Skeleton className="h-10 w-full" />
    </div>
  </div>
);

// Action panel skeleton
export const ActionPanelSkeleton = () => (
  <div className="p-4 space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-5 w-8" />
    </div>
    
    {Array.from({ length: 3 }).map((_, i) => (
      <Card key={i} className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </Card>
    ))}
  </div>
);

// History page skeleton
export const HistoryLoadingSkeleton = () => (
  <div className="h-full p-6 bg-background">
    <div className="max-w-4xl mx-auto">
      <PageHeaderSkeleton />
      
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-6 rounded" />
                <div className="space-y-1">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-full" />
          </Card>
        ))}
      </div>
    </div>
  </div>
);

// Settings page skeleton  
export const SettingsLoadingSkeleton = () => (
  <div className="h-full p-6 bg-background">
    <div className="max-w-2xl mx-auto">
      <PageHeaderSkeleton />
      
      <div className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="grid gap-4">
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="grid gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-6 w-10" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
);

// Generic list skeleton
export const ListSkeleton = ({ items = 5, showActions = false }: { items?: number; showActions?: boolean }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, i) => (
      <CardSkeleton key={i} showActions={showActions} />
    ))}
  </div>
);

// Loading state with message
export const LoadingMessage = ({ message = "Carregando..." }: { message?: string }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p className="text-muted-foreground animate-pulse">{message}</p>
    </div>
  </div>
);