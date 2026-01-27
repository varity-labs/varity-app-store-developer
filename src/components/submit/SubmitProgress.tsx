"use client";

import { CheckCircle, Circle } from "lucide-react";

/** Step definition for the progress indicator */
export interface Step {
  id: number;
  name: string;
  description: string;
}

/** Props for the SubmitProgress component */
export interface SubmitProgressProps {
  /** Array of step definitions */
  steps: Step[];
  /** Current active step (1-indexed) */
  currentStep: number;
  /** Callback when a step is clicked (optional) */
  onStepClick?: (step: number) => void;
}

/**
 * Progress indicator for multi-step form submission.
 *
 * Shows the current step, completed steps, and upcoming steps with
 * visual differentiation. Includes step names and descriptions.
 *
 * Designed for conversion optimization - shows progress and reduces anxiety.
 */
export default function SubmitProgress({
  steps,
  currentStep,
  onStepClick,
}: SubmitProgressProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      {/* Encouraging header */}
      <div className="mb-6 text-center">
        <p className="text-sm font-medium text-brand-400">
          Step {currentStep} of {steps.length}
        </p>
        <p className="mt-1 text-lg font-semibold text-slate-100">
          {currentStep === 1 && "Just the basics to get started"}
          {currentStep === 2 && "Almost there - add the finishing touches"}
          {currentStep === 3 && "Review and launch your app"}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Takes about 5 minutes to complete
        </p>
      </div>

      {/* Progress bar */}
      <div className="relative">
        {/* Background track */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-800" aria-hidden="true" />

        {/* Progress fill */}
        <div
          className="absolute top-4 left-0 h-0.5 bg-brand-500 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          aria-hidden="true"
        />

        {/* Step indicators */}
        <ol className="relative flex justify-between">
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isClickable = onStepClick && step.id <= currentStep;

            return (
              <li key={step.id} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                    isCompleted
                      ? "bg-brand-500 text-slate-950"
                      : isCurrent
                      ? "bg-brand-500 text-slate-950 ring-4 ring-brand-500/20"
                      : "bg-slate-800 text-slate-500"
                  } ${isClickable ? "cursor-pointer hover:ring-4 hover:ring-brand-500/20" : "cursor-default"}`}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`${step.name} - ${isCompleted ? "completed" : isCurrent ? "current" : "upcoming"}`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </button>
                <div className="mt-2 text-center">
                  <p className={`text-xs font-medium ${isCurrent ? "text-brand-400" : isCompleted ? "text-slate-300" : "text-slate-500"}`}>
                    {step.name}
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-600 max-w-[80px]">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

/** Default steps for app submission */
export const SUBMIT_STEPS: Step[] = [
  {
    id: 1,
    name: "Basic Info",
    description: "Name & description",
  },
  {
    id: 2,
    name: "Details",
    description: "Optional extras",
  },
  {
    id: 3,
    name: "Submit",
    description: "Review & launch",
  },
];
