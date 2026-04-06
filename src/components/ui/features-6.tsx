import { Cpu, Lock, Sparkles, Zap, PenTool, Search, Calendar, BarChart3 } from 'lucide-react'

export function Features() {
    return (
        <section className="pt-8 pb-16 md:pt-12 md:pb-32">
            <div className="mx-auto max-w-5xl space-y-12 px-6">
                <div className="relative z-10 grid items-center gap-4 md:grid-cols-2 md:gap-12">
                    <h2 className="text-4xl font-semibold text-[#08080C]">Ecossistema completo de criação e gestão de conteúdo</h2>
                    <p className="max-w-sm sm:ml-auto text-[#6B7280]">Automatize sua produção de conteúdo com IA, publique em múltiplos canais e acompanhe os resultados em tempo real.</p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-[#37489d]/5 to-[#37489d]/10 rounded-2xl p-6 border border-[#37489d]/10">
                        <div className="w-10 h-10 rounded-xl bg-[#37489d] flex items-center justify-center mb-4">
                            <PenTool className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#08080C] mb-2">Editor com IA</h3>
                        <p className="text-sm text-[#6B7280] leading-relaxed">Escreva artigos completos com assistência de IA. Sugestões de títulos, estrutura e palavras-chave em tempo real.</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-6 border border-amber-200/30">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center mb-4">
                            <Search className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#08080C] mb-2">SEO Automático</h3>
                        <p className="text-sm text-[#6B7280] leading-relaxed">Otimização automática para buscadores. Meta tags, headings e keywords gerados pela IA para cada conteúdo.</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-6 border border-emerald-200/30">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center mb-4">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#08080C] mb-2">Calendário Editorial</h3>
                        <p className="text-sm text-[#6B7280] leading-relaxed">Planeje, agende e publique conteúdo para blog e redes sociais. Visão completa da sua estratégia.</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 border border-purple-200/30">
                        <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center mb-4">
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#08080C] mb-2">Analytics Integrado</h3>
                        <p className="text-sm text-[#6B7280] leading-relaxed">Acompanhe visualizações, engajamento e conversões. Descubra qual conteúdo performa melhor.</p>
                    </div>
                </div>

                <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Zap className="size-4 text-[hsl(224,47%,42%)]" />
                            <h3 className="text-sm font-medium text-[#08080C]">Rápido</h3>
                        </div>
                        <p className="text-[#6B7280] text-sm">Gere artigos completos em minutos com IA treinada para marketing de conteúdo.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Cpu className="size-4 text-[hsl(224,47%,42%)]" />
                            <h3 className="text-sm font-medium text-[#08080C]">Poderoso</h3>
                        </div>
                        <p className="text-[#6B7280] text-sm">SEO automático, calendário editorial e publicação em múltiplos canais integrados.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Lock className="size-4 text-[hsl(224,47%,42%)]" />
                            <h3 className="text-sm font-medium text-[#08080C]">Confiável</h3>
                        </div>
                        <p className="text-[#6B7280] text-sm">Conteúdo revisado e validado com checagem de originalidade e qualidade.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4 text-[hsl(224,47%,42%)]" />
                            <h3 className="text-sm font-medium text-[#08080C]">IA Integrada</h3>
                        </div>
                        <p className="text-[#6B7280] text-sm">Automação inteligente que aprende seu tom de voz e melhora seus resultados.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
