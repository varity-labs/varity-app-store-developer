import Link from "next/link";
import {
  ArrowRight,
  Zap,
  DollarSign,
  Clock,
  TrendingUp,
  Upload,
  CheckCircle2,
  Rocket,
  ShieldCheck,
  Code2,
  BarChart3,
  Globe,
  Lock,
  ChevronRight,
  Terminal,
  FileCode,
  Check,
  X,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Mail,
  Star,
  Users,
  Award,
  Calculator,
  GitBranch,
  Package,
  ExternalLink,
} from "lucide-react";

export default function DeveloperLandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Maximum Conversion Focus */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Subtle background gradient - less is more */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/20 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--brand-500)/8,transparent_60%)]" />

        {/* Grid pattern overlay for depth */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2394A3B8' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative section-container section-padding pt-16 md:pt-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Copy */}
            <div className="max-w-xl">
              {/* Early Access Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 border border-brand-500/20 px-4 py-2 mb-6">
                <Star className="h-4 w-4 text-brand-400" />
                <span className="text-sm font-semibold text-brand-400">
                  Early access: Featured placement for first apps
                </span>
              </div>

              <h1 className="text-display-lg md:text-display-xl text-foreground leading-[1.1]">
                Keep 70% of Your Revenue.{" "}
                <span className="text-gradient">Launch in 24 Hours.</span>
              </h1>

              <p className="mt-6 text-body-lg text-foreground-secondary leading-relaxed">
                Stop giving away 30% to app stores. Varity is the developer marketplace
                where you keep more of what you earn, get reviewed in a day (not weeks),
                and pay 70-85% less for hosting than AWS.
              </p>

              {/* Key Stats - Inline */}
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-brand-400" />
                  <span className="text-foreground-secondary"><span className="text-foreground font-semibold">70%</span> you keep</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand-400" />
                  <span className="text-foreground-secondary"><span className="text-foreground font-semibold">24h</span> review time</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-brand-400" />
                  <span className="text-foreground-secondary"><span className="text-foreground font-semibold">85%</span> hosting savings</span>
                </div>
              </div>

              {/* CTA Buttons - Conversion Focused */}
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/submit"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-semibold transition-all duration-200 ease-out bg-brand-500 text-slate-950 hover:bg-brand-400 h-12 px-8 shadow-lg shadow-brand-500/25"
                >
                  Submit Your App
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://docs.varity.so"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-medium transition-all duration-200 border border-border bg-transparent text-foreground hover:bg-background-quaternary hover:border-foreground-muted h-12 px-8"
                >
                  <BookOpen className="h-4 w-4" />
                  Start Building
                </a>
              </div>

              {/* Trust/Urgency Reinforcement */}
              <p className="mt-6 text-sm text-foreground-muted">
                No credit card required. Submit in under 10 minutes.
              </p>
            </div>

            {/* Right Column - Dashboard Preview */}
            <div className="relative">
              {/* Example Dashboard Label */}
              <div className="absolute -top-3 left-4 z-20 px-3 py-1 bg-background-tertiary border border-border rounded-full">
                <span className="text-xs font-medium text-foreground-muted">Example Dashboard</span>
              </div>

              {/* Dashboard Mockup */}
              <div className="relative rounded-xl border border-border bg-background-secondary overflow-hidden shadow-2xl shadow-brand-500/5">
                {/* Window Chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-background-tertiary">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-error/50" />
                    <div className="w-3 h-3 rounded-full bg-warning/50" />
                    <div className="w-3 h-3 rounded-full bg-success/50" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-xs text-foreground-muted">developer.store.varity.so/dashboard</span>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6">
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-background-tertiary border border-border">
                      <p className="text-xs text-foreground-muted mb-1">Total Revenue</p>
                      <p className="text-xl font-bold text-foreground">$12,450</p>
                      <p className="text-xs text-success mt-1">+23% this month</p>
                    </div>
                    <div className="p-4 rounded-lg bg-background-tertiary border border-border">
                      <p className="text-xs text-foreground-muted mb-1">Active Users</p>
                      <p className="text-xl font-bold text-foreground">2,847</p>
                      <p className="text-xs text-success mt-1">+156 today</p>
                    </div>
                    <div className="p-4 rounded-lg bg-background-tertiary border border-border">
                      <p className="text-xs text-foreground-muted mb-1">Your Share</p>
                      <p className="text-xl font-bold text-brand-400">$8,715</p>
                      <p className="text-xs text-foreground-muted mt-1">70% of revenue</p>
                    </div>
                  </div>

                  {/* App Status */}
                  <div className="rounded-lg border border-border overflow-hidden">
                    <div className="px-4 py-3 border-b border-border bg-background-tertiary">
                      <p className="text-sm font-medium text-foreground">Your Apps</p>
                    </div>
                    <div className="divide-y divide-border">
                      <div className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
                            <BarChart3 className="h-4 w-4 text-brand-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">Analytics Pro</p>
                            <p className="text-xs text-foreground-muted">Published</p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-success" />
                          Live
                        </span>
                      </div>
                      <div className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-electric-500/10 flex items-center justify-center">
                            <FileCode className="h-4 w-4 text-electric-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">Code Review Bot</p>
                            <p className="text-xs text-foreground-muted">Submitted 2h ago</p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-warning bg-warning/10 px-2 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                          In Review
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-electric-500/10 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Powered By Section - Real Technology Stack */}
      <section className="border-b border-border bg-background-secondary/30">
        <div className="section-container py-10">
          <p className="text-center text-xs font-medium text-foreground-muted uppercase tracking-wider mb-8">
            Built on enterprise-grade infrastructure
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {/* Arbitrum */}
            <a
              href="https://arbitrum.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#28A0F0]/10 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#28A0F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17l10 5 10-5" stroke="#28A0F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12l10 5 10-5" stroke="#28A0F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-medium group-hover:text-[#28A0F0] transition-colors">Arbitrum</span>
            </a>
            {/* thirdweb */}
            <a
              href="https://thirdweb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#F213A4]/10 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L4 6v12l8 4 8-4V6l-8-4z" stroke="#F213A4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 22V10" stroke="#F213A4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 6l8 4 8-4" stroke="#F213A4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-medium group-hover:text-[#F213A4] transition-colors">thirdweb</span>
            </a>
            {/* Privy */}
            <a
              href="https://privy.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
                <Lock className="w-4 h-4 text-[#8B5CF6]" />
              </div>
              <span className="text-sm font-medium group-hover:text-[#8B5CF6] transition-colors">Privy</span>
            </a>
            {/* Akash */}
            <a
              href="https://akash.network"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FF5E5B]/10 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#FF5E5B" strokeWidth="2"/>
                  <path d="M8 12h8M12 8v8" stroke="#FF5E5B" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-sm font-medium group-hover:text-[#FF5E5B] transition-colors">Akash</span>
            </a>
            {/* IPFS/Filecoin */}
            <a
              href="https://filecoin.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#0090FF]/10 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2v20M2 12h20" stroke="#0090FF" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="3" stroke="#0090FF" strokeWidth="2"/>
                </svg>
              </div>
              <span className="text-sm font-medium group-hover:text-[#0090FF] transition-colors">Filecoin</span>
            </a>
          </div>
        </div>
      </section>

      {/* Comparison Section - Varity vs Traditional */}
      <section className="section-container section-padding">
        <div className="text-center mb-12">
          <p className="text-overline text-brand-400 mb-3">WHY VARITY</p>
          <h2 className="text-display-md text-foreground mb-4">
            Built for developers who want more
          </h2>
          <p className="text-body-md text-foreground-secondary max-w-2xl mx-auto">
            Traditional app stores take up to 30% and keep you waiting weeks for approval.
            We built something better.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Traditional App Stores */}
            <div className="rounded-xl border border-border bg-background-secondary p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-foreground-muted/10 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-foreground-muted" />
                </div>
                <div>
                  <h3 className="text-heading-lg text-foreground">Traditional App Stores</h3>
                  <p className="text-sm text-foreground-muted">Apple, Google, Microsoft</p>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-error shrink-0 mt-0.5" />
                  <span className="text-body-sm text-foreground-secondary">15-30% commission on all revenue</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-error shrink-0 mt-0.5" />
                  <span className="text-body-sm text-foreground-secondary">7-14 day review process</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-error shrink-0 mt-0.5" />
                  <span className="text-body-sm text-foreground-secondary">Opaque rejection reasons</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-error shrink-0 mt-0.5" />
                  <span className="text-body-sm text-foreground-secondary">Monthly payouts with delays</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="h-5 w-5 text-error shrink-0 mt-0.5" />
                  <span className="text-body-sm text-foreground-secondary">AWS infrastructure: ~$2,800/mo</span>
                </li>
              </ul>
            </div>

            {/* Varity */}
            <div className="rounded-xl border border-brand-500/30 bg-gradient-to-br from-brand-950/30 to-background-secondary p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-brand-500 text-slate-950 text-xs font-semibold rounded-bl-lg">
                RECOMMENDED
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-brand-400" />
                </div>
                <div>
                  <h3 className="text-heading-lg text-foreground">Varity App Store</h3>
                  <p className="text-sm text-brand-400">Developer-first platform</p>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-brand-400 shrink-0 mt-0.5" />
                  <span className="text-body-sm text-foreground"><span className="font-semibold text-brand-400">70% revenue share</span> - you keep more</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-brand-400 shrink-0 mt-0.5" />
                  <span className="text-body-sm text-foreground"><span className="font-semibold text-brand-400">24-48 hour</span> review process</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-brand-400 shrink-0 mt-0.5" />
                  <span className="text-body-sm text-foreground">Clear, actionable feedback</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-brand-400 shrink-0 mt-0.5" />
                  <span className="text-body-sm text-foreground">Instant payments, no 30-day wait</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-brand-400 shrink-0 mt-0.5" />
                  <span className="text-body-sm text-foreground">Infrastructure: <span className="font-semibold text-brand-400">~$800/mo</span> (70-85% savings)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Visual Timeline */}
      <section className="border-y border-border bg-gradient-to-b from-background to-background-secondary/50">
        <div className="section-container section-padding">
          <div className="text-center mb-16">
            <p className="text-overline text-brand-400 mb-3">HOW IT WORKS</p>
            <h2 className="text-display-md text-foreground mb-4">
              From code to customers in 3 steps
            </h2>
            <p className="text-body-md text-foreground-secondary max-w-xl mx-auto">
              No complex setup. No waiting weeks. Submit your app and start earning within 48 hours.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connection Line (Desktop only) */}
              <div className="hidden md:block absolute top-16 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-brand-500/50 via-electric-500/50 to-success/50" />

              {/* Step 1 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative z-10 w-12 h-12 rounded-full bg-brand-500/10 border-2 border-brand-500 flex items-center justify-center mb-6">
                    <Upload className="h-5 w-5 text-brand-400" />
                  </div>
                  <h3 className="text-heading-lg text-foreground mb-3">1. Submit Your App</h3>
                  <p className="text-body-sm text-foreground-secondary">
                    Fill out a quick form with your app details. Connect your GitHub repo to auto-fill information. Takes under 10 minutes.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative z-10 w-12 h-12 rounded-full bg-electric-500/10 border-2 border-electric-500 flex items-center justify-center mb-6">
                    <ShieldCheck className="h-5 w-5 text-electric-400" />
                  </div>
                  <h3 className="text-heading-lg text-foreground mb-3">2. Quick Review</h3>
                  <p className="text-body-sm text-foreground-secondary">
                    Our team reviews your app for security and quality. Automated checks plus human review. Average: 24 hours.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative z-10 w-12 h-12 rounded-full bg-success/10 border-2 border-success flex items-center justify-center mb-6">
                    <Rocket className="h-5 w-5 text-success" />
                  </div>
                  <h3 className="text-heading-lg text-foreground mb-3">3. Go Live & Earn</h3>
                  <p className="text-body-sm text-foreground-secondary">
                    Your app is published to thousands of enterprise users. Start earning with 70% revenue share and instant payouts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Early Adopter Benefits - MVP Launch Special */}
      <section className="section-container section-padding">
        <div className="relative rounded-2xl overflow-hidden border border-brand-500/30">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-950/40 via-background-secondary to-electric-950/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--brand-500)/15,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--electric-500)/10,transparent_50%)]" />

          <div className="relative p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/20 border border-brand-500/30 px-4 py-2 mb-6">
                <Star className="h-4 w-4 text-brand-400" />
                <span className="text-sm font-semibold text-brand-400">Early Access Program</span>
              </div>
              <h2 className="text-display-md text-foreground mb-4">
                Be one of the first 100 apps
              </h2>
              <p className="text-body-md text-foreground-secondary max-w-2xl mx-auto">
                Early adopters get exclusive benefits that will never be offered again.
                Spots are filling up fast.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {/* Benefit 1 */}
              <div className="rounded-xl border border-border bg-background-secondary/80 backdrop-blur-sm p-5 hover:border-brand-500/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center mb-4">
                  <Star className="h-5 w-5 text-brand-400" />
                </div>
                <h3 className="text-heading-md text-foreground mb-2">Featured Placement</h3>
                <p className="text-body-sm text-foreground-secondary">
                  Your app featured on the homepage for maximum visibility to enterprise buyers.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="rounded-xl border border-border bg-background-secondary/80 backdrop-blur-sm p-5 hover:border-brand-500/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-electric-500/10 flex items-center justify-center mb-4">
                  <Users className="h-5 w-5 text-electric-400" />
                </div>
                <h3 className="text-heading-md text-foreground mb-2">Direct Team Support</h3>
                <p className="text-body-sm text-foreground-secondary">
                  1-on-1 onboarding call with our team. Dedicated Slack channel for questions.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="rounded-xl border border-border bg-background-secondary/80 backdrop-blur-sm p-5 hover:border-brand-500/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                  <Award className="h-5 w-5 text-warning" />
                </div>
                <h3 className="text-heading-md text-foreground mb-2">Launch Partner Badge</h3>
                <p className="text-body-sm text-foreground-secondary">
                  Exclusive badge on your app listing. Shows users you&apos;re a trusted early partner.
                </p>
              </div>

              {/* Benefit 4 */}
              <div className="rounded-xl border border-border bg-background-secondary/80 backdrop-blur-sm p-5 hover:border-brand-500/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                  <Clock className="h-5 w-5 text-success" />
                </div>
                <h3 className="text-heading-md text-foreground mb-2">Same-Day Review</h3>
                <p className="text-body-sm text-foreground-secondary">
                  Priority review queue. Your app reviewed the same day you submit, guaranteed.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <p className="text-sm text-foreground-secondary mb-6">
                Limited spots available for featured placement
              </p>
              <div>
                <Link
                  href="/submit"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-semibold transition-all duration-200 ease-out bg-brand-500 text-slate-950 hover:bg-brand-400 h-12 px-8"
                >
                  Claim Your Spot
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Math Section - Concrete Value */}
      <section className="border-y border-border bg-background-secondary/30">
        <div className="section-container section-padding">
          <div className="text-center mb-12">
            <p className="text-overline text-brand-400 mb-3">THE MATH</p>
            <h2 className="text-display-md text-foreground mb-4">
              Let&apos;s talk real numbers
            </h2>
            <p className="text-body-md text-foreground-secondary max-w-2xl mx-auto">
              See exactly how much more you&apos;ll earn with Varity vs traditional platforms.
            </p>
          </div>

          {/* Calculator Comparison */}
          <div className="max-w-4xl mx-auto">
            {/* Scenario Header */}
            <div className="text-center mb-8 p-4 rounded-xl bg-background-tertiary border border-border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calculator className="h-5 w-5 text-brand-400" />
                <span className="text-sm font-medium text-foreground-muted uppercase tracking-wider">Example Scenario</span>
              </div>
              <p className="text-display-sm text-foreground font-bold">
                Your app earns <span className="text-brand-400">$10,000</span>/month
              </p>
            </div>

            {/* Side by Side Comparison */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Traditional Path */}
              <div className="rounded-xl border border-border bg-background-secondary p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                  <div className="w-10 h-10 rounded-lg bg-foreground-muted/10 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-foreground-muted" />
                  </div>
                  <div>
                    <h3 className="text-heading-lg text-foreground">Traditional Path</h3>
                    <p className="text-xs text-foreground-muted">App Store + AWS</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-body-sm text-foreground-secondary">Gross Revenue</span>
                    <span className="text-body-md text-foreground font-medium">$10,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-body-sm text-foreground-secondary">Platform Cut (30%)</span>
                    <span className="text-body-md text-error font-medium">-$3,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-body-sm text-foreground-secondary">Your Revenue Share</span>
                    <span className="text-body-md text-foreground font-medium">$7,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-body-sm text-foreground-secondary">AWS Infrastructure</span>
                    <span className="text-body-md text-error font-medium">-$2,800</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-body-md text-foreground font-semibold">Your Profit</span>
                    <span className="text-display-sm text-foreground font-bold">$4,200</span>
                  </div>
                </div>
              </div>

              {/* Varity Path */}
              <div className="rounded-xl border border-brand-500/30 bg-gradient-to-br from-brand-950/20 to-background-secondary p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 bg-brand-500 text-slate-950 text-xs font-semibold rounded-bl-lg">
                  +$2,000/mo
                </div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-brand-500/20">
                  <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-brand-400" />
                  </div>
                  <div>
                    <h3 className="text-heading-lg text-foreground">Varity Path</h3>
                    <p className="text-xs text-brand-400">App Store + Decentralized Infra</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-body-sm text-foreground-secondary">Gross Revenue</span>
                    <span className="text-body-md text-foreground font-medium">$10,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-body-sm text-foreground-secondary">Platform Cut (30%)</span>
                    <span className="text-body-md text-error font-medium">-$3,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-body-sm text-foreground-secondary">Your Revenue Share</span>
                    <span className="text-body-md text-foreground font-medium">$7,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-body-sm text-brand-400">Varity Infrastructure</span>
                    <span className="text-body-md text-brand-400 font-medium">-$800</span>
                  </div>
                  <div className="h-px bg-brand-500/20 my-2" />
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-body-md text-foreground font-semibold">Your Profit</span>
                    <span className="text-display-sm text-brand-400 font-bold">$6,200</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Line */}
            <div className="rounded-xl bg-gradient-to-r from-brand-500/10 via-electric-500/10 to-brand-500/10 border border-brand-500/20 p-6 text-center">
              <p className="text-body-lg text-foreground mb-2">
                That&apos;s <span className="text-brand-400 font-bold text-display-sm">$2,000 MORE</span> per month in your pocket
              </p>
              <p className="text-body-sm text-foreground-secondary">
                $24,000 extra per year. Same app, same revenue, better platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Two Paths Section */}
      <section className="section-container section-padding">
        <div className="text-center mb-12">
          <p className="text-overline text-brand-400 mb-3">GET STARTED</p>
          <h2 className="text-display-md text-foreground mb-4">
            Two paths to launch
          </h2>
          <p className="text-body-md text-foreground-secondary max-w-2xl mx-auto">
            Whether you have an existing app or you&apos;re building something new, we&apos;ve got you covered.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Path A - Existing App */}
            <div className="group rounded-xl border border-border bg-background-secondary p-8 hover:border-brand-500/50 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-brand-400" />
                </div>
                <div className="px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
                  <span className="text-xs font-semibold text-brand-400">PATH A</span>
                </div>
              </div>

              <h3 className="text-heading-xl text-foreground mb-3">
                Already have an app?
              </h3>
              <p className="text-body-md text-foreground-secondary mb-6">
                Submit your existing application today. No SDK required, no code changes needed.
                Just fill out the form and we&apos;ll handle the rest.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-brand-400 shrink-0" />
                  <span className="text-body-sm text-foreground-secondary">Works with any tech stack</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-brand-400 shrink-0" />
                  <span className="text-body-sm text-foreground-secondary">10 minute submission process</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-brand-400 shrink-0" />
                  <span className="text-body-sm text-foreground-secondary">Connect GitHub for auto-fill</span>
                </li>
              </ul>

              <Link
                href="/submit"
                className="inline-flex items-center justify-center gap-2 w-full whitespace-nowrap rounded-lg text-base font-semibold transition-all duration-200 ease-out bg-brand-500 text-slate-950 hover:bg-brand-400 h-12 px-8"
              >
                Submit Your App Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Path B - Building New */}
            <div className="group rounded-xl border border-border bg-background-secondary p-8 hover:border-electric-500/50 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-electric-500/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-electric-400" />
                </div>
                <div className="px-3 py-1 rounded-full bg-electric-500/10 border border-electric-500/20">
                  <span className="text-xs font-semibold text-electric-400">PATH B</span>
                </div>
              </div>

              <h3 className="text-heading-xl text-foreground mb-3">
                Building something new?
              </h3>
              <p className="text-body-md text-foreground-secondary mb-6">
                Start with our SDK and packages for built-in payments, authentication,
                and analytics. Deploy with one command.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-electric-400 shrink-0" />
                  <span className="text-body-sm text-foreground-secondary">TypeScript SDK with full types</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-electric-400 shrink-0" />
                  <span className="text-body-sm text-foreground-secondary">Built-in payments & auth</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-electric-400 shrink-0" />
                  <span className="text-body-sm text-foreground-secondary">CLI-first deployment</span>
                </li>
              </ul>

              <a
                href="https://docs.varity.so"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full whitespace-nowrap rounded-lg text-base font-medium transition-all duration-200 border border-electric-500/50 bg-electric-500/10 text-electric-400 hover:bg-electric-500/20 h-12 px-8"
              >
                View Documentation
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Bottom note */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-foreground-muted">
              <GitBranch className="h-4 w-4" />
              <span>Both paths get the same 70% revenue share and 24-hour reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="section-container section-padding">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-overline text-brand-400 mb-3">INTEGRATION</p>
            <h2 className="text-display-md text-foreground mb-4">
              Deploy in minutes, not days
            </h2>
            <p className="text-body-md text-foreground-secondary mb-8">
              Use our SDK to add Varity features to your app, or simply submit your existing application.
              No code changes required for basic listing.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                  <Terminal className="h-5 w-5 text-brand-400" />
                </div>
                <div>
                  <h4 className="text-heading-md text-foreground mb-1">CLI-first deployment</h4>
                  <p className="text-body-sm text-foreground-secondary">Deploy with a single command. Our CLI handles the rest.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-electric-500/10 flex items-center justify-center shrink-0">
                  <Code2 className="h-5 w-5 text-electric-400" />
                </div>
                <div>
                  <h4 className="text-heading-md text-foreground mb-1">Optional SDK</h4>
                  <p className="text-body-sm text-foreground-secondary">Add payments, analytics, and more with our TypeScript SDK.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                  <Lock className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h4 className="text-heading-md text-foreground mb-1">Built-in security</h4>
                  <p className="text-body-sm text-foreground-secondary">Secure authentication and encrypted data storage.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Code Block */}
          <div className="relative">
            <div className="rounded-xl border border-border bg-background-secondary overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background-tertiary">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-error/50" />
                    <div className="w-3 h-3 rounded-full bg-warning/50" />
                    <div className="w-3 h-3 rounded-full bg-success/50" />
                  </div>
                  <span className="text-xs text-foreground-muted ml-2">Terminal</span>
                </div>
                <span className="text-xs text-foreground-muted">zsh</span>
              </div>

              {/* Code Content */}
              <div className="p-6 font-mono text-sm overflow-x-auto">
                <div className="space-y-4">
                  <div>
                    <span className="text-foreground-muted"># Install the Varity CLI</span>
                    <div className="mt-1">
                      <span className="text-brand-400">$</span>{" "}
                      <span className="text-foreground">npm install -g @varity/cli</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-foreground-muted"># Initialize your project</span>
                    <div className="mt-1">
                      <span className="text-brand-400">$</span>{" "}
                      <span className="text-foreground">varity init</span>
                    </div>
                    <div className="mt-2 text-foreground-muted text-xs">
                      <span className="text-success">✓</span> Created varity.config.ts<br />
                      <span className="text-success">✓</span> Connected to Varity Network
                    </div>
                  </div>

                  <div>
                    <span className="text-foreground-muted"># Deploy to production</span>
                    <div className="mt-1">
                      <span className="text-brand-400">$</span>{" "}
                      <span className="text-foreground">varity deploy --prod</span>
                    </div>
                    <div className="mt-2 text-foreground-muted text-xs">
                      <span className="text-success">✓</span> Build completed in 45s<br />
                      <span className="text-success">✓</span> Deployed to https://myapp.varity.so<br />
                      <span className="text-brand-400">→</span> Submit for review at /submit
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative blur */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl" />
          </div>
        </div>
      </section>

      {/* Why Developers Choose Varity Section */}
      <section className="border-y border-border bg-background-secondary/30">
        <div className="section-container section-padding">
          <div className="text-center mb-12">
            <p className="text-overline text-brand-400 mb-3">THE VARITY ADVANTAGE</p>
            <h2 className="text-display-md text-foreground">
              Why developers choose Varity
            </h2>
            <p className="text-body-md text-foreground-secondary max-w-2xl mx-auto mt-4">
              Real benefits that impact your bottom line and your time to market.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Benefit 1: 70% Revenue Share */}
            <div className="rounded-xl border border-brand-500/30 bg-gradient-to-br from-brand-950/20 to-background-secondary p-6">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-brand-400" />
              </div>
              <h3 className="text-heading-lg text-foreground mb-2">70% Revenue Share</h3>
              <p className="text-body-sm text-foreground-secondary mb-3">
                Keep 2x more than traditional app stores. Apple and Google take 30% - we only take 30% and you keep 70%.
              </p>
              <p className="text-sm font-medium text-brand-400">
                Earn $70 for every $100 in sales
              </p>
            </div>

            {/* Benefit 2: 24-Hour Review */}
            <div className="rounded-xl border border-border bg-background-secondary p-6">
              <div className="w-12 h-12 rounded-xl bg-electric-500/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-electric-400" />
              </div>
              <h3 className="text-heading-lg text-foreground mb-2">24-Hour Review</h3>
              <p className="text-body-sm text-foreground-secondary mb-3">
                No more waiting weeks for approval. Our streamlined review process gets your app live fast.
              </p>
              <p className="text-sm font-medium text-electric-400">
                Ship on Monday, earn by Tuesday
              </p>
            </div>

            {/* Benefit 3: 85% Cost Savings */}
            <div className="rounded-xl border border-border bg-background-secondary p-6">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-heading-lg text-foreground mb-2">85% Infrastructure Savings</h3>
              <p className="text-body-sm text-foreground-secondary mb-3">
                Decentralized hosting on Akash Network costs a fraction of AWS, Azure, or GCP.
              </p>
              <p className="text-sm font-medium text-success">
                $800/mo vs $2,800/mo on AWS
              </p>
            </div>

            {/* Benefit 4: Instant Payments */}
            <div className="rounded-xl border border-border bg-background-secondary p-6">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-warning" />
              </div>
              <h3 className="text-heading-lg text-foreground mb-2">Instant On-Chain Payments</h3>
              <p className="text-body-sm text-foreground-secondary mb-3">
                No more waiting 30-60 days for payouts. Revenue settles instantly to your wallet.
              </p>
              <p className="text-sm font-medium text-warning">
                Get paid the moment you earn
              </p>
            </div>

            {/* Benefit 5: No SDK Required */}
            <div className="rounded-xl border border-border bg-background-secondary p-6">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-brand-400" />
              </div>
              <h3 className="text-heading-lg text-foreground mb-2">No SDK Required</h3>
              <p className="text-body-sm text-foreground-secondary mb-3">
                Your existing web app works as-is. No code changes required to list on Varity.
              </p>
              <p className="text-sm font-medium text-brand-400">
                Submit any production-ready app
              </p>
            </div>

            {/* Benefit 6: Enterprise Customers */}
            <div className="rounded-xl border border-border bg-background-secondary p-6">
              <div className="w-12 h-12 rounded-xl bg-electric-500/10 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-electric-400" />
              </div>
              <h3 className="text-heading-lg text-foreground mb-2">Enterprise Customer Base</h3>
              <p className="text-body-sm text-foreground-secondary mb-3">
                Reach businesses actively looking for tools to improve their operations.
              </p>
              <p className="text-sm font-medium text-electric-400">
                High-value B2B customers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Real Numbers */}
      <section className="section-container section-padding">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-display-md md:text-display-lg text-brand-400 font-bold mb-2">70%</div>
            <p className="text-body-sm text-foreground-secondary">Revenue Share</p>
          </div>
          <div className="text-center">
            <div className="text-display-md md:text-display-lg text-foreground font-bold mb-2">24h</div>
            <p className="text-body-sm text-foreground-secondary">Avg Review Time</p>
          </div>
          <div className="text-center">
            <div className="text-display-md md:text-display-lg text-foreground font-bold mb-2">85%</div>
            <p className="text-body-sm text-foreground-secondary">Cost Savings</p>
          </div>
          <div className="text-center">
            <div className="text-display-md md:text-display-lg text-success font-bold mb-2">$0</div>
            <p className="text-body-sm text-foreground-secondary">Upfront Cost</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-border bg-background-secondary/30">
        <div className="section-container section-padding">
          <div className="text-center mb-12">
            <p className="text-overline text-brand-400 mb-3">FAQ</p>
            <h2 className="text-display-md text-foreground">
              Common questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "How long does the review process take?",
                a: "Most apps are reviewed within 24 hours. Complex applications may take up to 48 hours. You'll receive email updates at each stage."
              },
              {
                q: "What's the revenue split?",
                a: "You keep 70% of all revenue. This is significantly better than traditional app stores that take 15-30%. Payments are processed on-chain for instant settlement."
              },
              {
                q: "Do I need to use the Varity SDK?",
                a: "No, the SDK is optional. You can submit any web application. The SDK adds features like built-in payments, analytics, and authentication if you want them."
              },
              {
                q: "What types of apps can I submit?",
                a: "We accept web applications, APIs, and developer tools. Apps must be production-ready and follow our content guidelines. Enterprise and B2B apps are especially welcome."
              },
              {
                q: "How do infrastructure cost savings work?",
                a: "Varity runs on decentralized infrastructure (Akash Network) instead of traditional cloud providers. This typically saves developers 70-85% compared to AWS, Azure, or GCP."
              },
            ].map((faq, i) => (
              <details key={i} className="group rounded-xl border border-border bg-background-secondary">
                <summary className="flex items-center justify-between cursor-pointer p-6 text-foreground font-medium">
                  <span className="text-body-md pr-4">{faq.q}</span>
                  <ChevronRight className="h-5 w-5 text-foreground-muted transition-transform group-open:rotate-90 shrink-0" />
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-body-sm text-foreground-secondary">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="section-container section-padding">
        <div className="text-center mb-12">
          <p className="text-overline text-brand-400 mb-3">RESOURCES</p>
          <h2 className="text-display-md text-foreground">
            Everything you need to succeed
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <a
            href="https://docs.varity.so"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl border border-border bg-background-secondary p-6 transition-all hover:border-brand-500/50 hover:bg-background-tertiary"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4 group-hover:bg-brand-500/20 transition-colors">
              <BookOpen className="h-6 w-6 text-brand-400" />
            </div>
            <h3 className="text-heading-lg text-foreground mb-2 group-hover:text-brand-400 transition-colors">Documentation</h3>
            <p className="text-body-sm text-foreground-secondary">Comprehensive guides for submitting and managing your apps.</p>
          </a>

          <a
            href="https://github.com/varity-labs"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl border border-border bg-background-secondary p-6 transition-all hover:border-brand-500/50 hover:bg-background-tertiary"
          >
            <div className="w-12 h-12 rounded-xl bg-electric-500/10 flex items-center justify-center mb-4 group-hover:bg-electric-500/20 transition-colors">
              <Code2 className="h-6 w-6 text-electric-400" />
            </div>
            <h3 className="text-heading-lg text-foreground mb-2 group-hover:text-brand-400 transition-colors">Open Source</h3>
            <p className="text-body-sm text-foreground-secondary">Explore our SDK, CLI, and example applications on GitHub.</p>
          </a>

          <a
            href="mailto:support@varity.so"
            className="group rounded-xl border border-border bg-background-secondary p-6 transition-all hover:border-brand-500/50 hover:bg-background-tertiary"
          >
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4 group-hover:bg-success/20 transition-colors">
              <MessageSquare className="h-6 w-6 text-success" />
            </div>
            <h3 className="text-heading-lg text-foreground mb-2 group-hover:text-brand-400 transition-colors">Support</h3>
            <p className="text-body-sm text-foreground-secondary">Questions? Our team responds within 24 hours.</p>
          </a>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border">
        <div className="section-container section-padding">
          <div className="relative rounded-2xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-950/50 via-background-secondary to-electric-950/50" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--brand-500)/10,transparent_70%)]" />

            {/* Content */}
            <div className="relative p-8 md:p-16 text-center">
              <h2 className="text-display-md md:text-display-lg text-foreground mb-4">
                Ready to launch your app?
              </h2>
              <p className="text-body-lg text-foreground-secondary max-w-xl mx-auto mb-4">
                Be among the first to launch on Varity. Better revenue share, faster reviews, and lower infrastructure costs.
              </p>
              <p className="text-sm font-medium text-brand-400 mb-8">
                Limited featured spots available for early apps
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/submit"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-semibold transition-all duration-200 ease-out bg-brand-500 text-slate-950 hover:bg-brand-400 h-12 px-8"
                >
                  Submit Your App
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-base font-medium transition-all duration-200 border border-border bg-transparent text-foreground hover:bg-background-quaternary hover:border-foreground-muted h-12 px-8"
                >
                  View Dashboard
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-foreground-muted">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Enterprise-grade Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>Instant Payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>24/7 Uptime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
