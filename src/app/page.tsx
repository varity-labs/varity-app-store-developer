import Link from "next/link";
import {
  ArrowRight,
  Zap,
  DollarSign,
  Award,
  Server,
  Users,
  Clock,
  TrendingUp,
  Upload,
  CheckCircle2,
  Rocket,
  ShieldCheck,
} from "lucide-react";

export default function DeveloperLandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/30 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--brand-500)/10,transparent_50%)]" />

        <div className="relative section-container section-padding">
          <div className="mx-auto max-w-4xl text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 border border-brand-500/20 px-4 py-2 mb-6 animate-fade-in">
              <Clock className="h-4 w-4 text-brand-400" />
              <span className="text-sm font-medium text-brand-400">
                Average approval time: 24 hours
              </span>
            </div>

            <h1 className="text-display-lg md:text-display-xl text-foreground animate-slide-up">
              Get Your App in Front of{" "}
              <span className="text-gradient">Thousands</span>
            </h1>

            <p className="mt-6 text-body-lg text-foreground-secondary max-w-2xl mx-auto animate-slide-up">
              Join the curated marketplace trusted by developers worldwide. Ship
              faster, reach more users, and save up to 85% on infrastructure
              costs.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center animate-slide-up">
              <Link
                href="/submit"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-semibold transition-all duration-200 ease-out bg-brand-500 text-slate-950 hover:bg-brand-400 hover:shadow-[0_0_20px_rgba(20,184,166,0.5),0_0_40px_rgba(20,184,166,0.3)] h-14 px-10"
              >
                Submit Your App
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="https://docs.varity.so"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium transition-all duration-200 border border-border bg-transparent text-foreground hover:bg-background-quaternary hover:border-brand-500 h-14 px-10"
              >
                View Documentation
              </a>
            </div>

            {/* Social Proof */}
            <p className="mt-8 text-sm text-foreground-muted">
              Trusted by developers from companies like{" "}
              <span className="text-foreground-secondary font-medium">
                Stripe, Vercel, and Cloudflare
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="section-container section-padding">
        <div className="text-center mb-12">
          <p className="text-overline text-brand-400 mb-4">WHY VARITY</p>
          <h2 className="text-display-md text-foreground">
            Built for Developers, By Developers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Benefit 1 */}
          <div className="card card-hover">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-500/10 border border-brand-500/20 mb-4">
              <Zap className="h-6 w-6 text-brand-400" />
            </div>
            <h3 className="text-heading-lg text-foreground mb-2">
              Instant Distribution
            </h3>
            <p className="text-body-md text-foreground-secondary">
              Get your app in front of thousands of potential users the moment
              it&#39;s approved. No marketing budget required.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="card card-hover">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-electric-500/10 border border-electric-500/20 mb-4">
              <DollarSign className="h-6 w-6 text-electric-400" />
            </div>
            <h3 className="text-heading-lg text-foreground mb-2">
              Earn Revenue
            </h3>
            <p className="text-body-md text-foreground-secondary">
              Monetize your app with built-in payment processing and subscription
              management. Keep what you earn.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="card card-hover">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-success/10 border border-success/20 mb-4">
              <Award className="h-6 w-6 text-success" />
            </div>
            <h3 className="text-heading-lg text-foreground mb-2">
              Curated Marketplace
            </h3>
            <p className="text-body-md text-foreground-secondary">
              Stand out in a quality-focused store. Only the best apps make it
              through our review process.
            </p>
          </div>

          {/* Benefit 4 */}
          <div className="card card-hover">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-warning/10 border border-warning/20 mb-4">
              <Server className="h-6 w-6 text-warning" />
            </div>
            <h3 className="text-heading-lg text-foreground mb-2">
              Zero Hosting Costs
            </h3>
            <p className="text-body-md text-foreground-secondary">
              Deploy on decentralized infrastructure and save 70-85% compared to
              AWS, Azure, or Google Cloud.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-gradient-to-b from-background-secondary/50 to-background">
        <div className="section-container section-padding">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Stat 1 */}
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <Users className="h-8 w-8 text-brand-400" />
              </div>
              <div className="text-display-md text-foreground font-bold">
                100+
              </div>
              <p className="text-body-md text-foreground-secondary mt-2">
                Apps Published
              </p>
            </div>

            {/* Stat 2 */}
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <Clock className="h-8 w-8 text-electric-400" />
              </div>
              <div className="text-display-md text-foreground font-bold">
                24-48h
              </div>
              <p className="text-body-md text-foreground-secondary mt-2">
                Average Approval Time
              </p>
            </div>

            {/* Stat 3 */}
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
              <div className="text-display-md text-foreground font-bold">
                70-85%
              </div>
              <p className="text-body-md text-foreground-secondary mt-2">
                Infrastructure Cost Savings
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-container section-padding">
        <div className="text-center mb-12">
          <p className="text-overline text-brand-400 mb-4">HOW IT WORKS</p>
          <h2 className="text-display-md text-foreground">
            Launch Your App in 5 Simple Steps
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Step 1 */}
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <span className="text-heading-lg font-bold text-brand-400">1</span>
            </div>
            <div>
              <h3 className="text-heading-xl text-foreground mb-2 flex items-center gap-2">
                <Upload className="h-5 w-5 text-brand-400" />
                Submit Your App
              </h3>
              <p className="text-body-md text-foreground-secondary">
                Fill out a simple form with your app details, screenshots, and
                deployment info. Takes less than 10 minutes.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-electric-500/10 border border-electric-500/20 flex items-center justify-center">
              <span className="text-heading-lg font-bold text-electric-400">
                2
              </span>
            </div>
            <div>
              <h3 className="text-heading-xl text-foreground mb-2 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-electric-400" />
                Automated Review
              </h3>
              <p className="text-body-md text-foreground-secondary">
                Our automated systems check your app for security, performance,
                and quality standards. Most apps pass automatically.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-success/10 border border-success/20 flex items-center justify-center">
              <span className="text-heading-lg font-bold text-success">3</span>
            </div>
            <div>
              <h3 className="text-heading-xl text-foreground mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                Manual Approval
              </h3>
              <p className="text-body-md text-foreground-secondary">
                A human reviewer takes a final look to ensure quality. Average
                approval time is 24 hours.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-warning/10 border border-warning/20 flex items-center justify-center">
              <span className="text-heading-lg font-bold text-warning">4</span>
            </div>
            <div>
              <h3 className="text-heading-xl text-foreground mb-2 flex items-center gap-2">
                <Rocket className="h-5 w-5 text-warning" />
                Go Live
              </h3>
              <p className="text-body-md text-foreground-secondary">
                Your app is instantly published to the marketplace and visible to
                thousands of potential users worldwide.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-info/10 border border-info/20 flex items-center justify-center">
              <span className="text-heading-lg font-bold text-info">5</span>
            </div>
            <div>
              <h3 className="text-heading-xl text-foreground mb-2 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-info" />
                Grow and Earn
              </h3>
              <p className="text-body-md text-foreground-secondary">
                Track usage, collect payments, and iterate based on user
                feedback. We handle the infrastructure, you focus on building.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border bg-gradient-to-b from-background to-background-secondary">
        <div className="section-container section-padding">
          <div className="card bg-gradient-to-br from-brand-950/30 to-electric-950/30 border-brand-500/20 p-8 md:p-16 text-center">
            <h2 className="text-display-md md:text-display-lg text-foreground">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-body-lg text-foreground-secondary max-w-2xl mx-auto">
              Join hundreds of developers who trust Varity to distribute their
              apps. Submit your app today and get approved in 24-48 hours.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/submit"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-semibold transition-all duration-200 ease-out bg-brand-500 text-slate-950 hover:bg-brand-400 hover:shadow-[0_0_20px_rgba(20,184,166,0.5),0_0_40px_rgba(20,184,166,0.3)] h-14 px-10"
              >
                Submit Your App
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium transition-all duration-200 border border-border bg-transparent text-foreground hover:bg-background-quaternary hover:border-brand-500 h-14 px-10"
              >
                View Your Dashboard
              </Link>
            </div>
            <p className="mt-6 text-sm text-foreground-muted">
              Questions?{" "}
              <a
                href="https://docs.varity.so"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-400 hover:text-brand-300 transition-colors"
              >
                Read our documentation
              </a>{" "}
              or{" "}
              <a
                href="mailto:support@varity.so"
                className="text-brand-400 hover:text-brand-300 transition-colors"
              >
                contact support
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
