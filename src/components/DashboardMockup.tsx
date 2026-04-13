import { BarChart3, FileText, PenTool, Calendar, TrendingUp, Eye, ThumbsUp, Share2 } from "lucide-react";

export function DashboardMockup() {
  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div className="absolute -inset-4 bg-gradient-to-r from-[#37489d]/20 via-[#F9C7B2]/20 to-[#F9B2D4]/20 rounded-[32px] blur-2xl" />

      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Window bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-white rounded-md px-4 py-1 text-xs text-gray-400 border border-gray-200 min-w-[200px] text-center">
              app.adzhub.com.br/seo
            </div>
          </div>
        </div>

        <div className="flex min-h-[340px]">
          {/* Sidebar */}
          <div className="w-48 bg-[#0f1629] p-4 hidden md:flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-7 h-7 rounded-lg bg-[#37489d] flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span className="text-white text-sm font-semibold">AdzHub</span>
            </div>
            <SidebarItem icon={<BarChart3 className="w-4 h-4" />} label="Dashboard" active />
            <SidebarItem icon={<PenTool className="w-4 h-4" />} label="Criar Conteúdo" />
            <SidebarItem icon={<FileText className="w-4 h-4" />} label="Meus Artigos" />
            <SidebarItem icon={<Calendar className="w-4 h-4" />} label="Calendário" />
            <SidebarItem icon={<TrendingUp className="w-4 h-4" />} label="Métricas" />
          </div>

          {/* Main content */}
          <div className="flex-1 p-5 bg-gray-50/50">
            {/* Top stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <StatCard icon={<FileText className="w-4 h-4 text-[#37489d]" />} label="Artigos" value="127" trend="+12%" />
              <StatCard icon={<Eye className="w-4 h-4 text-emerald-500" />} label="Visualizações" value="8.4K" trend="+23%" />
              <StatCard icon={<ThumbsUp className="w-4 h-4 text-amber-500" />} label="Engajamento" value="14.2%" trend="+5%" />
              <StatCard icon={<Share2 className="w-4 h-4 text-purple-500" />} label="Compartilhamentos" value="892" trend="+18%" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Chart area */}
              <div className="md:col-span-2 bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">Performance do Conteúdo</span>
                  <span className="text-xs text-gray-400">Últimos 30 dias</span>
                </div>
                <div className="flex items-end gap-1.5 h-28">
                  {[35, 50, 40, 65, 55, 70, 60, 80, 75, 90, 85, 95].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-[#37489d] to-[#37489d]/60" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>

              {/* Recent posts */}
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <span className="text-sm font-medium text-gray-700 block mb-3">Últimos Artigos</span>
                <div className="space-y-2.5">
                  <PostItem title="Como usar IA para marketing" status="published" views="1.2K" />
                  <PostItem title="5 dicas de SEO para PMEs" status="published" views="890" />
                  <PostItem title="Tendências 2025 em conteúdo" status="draft" views="—" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${active ? 'bg-[#37489d] text-white' : 'text-gray-400 hover:text-gray-200'}`}>
      {icon}
      <span className="truncate">{label}</span>
    </div>
  );
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode; label: string; value: string; trend: string }) {
  return (
    <div className="bg-white rounded-xl p-3 border border-gray-100">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <div className="flex items-end gap-1.5">
        <span className="text-lg font-bold text-gray-800">{value}</span>
        <span className="text-xs text-emerald-500 font-medium mb-0.5">{trend}</span>
      </div>
    </div>
  );
}

function PostItem({ title, status, views }: { title: string; status: string; views: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-700 truncate">{title}</p>
        <p className="text-[10px] text-gray-400">{views} views</p>
      </div>
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
        {status === 'published' ? 'Publicado' : 'Rascunho'}
      </span>
    </div>
  );
}
