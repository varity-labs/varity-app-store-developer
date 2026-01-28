import Link from "next/link";
import {
  ArrowRight,
  DollarSign,
  Clock,
  TrendingUp,
  Upload,
  Terminal,
  Code2,
  Lock,
  Check,
  BookOpen,
  Package,
  ExternalLink,
  Shield,
  Users,
  Zap,
  Globe,
} from "lucide-react";
import CliCodeBlock from "@/components/CliCodeBlock";
import {
  StructuredData,
  createFAQSchema,
  developerFAQData,
} from "@/components/StructuredData";

export default function DeveloperLandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Maximum Conversion Focus */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/20 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--brand-500)/8,transparent_60%)]" />

        <div className="relative section-container py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-display-lg md:text-display-xl text-foreground leading-[1.1]">
              Keep 70% of Your Revenue.{" "}
              <span className="text-gradient">Launch in 24 Hours.</span>
            </h1>

            <p className="mt-6 text-body-lg text-foreground-secondary leading-relaxed max-w-2xl mx-auto">
              Varity is the developer marketplace where you keep more of what you earn,
              get reviewed in a day instead of weeks, and pay 70-85% less for hosting.
            </p>

            {/* Key Stats - Inline */}
            <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-brand-400" aria-hidden="true" />
                <span className="text-foreground-secondary">
                  <span className="text-foreground font-semibold">70%</span> you keep
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-400" aria-hidden="true" />
                <span className="text-foreground-secondary">
                  <span className="text-foreground font-semibold">24h</span> review time
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-brand-400" aria-hidden="true" />
                <span className="text-foreground-secondary">
                  <span className="text-foreground font-semibold">85%</span> hosting savings
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/submit"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-semibold transition-all duration-200 ease-out bg-brand-500 text-slate-950 hover:bg-brand-400 h-12 px-8 shadow-lg shadow-brand-500/25"
              >
                Submit Your App
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href="https://docs.varity.so"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-medium transition-all duration-200 border border-border bg-transparent text-foreground hover:bg-background-quaternary hover:border-foreground-muted h-12 px-8"
              >
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Read the Docs
              </a>
            </div>

            {/* Urgency Line */}
            <p className="mt-6 text-sm text-foreground-muted">
              Early access: First 100 apps get featured placement
            </p>
          </div>
        </div>
      </section>

      {/* Integration Section - Deploy in minutes */}
      <section className="section-container section-padding" aria-labelledby="integration-heading">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-overline text-brand-400 mb-3">INTEGRATION</p>
            <h2 id="integration-heading" className="text-display-md text-foreground mb-4">
              Deploy in minutes, not days
            </h2>
            <p className="text-body-md text-foreground-secondary mb-8">
              Use our CLI to deploy your app, or simply submit your existing application.
              No code changes required for basic listing.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                  <Terminal className="h-5 w-5 text-brand-400" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-heading-md text-foreground mb-1">CLI-first deployment</h3>
                  <p className="text-body-sm text-foreground-secondary">
                    Deploy with a single command. Our CLI handles the rest.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-electric-500/10 flex items-center justify-center shrink-0">
                  <Code2 className="h-5 w-5 text-electric-400" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-heading-md text-foreground mb-1">Optional SDK</h3>
                  <p className="text-body-sm text-foreground-secondary">
                    Add payments, analytics, and more with our TypeScript SDK.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                  <Lock className="h-5 w-5 text-success" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-heading-md text-foreground mb-1">Built-in security</h3>
                  <p className="text-body-sm text-foreground-secondary">
                    Secure authentication and encrypted data storage included.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Code Block */}
          <CliCodeBlock />
        </div>
      </section>

      {/* Two Paths Section */}
      <section className="border-y border-border bg-background-secondary/30" aria-labelledby="paths-heading">
        <div className="section-container section-padding">
          <div className="text-center mb-12">
            <h2 id="paths-heading" className="text-display-md text-foreground mb-4">Two paths to launch</h2>
            <p className="text-body-md text-foreground-secondary max-w-2xl mx-auto">
              Whether you have an existing app or you&apos;re building something new,
              we&apos;ve got you covered.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Path A - Existing App */}
              <div className="group rounded-xl border border-border bg-background-secondary p-8 hover:border-brand-500/50 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-brand-400" aria-hidden="true" />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
                    <span className="text-xs font-semibold text-brand-400">PATH A</span>
                  </div>
                </div>

                <h3 className="text-heading-xl text-foreground mb-3">Already have an app?</h3>
                <p className="text-body-md text-foreground-secondary mb-6">
                  Submit your existing application today. No SDK required, no code changes
                  needed. Just fill out the form and we&apos;ll handle the rest.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-brand-400 shrink-0" aria-hidden="true" />
                    <span className="text-body-sm text-foreground-secondary">
                      Works with any tech stack
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-brand-400 shrink-0" aria-hidden="true" />
                    <span className="text-body-sm text-foreground-secondary">
                      10 minute submission process
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-brand-400 shrink-0" aria-hidden="true" />
                    <span className="text-body-sm text-foreground-secondary">
                      Connect GitHub for auto-fill
                    </span>
                  </li>
                </ul>

                <Link
                  href="/submit"
                  className="inline-flex items-center justify-center gap-2 w-full whitespace-nowrap rounded-lg text-base font-semibold transition-all duration-200 ease-out bg-brand-500 text-slate-950 hover:bg-brand-400 h-12 px-8"
                >
                  Submit Your App Now
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              {/* Path B - Building New */}
              <div className="group rounded-xl border border-border bg-background-secondary p-8 hover:border-electric-500/50 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-electric-500/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-electric-400" aria-hidden="true" />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-electric-500/10 border border-electric-500/20">
                    <span className="text-xs font-semibold text-electric-400">PATH B</span>
                  </div>
                </div>

                <h3 className="text-heading-xl text-foreground mb-3">Building something new?</h3>
                <p className="text-body-md text-foreground-secondary mb-6">
                  Start with our SDK and packages for built-in payments, authentication,
                  and analytics. Deploy with one command.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-electric-400 shrink-0" aria-hidden="true" />
                    <span className="text-body-sm text-foreground-secondary">
                      TypeScript SDK with full types
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-electric-400 shrink-0" aria-hidden="true" />
                    <span className="text-body-sm text-foreground-secondary">
                      Built-in payments and auth
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-electric-400 shrink-0" aria-hidden="true" />
                    <span className="text-body-sm text-foreground-secondary">
                      CLI-first deployment
                    </span>
                  </li>
                </ul>

                <a
                  href="https://docs.varity.so"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full whitespace-nowrap rounded-lg text-base font-medium transition-all duration-200 border border-electric-500/50 bg-electric-500/10 text-electric-400 hover:bg-electric-500/20 h-12 px-8"
                >
                  View Documentation
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals Section - E-E-A-T Compliance */}
      <section className="section-container section-padding" aria-labelledby="trust-heading">
        <div className="text-center mb-12">
          <p className="text-overline text-brand-400 mb-3">WHY DEVELOPERS TRUST US</p>
          <h2 id="trust-heading" className="text-display-md text-foreground mb-4">
            Built for developers, by developers
          </h2>
          <p className="text-body-md text-foreground-secondary max-w-2xl mx-auto">
            We understand what it takes to ship products. Our platform is designed with security,
            reliability, and developer experience as top priorities.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="rounded-xl border border-border bg-background-secondary/50 p-6">
            <Shield className="h-6 w-6 text-brand-400 mb-4" aria-hidden="true" />
            <h3 className="text-heading-md text-foreground mb-2">Enterprise-Grade Security</h3>
            <p className="text-body-sm text-foreground-secondary">
              Secure infrastructure with encrypted data storage and authentication via Privy.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background-secondary/50 p-6">
            <Users className="h-6 w-6 text-brand-400 mb-4" aria-hidden="true" />
            <h3 className="text-heading-md text-foreground mb-2">Built by Web3 Experts</h3>
            <p className="text-body-sm text-foreground-secondary">
              Our team has shipped products at leading blockchain companies. We understand developer needs.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background-secondary/50 p-6">
            <Zap className="h-6 w-6 text-brand-400 mb-4" aria-hidden="true" />
            <h3 className="text-heading-md text-foreground mb-2">Decentralized Infrastructure</h3>
            <p className="text-body-sm text-foreground-secondary">
              Powered by Arbitrum L3, Akash Network, and IPFS for reliable, censorship-resistant hosting.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background-secondary/50 p-6">
            <Globe className="h-6 w-6 text-brand-400 mb-4" aria-hidden="true" />
            <h3 className="text-heading-md text-foreground mb-2">Open Source SDK</h3>
            <p className="text-body-sm text-foreground-secondary">
              MIT-licensed SDK and CLI tools. Review the code on GitHub before you deploy.
            </p>
          </div>
        </div>

        {/* Additional Trust Badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-foreground-muted">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-success" aria-hidden="true" />
            <span>HTTPS Secured</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-success" aria-hidden="true" />
            <span>GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-success" aria-hidden="true" />
            <span>24/7 Uptime Monitoring</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-success" aria-hidden="true" />
            <span>Transparent Pricing</span>
          </div>
        </div>
      </section>

      {/* FAQ Section - SEO and E-E-A-T */}
      <section className="border-t border-border bg-background-secondary/30" aria-labelledby="faq-heading">
        <StructuredData data={createFAQSchema(developerFAQData)} id="faq-schema" />
        <div className="section-container section-padding">
          <div className="text-center mb-12">
            <p className="text-overline text-brand-400 mb-3">FAQ</p>
            <h2 id="faq-heading" className="text-display-md text-foreground mb-4">
              Frequently asked questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <dl className="space-y-4">
              {developerFAQData.map((faq, index) => (
                <div key={index} className="rounded-xl border border-border bg-background-secondary p-6">
                  <dt className="text-heading-md text-foreground">{faq.question}</dt>
                  <dd className="mt-3 text-body-sm text-foreground-secondary">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-container section-padding" aria-labelledby="cta-heading">
        <div className="text-center">
          <h2 id="cta-heading" className="text-display-md text-foreground mb-6">Ready to launch your app?</h2>
          <Link
            href="/submit"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-semibold transition-all duration-200 ease-out bg-brand-500 text-slate-950 hover:bg-brand-400 h-12 px-8 shadow-lg shadow-brand-500/25"
          >
            Submit Your App
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
