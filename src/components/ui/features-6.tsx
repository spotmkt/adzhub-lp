import { Cpu, Lock, Sparkles, Zap } from 'lucide-react'

export function Features() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl space-y-12 px-6">
                <div className="relative z-10 grid items-center gap-4 md:grid-cols-2 md:gap-12">
                    <h2 className="text-4xl font-semibold text-[#08080C]">The platform ecosystem brings together our features</h2>
                    <p className="max-w-sm sm:ml-auto text-[#6B7280]">Empower your team with workflows that adapt to your needs, whether you prefer automated synchronization or a custom interface.</p>
                </div>
                <div className="relative rounded-3xl p-3 md:-mx-8 lg:col-span-3">
                    <div className="aspect-[88/36] relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#D4EFF4]/30 via-[#F9C7B2]/20 to-[#F9B2D4]/20">
                        <div className="bg-gradient-to-t z-1 from-background absolute inset-0 to-transparent"></div>
                        <div className="absolute inset-0 z-10 flex items-center justify-center">
                            <div className="text-center space-y-4 p-8">
                                <div className="text-6xl font-bold text-[#08080C]/10">Dashboard Preview</div>
                                <div className="grid grid-cols-3 gap-4 mt-8">
                                    <div className="h-32 bg-white/50 rounded-lg"></div>
                                    <div className="h-32 bg-white/50 rounded-lg"></div>
                                    <div className="h-32 bg-white/50 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Zap className="size-4 text-[hsl(224,47%,42%)]" />
                            <h3 className="text-sm font-medium text-[#08080C]">Fast</h3>
                        </div>
                        <p className="text-[#6B7280] text-sm">Lightning-fast performance that keeps your business moving forward.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Cpu className="size-4 text-[hsl(224,47%,42%)]" />
                            <h3 className="text-sm font-medium text-[#08080C]">Powerful</h3>
                        </div>
                        <p className="text-[#6B7280] text-sm">Advanced features helping developers and businesses innovate.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Lock className="size-4 text-[hsl(224,47%,42%)]" />
                            <h3 className="text-sm font-medium text-[#08080C]">Security</h3>
                        </div>
                        <p className="text-[#6B7280] text-sm">Bank-level security protecting your data and transactions.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4 text-[hsl(224,47%,42%)]" />
                            <h3 className="text-sm font-medium text-[#08080C]">AI Powered</h3>
                        </div>
                        <p className="text-[#6B7280] text-sm">Smart automation helping you make better financial decisions.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
