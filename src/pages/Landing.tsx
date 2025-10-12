import { Play, Bell, User, ChevronLeft, Grid3x3, ChevronDown, Plus, MoreVertical } from "lucide-react";

const Landing = () => {
  return (
    <div className="main-container text-gray-800 overflow-x-hidden">
      <div className="container mx-auto px-4 py-6">
        {/* Navigation Bar */}
        <header className="glass-nav rounded-full p-2 sticky top-4 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <a href="#" className="flex items-center gap-2 pl-4">
                <div className="bg-[#F85166] w-8 h-8 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                </div>
                <span className="font-bold text-2xl text-gray-900">Finestra</span>
              </a>
              <nav className="hidden lg:flex items-center bg-gray-100 rounded-full">
                <a href="#" className="py-2 px-5 bg-[#F85166] text-white rounded-full font-semibold">Home</a>
                <a href="#" className="py-2 px-5 text-gray-600 hover:text-gray-900 font-medium">About Us</a>
                <a href="#" className="py-2 px-5 text-gray-600 hover:text-gray-900 font-medium">Reviews</a>
                <a href="#" className="py-2 px-5 text-gray-600 hover:text-gray-900 font-medium">Procedures</a>
                <a href="#" className="py-2 px-5 text-gray-600 hover:text-gray-900 font-medium">Blog</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <div className="w-3 h-3 bg-red-500 rounded-full absolute -top-1 -right-1 border-2 border-white"></div>
                <Bell className="text-gray-500 w-6 h-6" />
              </div>
              <div className="bg-gray-200 w-12 h-6 rounded-full relative cursor-pointer hidden md:flex items-center">
                <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 shadow"></div>
              </div>
              <a href="#" className="hidden md:flex items-center gap-2 bg-gray-100 py-2 px-4 rounded-full font-semibold text-sm">
                <User className="text-gray-500 w-4 h-4" />
                +pro
              </a>
              <a href="#" className="py-2.5 px-6 bg-white border border-gray-300 rounded-full font-semibold hover:bg-gray-50">Sign In</a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="text-center pt-24 pb-16 relative">
          {/* Floating Tag: Finance */}
          <div className="absolute top-28 left-4 sm:left-12 md:left-24 lg:left-36 transform -rotate-12">
            <div className="bg-yellow-100 text-yellow-800 font-semibold px-4 py-1 rounded-full shadow-md">
              Finance
            </div>
            <svg width="40" height="40" viewBox="0 0 100 100" className="absolute -top-6 -right-8 text-gray-800 transform -rotate-45">
              <path d="M 10 50 L 50 10 L 90 50 L 50 90 Z" fill="currentColor" stroke="none" transform="scale(0.3) translate(80, 80)"></path>
              <path d="M 50 50 L 90 90" stroke="currentColor" strokeWidth="5" fill="none"></path>
            </svg>
          </div>

          {/* Floating Tag: Business */}
          <div className="absolute top-16 right-4 sm:right-12 md:right-24 lg:right-36 transform rotate-12">
            <svg width="40" height="40" viewBox="0 0 100 100" className="absolute -bottom-6 -left-8 text-gray-800 transform rotate-45 scale-x-[-1]">
              <path d="M 10 50 L 50 10 L 90 50 L 50 90 Z" fill="currentColor" stroke="none" transform="scale(0.3) translate(80, 80)"></path>
              <path d="M 50 50 L 90 90" stroke="currentColor" strokeWidth="5" fill="none"></path>
            </svg>
            <div className="bg-pink-100 text-pink-800 font-semibold px-4 py-1 rounded-full shadow-md">
              Business
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-gray-900 max-w-4xl mx-auto">
            Make Your Money Work Harder
          </h1>
          <p className="max-w-xl mx-auto text-gray-600 text-lg mt-8 mb-10">
            Initiating a business venture may appear overwhelming, yet our forte lies in simplifying the entire process for you.
          </p>
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <a href="#" className="bg-gray-900 text-white font-semibold py-3 px-6 rounded-full hover:bg-gray-800 transition duration-300">
              Get Started Free
            </a>
            <a href="#" className="bg-white text-gray-900 font-semibold py-3 px-6 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center gap-2 transition duration-300">
              <Play className="w-5 h-5 fill-current" />
              Watch A Demo
            </a>
          </div>
          <div className="flex justify-center items-center gap-4 mt-8">
            <div className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#F85166]" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-bold text-gray-800">Trustpilot</span>
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#F85166]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <div className="text-gray-600 font-medium">3800+ 5 Stars</div>
          </div>
        </main>

        {/* Phone Mockup Section */}
        <div className="flex justify-center items-start -mt-10 mb-10">
          <div className="w-[340px] h-[700px] bg-white rounded-[40px] p-2.5 shadow-2xl phone-mockup border-4 border-gray-200">
            <div className="w-full h-full bg-gray-50 rounded-[30px] overflow-hidden relative">
              {/* Phone Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-200 rounded-b-xl"></div>

              {/* App UI */}
              <div className="p-4 pt-8 text-gray-800">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <ChevronLeft className="w-5 h-5" />
                    <span className="font-semibold text-lg">Dashboard</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5" />
                    <Grid3x3 className="w-5 h-5" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-2">Accounts</h2>

                <div className="flex items-center gap-3 mb-8">
                  <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200">
                    <span className="text-gray-500">**** 874</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  <button className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">+</button>
                  <button className="w-8 h-8 rounded-lg bg-purple-500 text-white flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-gray-500 text-sm">Monthly Income</p>
                      <p className="text-2xl font-bold text-gray-900">$78,821<span className="text-gray-400">.88</span></p>
                    </div>
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="bg-green-100 text-green-700 text-xs font-semibold inline-flex px-2 py-0.5 rounded-full">
                    +1.5%
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-4 opacity-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-gray-500 text-sm">Monthly Experience</p>
                      <p className="text-2xl font-bold text-gray-900">$16,225<span className="text-gray-400">.22</span></p>
                    </div>
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
