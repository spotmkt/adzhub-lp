import { Link } from "react-router-dom";
import { Zap, FileText, Mail, Shield, Users, Code, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Landing = () => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText("https://api.finestra.com/s/XXXXXXX");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Finestra</span>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link to="#examples" className="text-gray-600 hover:text-gray-900 font-medium">Examples</Link>
              <Link to="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</Link>
              <Link to="#integrations" className="text-gray-600 hover:text-gray-900 font-medium">Integrations</Link>
              <Link to="#docs" className="text-gray-600 hover:text-gray-900 font-medium">Docs</Link>
              <Link to="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</Link>
            </nav>

            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link to="/auth">Login</Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/auth">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm mb-8">
              FORM API
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Receive emails{" "}
              <span className="inline-flex items-center">
                <Zap className="w-12 h-12 md:w-16 md:h-16 text-blue-600 inline" />
              </span>{" "}
              instantly from your website{" "}
              <span className="inline-flex items-center">
                <FileText className="w-12 h-12 md:w-16 md:h-16 text-blue-600 inline" />
              </span>{" "}
              form
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Never worry about the backend of your form again. Create your HTML form,
              connect to our API, get email notifications, block spam, and use
              over 3000 integrations.
            </p>

            {/* Email Input */}
            <div className="flex gap-3 max-w-md mx-auto mb-16">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 px-4 text-base"
              />
              <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </div>

            {/* Dashboard Mockup */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/50 p-8">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6">
                  {/* Browser Bar */}
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex-1 text-center text-sm text-gray-500">
                      finestra.com
                    </div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">My Sweet Form</h3>
                        <span className="text-sm text-gray-500">XXXXXXXX</span>
                      </div>
                      <div className="text-sm text-gray-600">128 Submissions</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="text-sm text-gray-600 mb-2">Your form API endpoint</div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-sm font-mono bg-white px-4 py-2 rounded-lg border border-gray-200">
                        https://finestra.com/s/XXXXXXX
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className="gap-2"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Click to See Magic ✨
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <p className="text-center text-sm font-semibold text-gray-500 mb-8 tracking-wider">
            TRUSTED BY TOP BRANDS WORLDWIDE
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
            <div className="text-2xl font-bold text-gray-400">NBA</div>
            <div className="text-2xl font-bold text-gray-400">Continental</div>
            <div className="text-2xl font-bold text-gray-400">Vixen</div>
            <div className="text-2xl font-bold text-gray-400">Yeezy</div>
            <div className="text-2xl font-bold text-gray-400">Cannes</div>
          </div>
        </div>
      </section>

      {/* Feature Section 1 */}
      <section className="py-24 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-blue-600 font-semibold mb-4">Setup, easy-peasy!</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Easiest way to setup your HTML form.
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Don't worry about emails, spam checking, integrations and form issues ever,
                code your front-end, add your unique URL, and we'll handle the rest.
              </p>
            </div>

            <div className="bg-gray-900 rounded-2xl p-8 text-left">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-green-400" />
                <span className="text-gray-400 text-sm">HTML Form Example</span>
              </div>
              <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`<form action="https://finestra.com/s/{Your Form ID}"
      method="POST" enctype="multipart/form-data">
  <input type="email" name="email">
  
  <textarea name="message"></textarea>
  <button type="submit">Submit</button>
</form>`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Features that you need.
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Use features that normally take days to code, in minutes.
              Integration with your CRM in 2 minutes. Set auto-responses in 2 minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Upload Files</h3>
              <p className="text-gray-600 text-sm">Easy file uploads without configuration</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Email Notifications</h3>
              <p className="text-gray-600 text-sm">Instant email alerts for submissions</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Field Validations</h3>
              <p className="text-gray-600 text-sm">Powerful validation rules built-in</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Auto Responses</h3>
              <p className="text-gray-600 text-sm">Automated responses to your users</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who trust Finestra for their form needs.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Start Building Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-6 text-center">
          <p>© 2025 Finestra. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
