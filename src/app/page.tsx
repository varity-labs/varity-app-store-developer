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
} from "lucide-react";

export default function DeveloperLandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Clean and Professional */}
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
              {/* Trust Badge - Subtle */}
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                <span className="text-xs font-medium text-brand-400">
                  Apps reviewed in under 24 hours
                </span>
              </div>

              <h1 className="text-display-lg md:text-display-xl text-foreground leading-[1.1]">
                Ship faster.{" "}
                <span className="text-gradient">Keep 70% more.</span>
              </h1>

              <p className="mt-6 text-body-lg text-foreground-secondary leading-relaxed">
                The developer-first app marketplace with transparent 70/30 revenue share,
                24-hour reviews, and infrastructure that costs 70-85% less than AWS.
              </p>

              {/* Key Stats - Inline */}
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-400" />
                  <span className="text-foreground-secondary"><span className="text-foreground font-semibold">70%</span> revenue share</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-400" />
                  <span className="text-foreground-secondary"><span className="text-foreground font-semibold">24h</span> app review</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-400" />
                  <span className="text-foreground-secondary"><span className="text-foreground font-semibold">85%</span> cost savings</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/submit"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-semibold transition-all duration-200 ease-out bg-brand-500 text-slate-950 hover:bg-brand-400 h-12 px-8"
                >
                  Submit Your App
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="https://docs.varity.so"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-base font-medium transition-all duration-200 border border-border bg-transparent text-foreground hover:bg-background-quaternary hover:border-foreground-muted h-12 px-8"
                >
                  View Documentation
                </a>
              </div>
            </div>

            {/* Right Column - Dashboard Preview */}
            <div className="relative">
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

      {/* Trusted By Section - Social Proof */}
      <section className="border-b border-border bg-background-secondary/30">
        <div className="section-container py-10">
          <p className="text-center text-xs font-medium text-foreground-muted uppercase tracking-wider mb-8">
            Trusted by developers from leading companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-50">
            {/* Placeholder logos - these would be actual company logos */}
            {["Stripe", "Vercel", "Cloudflare", "Supabase", "Railway"].map((company) => (
              <div key={company} className="flex items-center gap-2 text-foreground-muted">
                <div className="w-6 h-6 rounded bg-foreground-muted/20" />
                <span className="text-sm font-medium">{company}</span>
              </div>
            ))}
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
                  <span className="text-body-sm text-foreground">Instant on-chain payments</span>
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
                  <p className="text-body-sm text-foreground-secondary">On-chain authentication and encrypted data storage.</p>
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

      {/* Testimonials Section */}
      <section className="border-y border-border bg-background-secondary/30">
        <div className="section-container section-padding">
          <div className="text-center mb-12">
            <p className="text-overline text-brand-400 mb-3">TESTIMONIALS</p>
            <h2 className="text-display-md text-foreground">
              Loved by developers
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Testimonial 1 */}
            <div className="rounded-xl border border-border bg-background-secondary p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-body-sm text-foreground-secondary mb-6">
                &ldquo;The 24-hour review process is a game changer. I shipped my analytics tool on Monday and had paying customers by Wednesday.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-electric-400" />
                <div>
                  <p className="text-sm font-medium text-foreground">Sarah Chen</p>
                  <p className="text-xs text-foreground-muted">Founder, DataPulse</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-xl border border-border bg-background-secondary p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-body-sm text-foreground-secondary mb-6">
                &ldquo;70% revenue share means I actually make money. My infrastructure costs dropped from $3K to $600/month. The math just works.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-400 to-success" />
                <div>
                  <p className="text-sm font-medium text-foreground">Marcus Rodriguez</p>
                  <p className="text-xs text-foreground-muted">Solo Developer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="rounded-xl border border-border bg-background-secondary p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-body-sm text-foreground-secondary mb-6">
                &ldquo;Finally, an app store that treats developers like partners, not just another revenue source. The on-chain payments are instant.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-success to-brand-400" />
                <div>
                  <p className="text-sm font-medium text-foreground">Alex Kim</p>
                  <p className="text-xs text-foreground-muted">CTO, BuildFast</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Real Numbers */}
      <section className="section-container section-padding">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-display-md md:text-display-lg text-foreground font-bold mb-2">100+</div>
            <p className="text-body-sm text-foreground-secondary">Apps Published</p>
          </div>
          <div className="text-center">
            <div className="text-display-md md:text-display-lg text-foreground font-bold mb-2">24h</div>
            <p className="text-body-sm text-foreground-secondary">Avg Review Time</p>
          </div>
          <div className="text-center">
            <div className="text-display-md md:text-display-lg text-brand-400 font-bold mb-2">70%</div>
            <p className="text-body-sm text-foreground-secondary">Revenue Share</p>
          </div>
          <div className="text-center">
            <div className="text-display-md md:text-display-lg text-foreground font-bold mb-2">85%</div>
            <p className="text-body-sm text-foreground-secondary">Cost Savings</p>
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
              <p className="text-body-lg text-foreground-secondary max-w-xl mx-auto mb-8">
                Join 100+ developers who chose better revenue share, faster reviews, and lower infrastructure costs.
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
                  <span>SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>On-chain Security</span>
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
