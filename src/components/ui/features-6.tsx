import { Cpu, Lock, Sparkles, Zap, PenTool, Search, Calendar, BarChart3 } from 'lucide-react'

export function Features() {
    return (
        <section className="pt-8 pb-16 md:pt-12 md:pb-32">
            <div className="mx-auto max-w-5xl space-y-12 px-6">
                <div className="relative z-10 grid items-center gap-4 md:grid-cols-2 md:gap-12">
                    <h2 className="text-4xl font-semibold text-[#08080C]">Na mesma plataforma</h2>
                    <p className="max-w-sm sm:ml-auto text-[#6B7280]">Nós produzimos e publicamos com método. Você acompanha estratégia, conteúdo e resultados na AdzHub — ferramenta e operação juntas.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-[#37489d]/5 to-[#37489d]/10 rounded-2xl p-6 border border-[#37489d]/10">
                        <div className="w-10 h-10 rounded-xl bg-[#37489d] flex items-center justify-center mb-4">
                            <PenTool className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#08080C] mb-2">Produção com especialistas + IA</h3>
                        <p className="text-sm text-[#6B7280] leading-relaxed">Artigos, capas e metadados feitos no contexto da sua marca — não texto genérico colado de um chat.</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-6 border border-amber-200/30">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center mb-4">
                            <Search className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#08080C] mb-2">SEO e GEO na operação</h3>
                        <p className="text-sm text-[#6B7280] leading-relaxed">Posicionamento no Google e nas recomendações de IAs, com método editorial e priorização por oportunidade.</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-6 border border-emerald-200/30">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center mb-4">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#08080C] mb-2">Calendário sob nossa execução</h3>
                        <p className="text-sm text-[#6B7280] leading-relaxed">Planejamento e publicação no seu site. Você vê o pipeline e aprova — sem virar o time de conteúdo.</p>
                    </div>
                    <div className="bg-gradient-to-br from-sky-50 to-sky-100/50 rounded-2xl p-6 border border-sky-200/30">
                        <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center mb-4">
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#08080C] mb-2">Acompanhamento na plataforma</h3>
                        <p className="text-sm text-[#6B7280] leading-relaxed">Cliques, impressões e evolução do posicionamento no mesmo lugar em que a operação acontece.</p>
                    </div>
                </div>

                <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Zap className="size-4 text-[hsl(224,47%,42%)]" />
                            <h3 className="text-sm font-medium text-[#08080C]">Nós executamos</h3>
                        </div>
                        <p className="text-[#6B7280] text-sm">A operação é nossa. Você acompanha e decide o rumo na plataforma.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Cpu className="size-4 text-[hsl(224,47%,42%)]" />
                            <h3 className="text-sm font-medium text-[#08080C]">Método</h3>
                        </div>
                        <p className="text-[#6B7280] text-sm">SEO, GEO, publicação e leitura de dados no mesmo fluxo operacional.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Lock className="size-4 text-[hsl(224,47%,42%)]" />
                            <h3 className="text-sm font-medium text-[#08080C]">Contexto da marca</h3>
                        </div>
                        <p className="text-[#6B7280] text-sm">Conteúdo alinhado ao posicionamento da empresa, sem genérico de chat aberto.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4 text-[hsl(224,47%,42%)]" />
                            <h3 className="text-sm font-medium text-[#08080C]">Ferramenta + Especialistas</h3>
                        </div>
                        <p className="text-[#6B7280] text-sm">Plataforma para acompanhar; especialistas e IA para executar.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
