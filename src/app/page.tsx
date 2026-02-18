
import Link from "next/link";
import { ArrowRight, BarChart3, Globe, CreditCard, ShieldCheck, Zap, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-white selection:bg-[var(--primary)] selection:text-white overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--primary)] rounded-full blur-[120px] opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[var(--secondary)] rounded-full blur-[120px] opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] bg-[var(--accent)] rounded-full blur-[150px] opacity-10"></div>
        <div className="absolute inset-0 bg-grid-white opacity-20"></div>
      </div>

      <header className="fixed top-0 w-full z-50 glass-panel border-b-0 border-b-[rgba(255,255,255,0.05)]">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link className="flex items-center gap-2" href="/">
            <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="font-bold text-2xl tracking-tighter text-white">FitStack</span>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link className="text-sm font-medium text-gray-300 hover:text-white hover:text-glow transition-all" href="/#features">
              Features
            </Link>
            <Link className="text-sm font-medium text-gray-300 hover:text-white hover:text-glow transition-all" href="/pricing">
              Pricing
            </Link>
            <Link className="text-sm font-medium text-gray-300 hover:text-white hover:text-glow transition-all" href="/terms">
              Terms
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link className="text-sm font-medium text-gray-300 hover:text-white transition-colors" href="/login">
              Login
            </Link>
            <Link
              className="hidden sm:inline-flex h-10 items-center justify-center rounded-full bg-white text-black px-6 text-sm font-bold shadow-lg shadow-[var(--primary-glow)] hover:scale-105 transition-transform"
              href="/signup"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-6 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-[var(--primary)] text-[var(--primary)] text-sm font-medium mb-8 animate-float">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)]"></span>
            </span>
            v2.0 Now Live: Automated Scheduling
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--secondary)] text-glow">Future</span> of <br />
            Gym Management
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-gray-400 mb-10 leading-relaxed">
            Experience the next generation of fitness software.
            Seamlessly integrate members, payments, and AI-driven insights into one powerful operating system.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              className="h-14 px-8 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-bold text-lg flex items-center justify-center gap-2 shadow-[0_0_40px_var(--primary-glow)] hover:scale-105 transition-transform"
              href="/pricing"
            >
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              className="h-14 px-8 rounded-full glass-panel text-white font-bold text-lg flex items-center justify-center hover:bg-white/10 transition-colors"
              href="#features"
            >
              Explore Features
            </Link>
          </div>

        </section>

        {/* Trusted By Section */}
        <section className="mt-24 w-full border-y border-white/5 bg-black/30 backdrop-blur-sm py-12 overflow-hidden">
          <div className="container mx-auto px-6 text-center">
            <p className="text-sm text-gray-500 mb-8 uppercase tracking-widest font-medium">Trusted by elite fitness brands</p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholder Logos - Text for now */}
              {['IRON GYM', 'PULSE FITNESS', 'METABOLIC LAB', 'CORE STUDIOS', 'ZENITH YOGA'].map((brand, i) => (
                <div key={i} className="text-xl font-bold tracking-tighter text-white/40 hover:text-white hover:text-glow cursor-default select-none transition-colors">
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="container mx-auto px-6 py-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for <span className="text-[var(--accent)] text-glow">High Performers</span></h2>
            <p className="text-gray-400 text-lg">See why the fastest-growing gyms run on Nexus.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { quote: "Nexus cut our admin time by 70%. The automated scheduling is a game-changer.", author: "Sarah J.", role: "Owner, Pulse Fitness", rating: 5 },
              { quote: "The best membership platform I've used in 15 years. Members love the portal.", author: "Mike R.", role: "CEO, Iron Gym", rating: 5 },
              { quote: "We scaled from 1 to 5 locations in a year. Nexus made it possible.", author: "Elena V.", role: "Founder, Zenith Yoga", rating: 5 },
            ].map((testimonial, i) => (
              <div key={i} className="glass-panel p-8 rounded-2xl relative">
                <div className="absolute top-8 right-8 text-[var(--primary)] opacity-20">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.896 14.353 15.939 15.025 15.129C15.697 14.319 16.653 13.914 17.893 13.914L17.893 13.485C17.377 13.485 16.9247 13.336 16.536 13.038C16.1473 12.74 15.953 12.158 15.953 11.292L15.953 10.327C15.953 10.029 16.0593 9.77367 16.272 9.561C16.4847 9.34833 16.74 9.242 17.037 9.242L19.52 9.242C19.818 9.242 20.0733 9.34833 20.286 9.561C20.4987 9.77367 20.605 10.029 20.605 10.327L20.605 15.128C20.605 16.1387 20.3923 17.1167 19.967 18.062C19.5417 19.0073 18.9147 19.7827 18.086 20.388C17.2573 20.9933 16.2897 21.296 15.183 21.296L14.931 21.296L14.017 21ZM5.016 21L5.016 18C5.016 16.896 5.35267 15.939 6.026 15.129C6.69933 14.319 7.65533 13.914 8.894 13.914L8.894 13.485C8.378 13.485 7.92567 13.336 7.537 13.038C7.14833 12.74 6.954 12.158 6.954 11.292L6.954 10.327C6.954 10.029 7.06033 9.77367 7.273 9.561C7.48567 9.34833 7.741 9.242 8.038 9.242L10.521 9.242C10.819 9.242 11.0743 9.34833 11.287 9.561C11.5 9.77367 11.606 10.029 11.606 10.327L11.606 15.128C11.606 16.1387 11.3933 17.1167 10.968 18.062C10.5427 19.0073 9.91567 19.7827 9.087 20.388C8.25833 20.9933 7.29067 21.296 6.184 21.296L5.932 21.296L5.016 21Z" /></svg>
                </div>
                <div className="flex gap-1 text-yellow-400 mb-6">
                  {[1, 2, 3, 4, 5].map(s => <span key={s}>★</span>)}
                </div>
                <p className="text-lg leading-relaxed mb-6 font-medium">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)]"></div>
                  <div>
                    <div className="font-bold">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="container mx-auto px-6 py-24 border-t border-white/5">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Common <span className="text-[var(--primary)] text-glow">Questions</span></h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: "Can I migrate my existing member data?", a: "Yes, our team provides free white-glove migration services for all Growth plan customers." },
              { q: "Is there a setup fee?", a: "No. You can start building your gym's digital operating system instantly with no upfront costs." },
              { q: "Do you support multi-location gyms?", a: "Absolutely. Nexus is built for scale. Manage an unlimited number of locations from a single admin dashboard." },
              { q: "How do payouts work?", a: "We integrate directly with Stripe Connect. Funds are deposited into your bank account on a rolling 2-day schedule." },
            ].map((item, i) => (
              <div key={i} className="glass-panel rounded-xl p-6 group hover:bg-white/5 transition-colors cursor-default">
                <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">{item.q}</h3>
                <p className="text-gray-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>


        {/* Features Section */}
        <section id="features" className="container mx-auto px-6 py-32">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--primary)]">Hyper-Growth</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Command Center", desc: "Real-time analytics and member insights at your fingertips.", icon: BarChart3, color: "var(--primary)" },
              { title: "Global Reach", desc: "Deploy your branded site instantly on our edge network.", icon: Globe, color: "var(--accent)" },
              { title: "Smart Billing", desc: "Automated payments and subscriptions via Stripe.", icon: CreditCard, color: "var(--secondary)" },
              { title: "Ironclad Security", desc: "Enterprise-grade encryption and tenant isolation.", icon: ShieldCheck, color: "var(--primary)" },
              { title: "Instant Scaling", desc: "Infrastructure that grows with your business automatically.", icon: Zap, color: "var(--accent)" },
              { title: "Community Core", desc: "Tools to foster engagement and retention.", icon: Users, color: "var(--secondary)" },
            ].map((f, i) => (
              <div key={i} className="glass-panel p-8 rounded-2xl group hover:bg-white/5 transition-colors duration-300">
                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300" style={{ boxShadow: `0 0 20px ${f.color}40` }}>
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <Link className="flex items-center gap-2 mb-4" href="#">
                <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white fill-current" />
                </div>
                <span className="font-bold text-xl tracking-tighter text-white">FitStack</span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
                The operating system for the next generation of fitness brands.
                Scale deeper, faster, and smarter with AI-driven management.
              </p>
              <div className="flex gap-4">
                {/* Social Placeholders */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-white/5 hover:bg-[var(--primary)] transition-colors cursor-pointer"></div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#features" className="hover:text-[var(--primary)] transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-[var(--primary)] transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-[var(--primary)] transition-colors">API</Link></li>
                <li><Link href="#" className="hover:text-[var(--primary)] transition-colors">Integrations</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-[var(--primary)] transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-[var(--primary)] transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-[var(--primary)] transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-[var(--primary)] transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/terms" className="hover:text-[var(--primary)] transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-[var(--primary)] transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-[var(--primary)] transition-colors">Cookie Policy</Link></li>
                <li><Link href="#" className="hover:text-[var(--primary)] transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">© 2024 FitStack Inc. All rights reserved.</p>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Systems Nominal
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
