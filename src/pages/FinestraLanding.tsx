import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGroup } from "motion/react";
import { Button } from "@/components/ui/button";
import { Play, Star, ChevronRight, TrendingUp, Shield, Zap } from "lucide-react";
import finestraLogo from "@/assets/finestra-logo.png";
import DisplayCards from "@/components/ui/display-cards";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { TiltedScroll } from "@/components/ui/tilted-scroll";
import { StarBorder } from "@/components/ui/star-border";
import { Sparkles } from "@/components/ui/sparkles";
import { Features } from "@/components/ui/features-6";
import { TextRotate } from "@/components/ui/text-rotate";
import { supabase } from "@/integrations/supabase/client";
export default function FinestraLanding() {
  const [titleNumber, setTitleNumber] = useState(0);
  const [campaignCount, setCampaignCount] = useState(0);
  const titles = useMemo(
    () => ["+Inteligente", "+lucrativo", "+simples", "+personalizado", "+estratégico"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  // Subscribe to campaign counter updates
  useEffect(() => {
    const fetchInitialCount = async () => {
      const { data, error } = await supabase
        .from('campaign_counter')
        .select('count')
        .single();
      
      if (data && !error) {
        setCampaignCount(data.count);
      }
    };

    fetchInitialCount();

    const channel = supabase
      .channel('campaign-counter-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'campaign_counter'
        },
        (payload) => {
          setCampaignCount(payload.new.count);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const testimonials = [
    {
      text: "This platform revolutionized our financial operations, streamlining everything. The cloud-based system keeps us productive, even remotely.",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      name: "Briana Patton",
      role: "Operations Manager",
    },
    {
      text: "Implementation was smooth and quick. The customizable, user-friendly interface made team training effortless and efficient.",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      name: "Bilal Ahmed",
      role: "IT Manager",
    },
    {
      text: "The support team is exceptional, guiding us through setup and providing ongoing assistance, ensuring our complete satisfaction.",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      name: "Saman Malik",
      role: "Customer Support Lead",
    },
    {
      text: "Seamless integration enhanced our business operations and efficiency significantly. Highly recommend for its intuitive interface.",
      image: "https://randomuser.me/api/portraits/men/4.jpg",
      name: "Omar Raza",
      role: "CEO",
    },
    {
      text: "Robust features and quick support have transformed our workflow, making us significantly more efficient in daily operations.",
      image: "https://randomuser.me/api/portraits/women/5.jpg",
      name: "Zainab Hussain",
      role: "Project Manager",
    },
    {
      text: "The smooth implementation exceeded expectations. It streamlined processes, improving overall business performance dramatically.",
      image: "https://randomuser.me/api/portraits/women/6.jpg",
      name: "Aliza Khan",
      role: "Business Analyst",
    },
    {
      text: "Our business functions improved with a user-friendly design and we received overwhelmingly positive customer feedback.",
      image: "https://randomuser.me/api/portraits/men/7.jpg",
      name: "Farhan Siddiqui",
      role: "Marketing Director",
    },
    {
      text: "They delivered a solution that exceeded expectations, understanding our needs perfectly and enhancing our operations.",
      image: "https://randomuser.me/api/portraits/women/8.jpg",
      name: "Sana Sheikh",
      role: "Sales Manager",
    },
    {
      text: "Using this platform, our online presence and conversions significantly improved, boosting overall business performance.",
      image: "https://randomuser.me/api/portraits/men/9.jpg",
      name: "Hassan Ali",
      role: "E-commerce Manager",
    },
  ];

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  return <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-white/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img src={finestraLogo} alt="Finestra" className="h-8 w-auto" />
        </div>

        <div className="hidden md:flex items-center gap-6 px-3 py-1.5 rounded-full bg-white/40 backdrop-blur-sm border border-gray-200/50">
          <a href="#" className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(224,47%,42%)] text-white text-sm font-medium">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M3.29461 7.1756L8.68125 2.95574C9.45692 2.34809 10.5431 2.34809 11.3188 2.95574L16.7054 7.1756C17.3203 7.65731 17.4911 8.37427 17.4997 9.20295C17.5001 9.24787 17.4987 9.29129 17.4953 9.33608C17.4604 9.7957 17.2195 12.6041 16.3291 15.757C16.0145 16.6346 15.2741 17.5 14.2555 17.5H5.74446C4.72592 17.5 3.98558 16.6346 3.67092 15.757C2.78052 12.6041 2.53958 9.79569 2.50473 9.33608C2.50134 9.29129 2.49988 9.24787 2.50034 9.20295C2.5089 8.37427 2.67971 7.65731 3.29461 7.1756Z" stroke="white" strokeWidth="1.5" />
            </svg>
            Home
          </a>
          <a href="#" className="text-gray-700 text-sm hover:text-gray-900 transition-colors">About Us</a>
          <a href="#" className="text-gray-700 text-sm hover:text-gray-900 transition-colors">Reviews</a>
          <a href="#" className="text-gray-700 text-sm hover:text-gray-900 transition-colors">Procedures</a>
          <a href="#" className="text-gray-700 text-sm hover:text-gray-900 transition-colors">Blog</a>
        </div>

        <div className="flex items-center gap-6">
          <button className="px-4 py-1.5 rounded-full border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 transition-colors">
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-br from-[#D4EFF4]/30 via-[#F9C7B2]/20 to-[#F9B2D4]/20 rounded-[32px] mx-5 mt-[83px]">
        <div className="relative max-w-5xl mx-auto px-8 z-10">
          <div className="flex flex-col items-center text-center gap-8 max-w-[781px] mx-auto mb-12">
            <h1 className="text-5xl md:text-7xl lg:text-[100px] font-medium leading-[100%] tracking-tight text-[#08080C]">
              <span>Whatsapp Comercial 10x</span>
              <span className="relative inline-block min-w-[200px] md:min-w-[300px] text-center md:pb-4 md:pt-1" style={{ height: '1.2em' }}>
                &nbsp;
                <AnimatePresence mode="wait">
                  <motion.span
                    key={titleNumber}
                    className="absolute left-0 right-0 font-semibold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {titles[titleNumber]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
            <p className="text-lg text-[#08080C] opacity-80 max-w-[566px]">
              A ferramenta de campanhas de disparo de whatsapp em massa que substitui todas as outras. Comece grátis agora mesmo
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
            <StarBorder color="hsl(224, 47%, 42%)" speed="8s">
              Get Started Free
            </StarBorder>
            <StarBorder 
              color="hsl(41, 100%, 58%)" 
              speed="10s"
              className="flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Watch A Demo
            </StarBorder>
          </div>

          <div className="flex items-center justify-center gap-5 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium text-[#08080C]">
                Campanhas criadas: {campaignCount.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-[hsl(41,100%,58%)] text-[hsl(41,100%,58%)]" />)}
              </div>
              <span className="text-base font-medium text-[#08080C]">+100</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-8">
            <span className="text-[#6B7280] text-lg font-medium">
              Trusted by experts.
            </span>
            <br />
            <span className="text-[#08080C] text-lg font-medium">
              Used by the leaders.
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-[#08080C] mb-8">
            <div className="flex items-center justify-center">
              <svg viewBox="0 0 120 40" fill="currentColor" className="w-full h-8">
                <text x="10" y="25" fontSize="18" fontWeight="600">Circooles</text>
              </svg>
            </div>
            <div className="flex items-center justify-center">
              <svg viewBox="0 0 120 40" fill="currentColor" className="w-full h-8">
                <text x="10" y="25" fontSize="18" fontWeight="600">Quotient</text>
              </svg>
            </div>
            <div className="flex items-center justify-center">
              <svg viewBox="0 0 120 40" fill="currentColor" className="w-full h-8">
                <text x="10" y="25" fontSize="18" fontWeight="600">Hourglass</text>
              </svg>
            </div>
            <div className="flex items-center justify-center">
              <svg viewBox="0 0 120 40" fill="currentColor" className="w-full h-8">
                <text x="15" y="25" fontSize="18" fontWeight="600">Catalog</text>
              </svg>
            </div>
            <div className="flex items-center justify-center col-span-2 md:col-span-1">
              <svg viewBox="0 0 120 40" fill="currentColor" className="w-full h-8">
                <text x="20" y="25" fontSize="18" fontWeight="600">Layers</text>
              </svg>
            </div>
          </div>
        </div>

        <div className="relative h-64 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]">
          <div className="absolute inset-0 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,hsl(224,47%,42%),transparent_70%)] before:opacity-40" />
          <div className="absolute -left-1/2 top-1/2 aspect-[1/0.7] z-10 w-[200%] rounded-[100%] border-t border-[#08080C]/20 bg-white" />
          <Sparkles
            density={1200}
            className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
            color="#000000"
          />
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Manage Money Wisely Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-[649px]">
              <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C] mb-6">
                Manage money wisely
              </h2>
              <p className="text-lg font-medium text-[#6B7280] leading-[170%]">
                Master the Art of Financial Management: Strategies and Tools to Optimize Your Budget, Build Wealth, and Secure a Stable Financial Future
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <StarBorder color="hsl(224, 47%, 42%)" speed="8s">
                Get Started Free
              </StarBorder>
              <p className="text-base font-medium text-[#6B7280] capitalize">
                explore more about us
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-3xl bg-[#F6F6F6] p-8 md:p-14">
              <div className="bg-white rounded-3xl p-6 mb-8">
                <p className="text-base text-[#000] mb-4">Connected Account</p>
                <div className="bg-[#F6F8FA] rounded-lg p-3">
                  <p className="text-sm font-medium text-[#08080C] mb-2">USD Account</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-base font-medium text-[#08080C]">Visa</p>
                      <p className="text-xs font-semibold text-[#6B7280]">**** ****   ****  1990</p>
                    </div>
                    <p className="text-xl font-medium tracking-[-0.8px]">
                      <span className="text-[#08080C]">$28,390.</span>
                      <span className="text-[#6B7280]">20</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6">
                <p className="text-base text-[#000] mb-4">Expense Breakdown</p>
                <div className="flex gap-4">
                  <div>
                    <p className="text-xs font-medium text-[#6B7280] mb-1">Subscriptions</p>
                    <p className="text-sm font-medium text-[#000]">65.8%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-[#F6F6F6] p-6">
              <h3 className="text-[28px] font-normal capitalize text-[#08080C] mb-6">Quick Transfer</h3>
              <div className="flex gap-4 mb-6">
                <button className="px-3 py-2 rounded-full bg-[hsl(224,47%,42%)]/20 text-[#08080C] text-lg font-medium">
                  Contacts
                </button>
                <button className="text-lg font-medium text-[#08080C]">All</button>
              </div>
              <div className="flex gap-4 mb-8">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full border border-dashed border-[#898989] mb-2 flex items-center justify-center">
                    <span className="text-2xl">+</span>
                  </div>
                  <p className="text-lg capitalize text-[#08080C]">Add New</p>
                </div>
              </div>
              <div className="border-t border-[rgba(8,8,12,0.16)] pt-6">
                <div className="flex justify-between items-end">
                  <p className="text-4xl md:text-[56px] font-medium leading-[26px] tracking-[-2px]">
                    <span className="text-[rgba(33,33,33,0.6)]">$349.</span>
                    <span className="text-[rgba(33,33,33,0.6)]">00</span>
                  </p>
                  <StarBorder color="hsl(41, 100%, 58%)" speed="7s">
                    Send
                  </StarBorder>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Reasons Section */}
      <section className="py-24 bg-[#F8F8F8] rounded-3xl mx-5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8">
            <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C] max-w-[600px]">
              Key Reasons to Choose Us
            </h2>
            <p className="text-lg font-medium text-[#6B7280] leading-[150%] max-w-[363px]">
              Whatever your customers' payment preferences, we'll help you find the right solution for your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-6">
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-[hsl(224,47%,42%)]/10 mb-4">
                <div className="w-6 h-6 rounded-full bg-[hsl(224,47%,42%)]"></div>
                <span className="text-base font-medium text-[hsl(224,47%,42%)]">Customers</span>
              </div>
              <div className="flex items-start mb-8">
                <span className="text-6xl md:text-[100px] font-normal leading-[120%] tracking-tight text-[#1F2937]">20K</span>
                <span className="text-3xl md:text-[50px] font-medium leading-[120%] tracking-tight text-[#1F2937]">+</span>
              </div>
              <p className="text-lg font-normal text-[#6B7280] leading-[150%] capitalize">
                In 38 countries, we work as one global team to help clients
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6">
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-[hsl(41,100%,58%)]/10 mb-4">
                <div className="w-6 h-6 rounded-full bg-[hsl(41,100%,58%)]"></div>
                <span className="text-base font-medium text-[hsl(41,100%,58%)]">Impact</span>
              </div>
              <div className="flex items-start mb-8">
                <span className="text-6xl md:text-[100px] font-normal leading-[120%] tracking-tight text-[#1F2937]">98</span>
                <span className="text-3xl md:text-[40px] font-medium leading-[120%] tracking-tight text-[#1F2937]">%</span>
              </div>
              <p className="text-lg font-normal text-[#6B7280] leading-[150%] capitalize">
                We have worked with 89% of the Global 500 companies.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6">
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-[hsl(224,47%,42%)]/10 mb-4">
                <div className="w-6 h-6 rounded-full bg-[hsl(224,47%,42%)]"></div>
                <span className="text-base font-medium text-[hsl(224,47%,42%)]">Experience</span>
              </div>
              <div className="flex items-start mb-8">
                <span className="text-6xl md:text-[100px] font-normal leading-[120%] tracking-tight text-[#1F2937]">89</span>
                <span className="text-3xl md:text-[40px] font-medium leading-[120%] tracking-tight text-[#1F2937]">%</span>
              </div>
              <p className="text-lg font-normal text-[#6B7280] leading-[150%] capitalize">
                We started with a rebellious mindset and set ourselves the challenge
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Display Cards Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C] mb-6">
              Discover Our Features
            </h2>
            <p className="text-lg font-medium text-[#6B7280] leading-[170%] max-w-[600px] mx-auto">
              Experience the power of smart financial management with our innovative solutions
            </p>
          </div>
          <div className="flex justify-center items-center min-h-[400px]">
            <DisplayCards
              cards={[
                {
                  icon: <TrendingUp className="size-4 text-emerald-300" />,
                  title: "Growth",
                  description: "Maximize your investments",
                  date: "Active",
                  iconClassName: "text-emerald-500",
                  titleClassName: "text-emerald-500",
                  className:
                    "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
                },
                {
                  icon: <Shield className="size-4 text-blue-300" />,
                  title: "Security",
                  description: "Bank-level protection",
                  date: "24/7",
                  iconClassName: "text-blue-500",
                  titleClassName: "text-blue-500",
                  className:
                    "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
                },
                {
                  icon: <Zap className="size-4 text-amber-300" />,
                  title: "Speed",
                  description: "Instant transactions",
                  date: "Real-time",
                  iconClassName: "text-amber-500",
                  titleClassName: "text-amber-500",
                  className:
                    "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-24 bg-[#F8F8F8] rounded-3xl mx-5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C] mb-6">
              Platform Attributes
            </h2>
            <p className="text-lg font-medium text-[#6B7280] leading-[170%] max-w-[600px] mx-auto">
              Everything you need to manage your finances efficiently and securely
            </p>
          </div>
          <TiltedScroll
            items={[
              { id: "1", text: "Real-time Analytics" },
              { id: "2", text: "Multi-currency Support" },
              { id: "3", text: "Automated Reporting" },
              { id: "4", text: "Bank-level Security" },
              { id: "5", text: "Mobile First Design" },
              { id: "6", text: "24/7 Customer Support" },
              { id: "7", text: "Smart Budgeting Tools" },
              { id: "8", text: "Easy Integration" },
            ]}
            className="mt-8"
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 text-center mb-16">
          <div className="flex flex-wrap justify-center gap-8 md:gap-20 mb-8">
            <span className="text-lg font-medium text-[#344054]">Our Customers</span>
            <span className="text-lg font-medium text-[#344054]">Talk About IT</span>
            <span className="text-lg font-medium text-[#344054]">Better Than Us</span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-[72px] font-medium leading-[100%] tracking-tight text-[#08080C] mb-8 max-w-[687px] mx-auto">
            Hear What Customer Have to Say
          </h2>
          <p className="text-lg font-normal text-[#6B7280] leading-[150%] capitalize max-w-[467px] mx-auto">
            See your whole financial picture in one place, alongside a smarter approach to investing and real human.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#F0E6E0] rounded-xl p-8">
              <div className="flex gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-black/20"></div>
                <div>
                  <p className="text-xl font-medium text-[#08080C] mb-1">Megan</p>
                  <p className="text-base text-[#656565]">Student at New York University</p>
                </div>
              </div>
              <p className="text-base text-[#08080C] leading-[150%]">
                "This cup is fantastic! It is so well insulated. I live in the desert, and it keeps my cold drinks cold in the heat"
              </p>
            </div>

            <div className="bg-[#F0E6E0] rounded-xl p-8">
              <div className="flex gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-black/20"></div>
                <div>
                  <p className="text-xl font-medium text-[#08080C] mb-1">Jerry Tang</p>
                  <p className="text-base text-[#656565]">Recent graduate, Marketing at Sweatpals</p>
                </div>
              </div>
              <p className="text-base text-[#08080C] leading-[170%]">
                "Joining Mate community is the best thing I have ever done. The projects I worked on gave me the experience I needed in content Marketing"
              </p>
            </div>

            <div className="bg-[#F0E6E0] rounded-xl p-8">
              <div className="flex gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-black/20"></div>
                <div>
                  <p className="text-xl font-medium text-[#08080C] mb-1">David K.</p>
                  <p className="text-base text-[#656565]">Recent graduate</p>
                </div>
              </div>
              <p className="text-base text-[#08080C] leading-[150%]">
                "I absolutely love this cup. I've bought several different brands and there's always something"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Testimonials Section */}
      <section className="bg-white py-20 relative">
        <div className="container z-10 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
          >
            <div className="flex justify-center">
              <div className="border py-1 px-4 rounded-lg bg-white">Testimonials</div>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5 text-[#08080C]">
              What our users say
            </h2>
            <p className="text-center mt-5 opacity-75 text-[#6B7280]">
              See what our customers have to say about us.
            </p>
          </motion.div>

          <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
            <TestimonialsColumn testimonials={firstColumn} duration={15} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white rounded-t-[40px] pt-24 pb-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-24 gap-8">
            <LayoutGroup>
              <h2 className="text-4xl md:text-6xl lg:text-[80px] font-medium leading-[100%] tracking-tight text-[#08080C] flex whitespace-pre">
                <span>Let's Sit </span>
                <TextRotate
                  texts={["&Talk", "&Chat", "&Connect", "&Grow"]}
                  mainClassName="overflow-hidden"
                  staggerFrom="last"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.025}
                  splitLevelClassName="overflow-hidden"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={2500}
                />
              </h2>
            </LayoutGroup>
            <div className="w-full lg:w-[469px]">
              <div className="flex items-center justify-between mb-9">
                <input type="email" placeholder="Enter Your Email" className="text-2xl md:text-[40px] font-normal leading-[120%] tracking-tight text-[#1F2937] opacity-20 bg-transparent border-none outline-none flex-1" />
                <ChevronRight className="w-10 h-10 text-[#1F2937]" />
              </div>
              <div className="h-px bg-[#6B7280]"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-normal text-[#1F2937] mb-6">Address</h3>
              <p className="text-lg font-normal text-[#1F2937] leading-[150%] capitalize">
                475 Cherry Dr, Troy, Michigan 48083 United States ( (248) 823-3200 )
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-[#1F2937] mb-6">Company</h3>
              <div className="flex flex-col gap-4">
                <a href="#" className="text-base text-[#6B7280] hover:text-[#1F2937]">About</a>
                <a href="#" className="text-base text-[#6B7280] hover:text-[#1F2937]">Pricing</a>
                <a href="#" className="text-base text-[#6B7280] hover:text-[#1F2937]">Jobs</a>
                <a href="#" className="text-base text-[#6B7280] hover:text-[#1F2937]">Blog</a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-[#1F2937] mb-6">Product</h3>
              <div className="flex flex-col gap-4">
                <a href="#" className="text-base text-[#6B7280] hover:text-[#1F2937]">Sales Software</a>
                <a href="#" className="text-base text-[#6B7280] hover:text-[#1F2937]">Marketplace</a>
                <a href="#" className="text-base text-[#6B7280] hover:text-[#1F2937]">Terms & Conditions</a>
                <a href="#" className="text-base text-[#6B7280] hover:text-[#1F2937]">Privacy Policy</a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-[#1F2937] mb-6">Help Center</h3>
              <div className="flex flex-col gap-4">
                <a href="#" className="text-base text-[#6B7280] hover:text-[#1F2937]">Community</a>
                <a href="#" className="text-base text-[#6B7280] hover:text-[#1F2937]">Knowledge Base</a>
                <a href="#" className="text-base text-[#6B7280] hover:text-[#1F2937]">Academy</a>
                <a href="#" className="text-base text-[#6B7280] hover:text-[#1F2937]">Support</a>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#6B7280]/20 gap-4">
            <p className="text-base text-[#1F2937]">© 2024 Copyright AdzHub - Marketing Intelligence Platform</p>
            <div className="flex flex-wrap gap-8 justify-center">
              <a href="#" className="text-base text-[#1F2937] hover:text-[#08080C]">Terms</a>
              <a href="#" className="text-base text-center text-[#1F2937] hover:text-[#08080C]">Privacy</a>
              <a href="#" className="text-base text-center text-[#1F2937] hover:text-[#08080C]">Cookies</a>
              <a href="#" className="text-base text-center text-[#1F2937] hover:text-[#08080C]">Legal</a>
              <a href="#" className="text-base text-center text-[#1F2937] hover:text-[#08080C]">Recalls</a>
            </div>
          </div>
        </div>
      </footer>
    </div>;
}