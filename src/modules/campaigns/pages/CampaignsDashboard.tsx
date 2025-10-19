import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useCampaigns, useUpdateCampaign, useDeleteCampaign, useCreateCampaign } from '../hooks/useCampaigns';
import { useInstances } from '../hooks/useInstances';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus, Filter, AlertCircle, Activity, ArrowUpDown, Calendar, Search, CalendarIcon, Smartphone, Loader2, RefreshCw } from 'lucide-react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { CampaignCard } from '../components/CampaignCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartLoadingState } from '../components/ChartLoadingState';

const CampaignsDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize state from URL parameters
  const [filter, setFilter] = useState<'all' | 'draft' | 'scheduled' | 'processing' | 'completed'>(() => {
    const filterParam = searchParams.get('filter');
    return (filterParam === 'draft' || filterParam === 'scheduled' || filterParam === 'processing' || filterParam === 'completed') 
      ? filterParam : 'all';
  });
  
  const [sortBy, setSortBy] = useState<'date' | 'status'>(() => {
    const sortParam = searchParams.get('sortBy');
    return (sortParam === 'date' || sortParam === 'status') ? sortParam : 'date';
  });
  
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(() => {
    const orderParam = searchParams.get('sortOrder');
    return (orderParam === 'asc' || orderParam === 'desc') ? orderParam : 'desc';
  });
  
  const [searchName, setSearchName] = useState(() => searchParams.get('search') || '');
  const [selectedInstance, setSelectedInstance] = useState(() => searchParams.get('instance') || 'all');
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const fromParam = searchParams.get('dateFrom');
    const toParam = searchParams.get('dateTo');
    if (fromParam || toParam) {
      return {
        from: fromParam ? new Date(fromParam) : undefined,
        to: toParam ? new Date(toParam) : undefined
      };
    }
    return undefined;
  });
  
  const [currentPage, setCurrentPage] = useState(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam, 10) : 1;
  });
  
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    
    const newSearchParams = new URLSearchParams();
    
    if (filter !== 'all') newSearchParams.set('filter', filter);
    if (sortBy !== 'date') newSearchParams.set('sortBy', sortBy);
    if (sortOrder !== 'desc') newSearchParams.set('sortOrder', sortOrder);
    if (searchName) newSearchParams.set('search', searchName);
    if (selectedInstance !== 'all') newSearchParams.set('instance', selectedInstance);
    if (dateRange?.from) newSearchParams.set('dateFrom', dateRange.from.toISOString());
    if (dateRange?.to) newSearchParams.set('dateTo', dateRange.to.toISOString());
    if (currentPage !== 1) newSearchParams.set('page', currentPage.toString());
    
    setSearchParams(newSearchParams, { replace: true });
  }, [filter, sortBy, sortOrder, searchName, selectedInstance, dateRange, currentPage, setSearchParams, isInitialized]);
  
  const CARDS_PER_PAGE = 9;
  
  const getCampaignRelevantDate = (campaign: any): Date => {
    if (campaign.status === 'completed' && (campaign.completed_at || campaign.started_at || campaign.scheduled_for)) {
      return new Date(campaign.completed_at || campaign.started_at || campaign.scheduled_for || '');
    } else if (campaign.status === 'scheduled' && campaign.scheduled_for) {
      return new Date(campaign.scheduled_for);
    } else {
      return new Date(campaign.created_at);
    }
  };
  
  const { data: instances } = useInstances();
  
  const { data: campaignsData, isLoading, error, refetch: refetchCampaigns } = useCampaigns(filter === 'all' ? undefined : filter);
  const updateCampaign = useUpdateCampaign();
  const deleteCampaign = useDeleteCampaign();
  const createCampaign = useCreateCampaign();

  // Mock data for charts while we don't have analytics
  const mockAnalytics = {
    responsesByWeekday: [],
    responsesByTimeSlot: []
  };
  const isAnalyticsLoading = false;

  const campaigns = useMemo(() => {
    if (!campaignsData) return [];
    
    let filtered = campaignsData.filter(campaign => {
      const nameMatch = searchName === '' || campaign.name.toLowerCase().includes(searchName.toLowerCase());
      const instanceMatch = selectedInstance === 'all' || campaign.instance_label === selectedInstance;
      
      let dateMatch = true;
      if (dateRange?.from || dateRange?.to) {
        const campaignDate = getCampaignRelevantDate(campaign);
        
        if (dateRange.from && campaignDate < dateRange.from) {
          dateMatch = false;
        }
        if (dateRange.to && campaignDate > new Date(dateRange.to.getTime() + 24 * 60 * 60 * 1000 - 1)) {
          dateMatch = false;
        }
      }
      
      return nameMatch && instanceMatch && dateMatch;
    });
    
    const sorted = [...filtered].sort((a, b) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case 'date':
          compareValue = getCampaignRelevantDate(a).getTime() - getCampaignRelevantDate(b).getTime();
          break;
        case 'status':
          compareValue = a.status.localeCompare(b.status);
          break;
        default:
          compareValue = 0;
      }
      
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });
    
    return sorted;
  }, [campaignsData, sortBy, sortOrder, searchName, selectedInstance, dateRange?.from, dateRange?.to]);

  const paginatedCampaigns = useMemo(() => {
    const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
    const endIndex = startIndex + CARDS_PER_PAGE;
    return campaigns.slice(startIndex, endIndex);
  }, [campaigns, currentPage, CARDS_PER_PAGE]);

  const totalPages = Math.ceil(campaigns.length / CARDS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchName, selectedInstance, dateRange?.from, dateRange?.to]);

  const stats = useMemo(() => {
    if (!campaignsData) return { total: 0, draft: 0, scheduled: 0, completed: 0 };

    return {
      total: campaignsData.length,
      draft: campaignsData.filter(c => c.status === 'draft').length,
      scheduled: campaignsData.filter(c => c.status === 'scheduled').length,
      completed: campaignsData.filter(c => c.status === 'completed').length,
    };
  }, [campaignsData]);

  const handleViewCampaign = (campaign: any) => {
    const currentPath = `${location.pathname}${location.search}`;
    navigate(`/campaigns/campaign/${campaign.id}`, { 
      state: { from: currentPath } 
    });
  };

  const handleEditCampaign = (campaign: any) => {
    navigate(`/campaigns?edit=${campaign.id}`);
  };

  const handleRenameCampaign = async (campaign: any, newName: string) => {
    try {
      await updateCampaign.mutateAsync({
        id: campaign.id,
        name: newName
      });
      await refetchCampaigns();
      toast.success('Campanha renomeada com sucesso');
    } catch (error) {
      toast.error('Erro ao renomear campanha');
    }
  };

  const handleDuplicateCampaign = async (campaign: any) => {
    try {
      await createCampaign.mutateAsync({
        name: `${campaign.name} (Cópia)`,
        instance_label: campaign.instance_label,
        message_content: campaign.message_content,
        status: 'draft',
        instance_id: campaign.instance_id,
        image_url: campaign.image_url,
        image_template_id: campaign.image_template_id,
        has_image: campaign.has_image,
        template_id: campaign.template_id,
        mapping_mode: campaign.mapping_mode
      });
      await refetchCampaigns();
      toast.success('Campanha duplicada com sucesso');
    } catch (error) {
      toast.error('Erro ao duplicar campanha');
    }
  };

  const handleRefreshData = async () => {
    try {
      await refetchCampaigns();
      toast.success('Dados atualizados com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar dados');
    }
  };

  const handleDeleteCampaign = async (campaign: any) => {
    if (confirm(`Tem certeza que deseja excluir a campanha "${campaign.name}"?`)) {
      try {
        await deleteCampaign.mutateAsync(campaign.id);
        toast.success('Campanha excluída com sucesso');
      } catch (error) {
        toast.error('Erro ao excluir campanha');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <div className="text-lg text-muted-foreground">Carregando campanhas...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar campanhas: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Acompanhe suas campanhas e envios
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedInstance} onValueChange={setSelectedInstance}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Todas as instâncias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Todas as instâncias
                </div>
              </SelectItem>
              {instances?.map((instance) => (
                <SelectItem key={instance.id} value={instance.instance_label}>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      instance.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                    )} />
                    {instance.instance_label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshData}
            disabled={isLoading || isAnalyticsLoading}
          >
            <RefreshCw className={cn(
              "h-4 w-4 mr-2", 
              (isLoading || isAnalyticsLoading) && "animate-spin"
            )} />
            Atualizar
          </Button>
          
          <Button onClick={() => navigate('/campaigns')}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Campanha
          </Button>
        </div>
      </div>

      {/* Response Analytics Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Resposta por Dia da Semana</CardTitle>
            <CardDescription>
              Percentual de respostas recebidas por dia da semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAnalyticsLoading ? (
              <ChartLoadingState />
            ) : (
              <ChartContainer
                config={{
                  rate: {
                    label: "Taxa de Resposta (%)",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-[220px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={mockAnalytics.responsesByWeekday}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={true}
                      tickLine={true}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis hide />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      formatter={(value: number) => [
                        `${value.toFixed(1)}%`,
                        "Taxa de Resposta"
                      ]}
                    />
                    <Bar 
                      dataKey="rate" 
                      fill="hsl(var(--primary))" 
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taxa de Resposta por Horário</CardTitle>
            <CardDescription>
              Percentual de respostas recebidas por faixa de horário
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAnalyticsLoading ? (
              <ChartLoadingState />
            ) : (
              <ChartContainer
                config={{
                  rate: {
                    label: "Taxa de Resposta (%)",
                    color: "hsl(var(--secondary))",
                  },
                }}
                className="h-[220px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={mockAnalytics.responsesByTimeSlot}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="timeSlot" 
                      axisLine={true}
                      tickLine={true}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis hide />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      formatter={(value: number) => [
                        `${value.toFixed(1)}%`,
                        "Taxa de Resposta"
                      ]}
                    />
                    <Bar 
                      dataKey="rate" 
                      fill="hsl(var(--secondary))" 
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>


      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="pl-10"
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateRange?.from && !dateRange?.to && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yy")} - {format(dateRange.to, "dd/MM/yy")}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy")
                  )
                ) : (
                  "Selecionar período"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {(searchName !== '' || selectedInstance !== 'all' || dateRange?.from || dateRange?.to) && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchName('');
                setSelectedInstance('all');
                setDateRange(undefined);
                setFilter('all');
                setSortBy('date');
                setSortOrder('desc');
                setCurrentPage(1);
              }}
            >
              Limpar filtros
            </Button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('all')}
            >
              <Filter className="h-4 w-4 mr-2" />
              Todas ({stats.total})
            </Button>
            <Button 
              variant={filter === 'draft' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('draft')}
            >
              Rascunhos ({stats.draft})
            </Button>
            <Button 
              variant={filter === 'scheduled' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('scheduled')}
            >
              Agendadas ({stats.scheduled})
            </Button>
            <Button 
              variant={filter === 'completed' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Concluídas ({stats.completed})
            </Button>
          </div>

          <div className="flex gap-2 items-center">
            <Select value={sortBy} onValueChange={(value: 'date' | 'status') => setSortBy(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Data
                  </div>
                </SelectItem>
                <SelectItem value="status">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Status
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}
            </Button>
          </div>
        </div>
      </div>

      {!campaigns || campaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {filter === 'all' ? 'Nenhuma campanha encontrada' : `Nenhuma campanha ${filter} encontrada`}
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              {filter === 'all' 
                ? 'Você ainda não criou nenhuma campanha. Clique em "Nova Campanha" para começar.'
                : `Altere o filtro ou crie uma nova campanha.`
              }
            </p>
            <Button onClick={() => navigate('/campaigns')} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              {filter === 'all' ? 'Criar Primeira Campanha' : 'Nova Campanha'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginatedCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onView={handleViewCampaign}
                onEdit={handleEditCampaign}
                onRename={handleRenameCampaign}
                onDuplicate={handleDuplicateCampaign}
                onDelete={handleDeleteCampaign}
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (totalPages <= 7) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  }
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default CampaignsDashboard;
