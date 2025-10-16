import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Star, ChevronRight } from "lucide-react";
import finestraLogo from "@/assets/finestra-logo.png";
export default function FinestraLanding() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["amazing", "new", "wonderful", "beautiful", "smart"],
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

  return <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <img src={finestraLogo} alt="Finestra" className="h-10 w-auto" />
        </div>

        <div className="hidden md:flex items-center gap-8 px-4 py-2 rounded-full bg-[#0B0B0B] border border-white/[0.08]">
          <a href="#" className="flex items-center gap-2 px-6 py-2 rounded-full bg-[hsl(224,47%,42%)] border border-white/[0.08] text-white text-base font-medium">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3.29461 7.1756L8.68125 2.95574C9.45692 2.34809 10.5431 2.34809 11.3188 2.95574L16.7054 7.1756C17.3203 7.65731 17.4911 8.37427 17.4997 9.20295C17.5001 9.24787 17.4987 9.29129 17.4953 9.33608C17.4604 9.7957 17.2195 12.6041 16.3291 15.757C16.0145 16.6346 15.2741 17.5 14.2555 17.5H5.74446C4.72592 17.5 3.98558 16.6346 3.67092 15.757C2.78052 12.6041 2.53958 9.79569 2.50473 9.33608C2.50134 9.29129 2.49988 9.24787 2.50034 9.20295C2.5089 8.37427 2.67971 7.65731 3.29461 7.1756Z" stroke="white" strokeWidth="1.5" />
            </svg>
            Home
          </a>
          <a href="#" className="text-white text-base">About Us</a>
          <a href="#" className="text-white text-base">Reviews</a>
          <a href="#" className="text-white text-base">Procedures</a>
          <a href="#" className="text-white text-base">Blog</a>
        </div>

        <div className="flex items-center gap-6">
          <button className="px-5 py-2 rounded-full border border-[#08080C]/40 text-[#08080C] text-base">
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-br from-[#D4EFF4]/30 via-[#F9C7B2]/20 to-[#F9B2D4]/20 rounded-[32px] mx-5 mt-[83px]">
        <div className="relative max-w-5xl mx-auto px-8 z-10">
          <div className="flex flex-col items-center text-center gap-8 max-w-[781px] mx-auto mb-12">
            <h1 className="text-5xl md:text-7xl lg:text-[100px] font-medium leading-[100%] tracking-tight text-[#08080C]">
              <span>This is something</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>
            <p className="text-lg text-[#08080C] opacity-80 max-w-[566px]">
              Initiating a business venture may appear overwhelming, yet our forte lies in simplifying the entire process for you.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
            <Button className="px-5 py-[14px] rounded-full bg-black text-white font-medium text-base h-auto hover:bg-black/90">
              Get Started Free
            </Button>
            <Button variant="outline" className="px-5 py-[14px] rounded-full border-[#08080C] text-[#08080C] font-medium text-base h-auto flex items-center gap-2 hover:bg-black/5">
              <Play className="w-6 h-6" />
              Watch A Demo
            </Button>
          </div>

          <div className="flex items-center justify-center gap-5 flex-wrap">
            <div className="flex items-center gap-1">
              <Star className="w-[31px] h-[31px] fill-[hsl(41,100%,58%)] text-[hsl(41,100%,58%)]" />
              <span className="text-lg font-medium text-[#08080C]">Trustpilot</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-[hsl(41,100%,58%)] text-[hsl(41,100%,58%)]" />)}
              </div>
              <span className="text-base font-medium text-[#08080C]">3800+ 5 Stars</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center text-xl font-medium text-[#08080C] mb-8">
            Loved by 25 million+ users
          </p>
          <div className="flex justify-center items-center gap-8 opacity-24 flex-wrap">
            <div className="text-sm text-[#212126]">Circooles</div>
            <div className="text-sm text-[#212126]">Quotient</div>
            <div className="text-sm text-[#212126]">Hourglass</div>
            <div className="text-sm text-[#212126]">Catalog</div>
            <div className="text-sm text-[#212126]">Layers</div>
          </div>
        </div>
      </section>

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
              <Button className="px-4 py-[14px] rounded-full bg-black text-white font-medium text-base h-auto hover:bg-black/90">
                Get Started Free
              </Button>
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
                  <Button className="px-5 py-[14px] rounded-full bg-[hsl(41,100%,58%)] text-[hsl(224,47%,25%)] font-medium text-base h-auto hover:bg-[hsl(41,100%,58%)]/90">
                    Send
                  </Button>
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

      {/* Footer */}
      <footer className="bg-white rounded-t-[40px] pt-24 pb-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-24 gap-8">
            <h2 className="text-4xl md:text-6xl lg:text-[80px] font-medium leading-[100%] tracking-tight text-[#08080C]">
              Let's Sit &Talk
            </h2>
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