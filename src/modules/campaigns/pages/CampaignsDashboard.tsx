import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaigns, useUpdateCampaign, useDeleteCampaign, useCreateCampaign } from '../hooks/useCampaigns';
import { useInstances } from '../hooks/useInstances';
import { useCheckRateLimit } from '../hooks/useRateLimit';
import { useResponseAnalytics } from '../hooks/useResponseAnalytics';
import { CampaignCard } from '../components/CampaignCard';
import { ChartLoadingState } from '../components/ChartLoadingState';
import UserHeader from '../components/UserHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar as CalendarIcon,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const CampaignsDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInstance, setSelectedInstance] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<any>(null);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const itemsPerPage = 12;

  // Hooks
  const { data: campaigns = [], isLoading, refetch } = useCampaigns();
  const { data: instances = [] } = useInstances();
  const updateCampaign = useUpdateCampaign();
  const deleteCampaign = useDeleteCampaign();
  const createCampaign = useCreateCampaign();
  const { getRemainingDispatches } = useCheckRateLimit();
  const { data: responseAnalytics, isLoading: isAnalyticsLoading, refetch: refetchAnalytics } = useResponseAnalytics(dateRange, selectedInstance);

  const remainingDispatches = getRemainingDispatches();

  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesInstance = selectedInstance === 'all' || campaign.instance_label === selectedInstance;
    return matchesSearch && matchesStatus && matchesInstance;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCampaigns = filteredCampaigns.slice(startIndex, startIndex + itemsPerPage);

  // Stats
  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'processing').length,
    completed: campaigns.filter(c => c.status === 'completed').length,
    scheduled: campaigns.filter(c => c.status === 'scheduled').length,
  };

  // Handlers
  const handleView = (campaign: any) => {
    navigate(`/campaigns/campaign/${campaign.id}`);
  };

  const handleEdit = (campaign: any) => {
    navigate(`/?edit=${campaign.id}`);
  };

  const handleRename = async (campaign: any, newName: string) => {
    try {
      await updateCampaign.mutateAsync({
        id: campaign.id,
        name: newName,
      });
      toast.success('Campanha renomeada com sucesso!');
      refetch();
    } catch (error) {
      toast.error('Erro ao renomear campanha');
    }
  };

  const handleDuplicate = async (campaign: any) => {
    try {
      await createCampaign.mutateAsync({
        name: `${campaign.name} (Cópia)`,
        instance_label: campaign.instance_label,
        message_content: campaign.message_content,
        template_id: campaign.template_id,
        status: 'draft',
      });
      toast.success('Campanha duplicada com sucesso!');
      refetch();
    } catch (error) {
      toast.error('Erro ao duplicar campanha');
    }
  };

  const handleDelete = (campaign: any) => {
    setCampaignToDelete(campaign);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!campaignToDelete) return;

    try {
      await deleteCampaign.mutateAsync(campaignToDelete.id);
      toast.success('Campanha excluída com sucesso!');
      setDeleteDialogOpen(false);
      setCampaignToDelete(null);
      refetch();
    } catch (error) {
      toast.error('Erro ao excluir campanha');
    }
  };

  useEffect(() => {
    refetchAnalytics();
  }, [dateRange, selectedInstance]);

  return (
    <div className="min-h-screen bg-background">
      <UserHeader />
      
      <div className="container mx-auto p-6 space-y-6">
        {/* Rate Limit Alert */}
        {remainingDispatches.daily < 100 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Atenção: Você tem apenas {remainingDispatches.daily} disparos restantes hoje 
              e {remainingDispatches.monthly} no mês.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Ativas</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{stats.active}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Concluídas</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.completed}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Agendadas</CardDescription>
              <CardTitle className="text-3xl text-orange-600">{stats.scheduled}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Response by Weekday */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Taxa de Resposta por Dia da Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isAnalyticsLoading ? (
                <ChartLoadingState />
              ) : (
                <ChartContainer
                  config={{
                    rate: {
                      label: "Taxa de Resposta",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[220px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={responseAnalytics?.responsesByWeekday || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="rate" fill="var(--color-rate)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          {/* Response by Time Slot */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Taxa de Resposta por Período
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isAnalyticsLoading ? (
                <ChartLoadingState />
              ) : (
                <ChartContainer
                  config={{
                    rate: {
                      label: "Taxa de Resposta",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[220px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={responseAnalytics?.responsesByTimeSlot || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timeSlot" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="rate" fill="var(--color-rate)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <CardTitle>Minhas Campanhas</CardTitle>
                <CardDescription>Gerencie suas campanhas de WhatsApp</CardDescription>
              </div>
              <Button onClick={() => navigate('/campaigns')}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Campanha
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar campanhas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="scheduled">Agendada</SelectItem>
                  <SelectItem value="processing">Enviando</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedInstance} onValueChange={setSelectedInstance}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Instância" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {instances.map((instance) => (
                    <SelectItem key={instance.id} value={instance.instance_label}>
                      {instance.instance_label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full md:w-[240px]">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, 'dd/MM/yy')} - {format(dateRange.to, 'dd/MM/yy')}
                        </>
                      ) : (
                        format(dateRange.from, 'dd/MM/yyyy')
                      )
                    ) : (
                      'Selecionar período'
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={dateRange.from && dateRange.to ? dateRange as any : undefined}
                    onSelect={(range: any) => setDateRange(range || {})}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== 'all' || selectedInstance !== 'all'
                  ? 'Nenhuma campanha encontrada com os filtros selecionados.'
                  : 'Você ainda não tem campanhas. Crie sua primeira campanha!'}
              </p>
              {!searchQuery && statusFilter === 'all' && selectedInstance === 'all' && (
                <Button onClick={() => navigate('/campaigns')} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Campanha
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onView={handleView}
                  onEdit={handleEdit}
                  onRename={handleRename}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a campanha "{campaignToDelete?.name}"? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignsDashboard;
