import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="section-container py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo/varity-logo-color.svg"
                alt="Varity"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="font-display text-xl font-bold tracking-tight text-foreground">
                Varity
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-body-sm text-foreground-secondary">
              The curated marketplace for enterprise-grade Web3 applications. Deploy with confidence and save 70-85% compared to traditional cloud providers.
            </p>
          </div>

          {/* For Developers */}
          <div>
            <h3 className="text-overline text-foreground-muted">
              For Developers
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/submit"
                  className="text-body-sm text-foreground-secondary transition-colors hover:text-brand-400"
                >
                  Submit Application
                </Link>
              </li>
              <li>
                <a
                  href="https://docs.varity.so"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-foreground-secondary transition-colors hover:text-brand-400"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/varity-labs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-foreground-secondary transition-colors hover:text-brand-400"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-overline text-foreground-muted">
              Resources
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="https://www.varity.so"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-foreground-secondary transition-colors hover:text-brand-400"
                >
                  About Varity
                </a>
              </li>
              <li>
                <a
                  href="https://explorer-varity-testnet-rroe52pwjp.t.conduit.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-foreground-secondary transition-colors hover:text-brand-400"
                >
                  Network Status
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-caption text-foreground-muted">
            {new Date().getFullYear()} Varity Labs, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
