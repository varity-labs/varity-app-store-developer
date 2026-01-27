"use client";

import { CheckCircle, Clock, Star, Shield, Zap, TrendingUp } from "lucide-react";

/**
 * Benefits sidebar for the submit page.
 *
 * Displays key value propositions, social proof, and urgency elements
 * to maximize conversion rate for app submissions.
 *
 * Key conversion elements:
 * - Revenue share (70% to developer)
 * - Fast review time (24 hours)
 * - Early adopter bonus
 * - Trust signals (powered by partners)
 * - Save & Continue Later reminder
 */
export default function BenefitsSidebar() {
  return (
    <aside className="space-y-6" aria-label="Submission benefits">
      {/* Early Adopter Urgency Banner */}
      <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 to-amber-900/20 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Star className="h-5 w-5 text-amber-400 fill-amber-400" aria-hidden="true" />
          <span className="text-sm font-bold text-amber-300">Early Adopter Bonus</span>
        </div>
        <p className="text-sm text-amber-200/90">
          First <span className="font-bold">100 apps</span> get featured placement and priority review.
        </p>
        <p className="text-xs text-amber-200/70 mt-2">
          Limited spots available
        </p>
      </div>

      {/* Key Benefits */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Why developers love Varity</h3>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
              <TrendingUp className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">70% Revenue Share</p>
              <p className="text-xs text-slate-500">You keep the majority of your earnings</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-500/10">
              <Clock className="h-4 w-4 text-brand-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">24-Hour Review</p>
              <p className="text-xs text-slate-500">Average approval time for quality apps</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
              <Zap className="h-4 w-4 text-blue-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">70-85% Cost Savings</p>
              <p className="text-xs text-slate-500">Compared to traditional cloud hosting</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
              <Shield className="h-4 w-4 text-purple-400" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">Enterprise-Grade</p>
              <p className="text-xs text-slate-500">Built for scale and reliability</p>
            </div>
          </li>
        </ul>
      </div>

      {/* Save & Continue Later */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="h-4 w-4 text-brand-400" aria-hidden="true" />
          <span className="text-sm font-medium text-slate-200">Auto-Save Enabled</span>
        </div>
        <p className="text-xs text-slate-500">
          Your progress is automatically saved. Come back anytime to finish your submission.
        </p>
      </div>

      {/* Powered By - Trust Signals */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
        <p className="text-xs text-slate-500 mb-4 text-center">Enterprise-grade infrastructure</p>
        <div className="flex items-center justify-center gap-6">
          {/* Arbitrum Logo */}
          <div className="flex flex-col items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
            <div className="h-8 w-8 rounded-full bg-[#28A0F0]/10 flex items-center justify-center">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" fill="#28A0F0" fillOpacity="0.2" />
                <path d="M12 2l10 5v10l-10 5-10-5V7l10-5z" stroke="#28A0F0" strokeWidth="1.5" />
                <path d="M12 7l5 2.5v5L12 17l-5-2.5v-5L12 7z" fill="#28A0F0" />
              </svg>
            </div>
            <span className="text-[10px] text-slate-500">Arbitrum</span>
          </div>
          {/* thirdweb Logo */}
          <div className="flex flex-col items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
            <div className="h-8 w-8 rounded-full bg-[#F213A4]/10 flex items-center justify-center">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#F213A4" fillOpacity="0.2" />
                <circle cx="12" cy="12" r="10" stroke="#F213A4" strokeWidth="1.5" />
                <path d="M8 12h8M12 8v8" stroke="#F213A4" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[10px] text-slate-500">thirdweb</span>
          </div>
          {/* Privy Logo */}
          <div className="flex flex-col items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
            <div className="h-8 w-8 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="4" fill="#8B5CF6" fillOpacity="0.2" />
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="#8B5CF6" strokeWidth="1.5" />
                <path d="M8 12a4 4 0 108 0 4 4 0 00-8 0z" fill="#8B5CF6" />
              </svg>
            </div>
            <span className="text-[10px] text-slate-500">Privy</span>
          </div>
        </div>
      </div>

      {/* Live on Varity */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 text-center">
        <p className="text-xs text-emerald-400/80">
          Your app will be live on <span className="font-semibold text-emerald-400">Varity</span>
        </p>
        <p className="text-[10px] text-emerald-400/60 mt-1">
          Global infrastructure with 70-85% lower costs
        </p>
      </div>
    </aside>
  );
}
