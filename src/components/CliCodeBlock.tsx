"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface Command {
  comment: string;
  command: string;
  output?: string[];
}

const commands: Command[] = [
  {
    comment: "# Install the Varity CLI",
    command: "npm install -g @varity/cli",
  },
  {
    comment: "# Initialize your project",
    command: "varity init",
    output: ["Created varity.config.ts", "Connected to Varity Network"],
  },
  {
    comment: "# Deploy to production",
    command: "varity deploy --prod",
    output: [
      "Build completed in 45s",
      "Deployed to https://myapp.varity.so",
    ],
  },
];

export default function CliCodeBlock() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (command: string, index: number) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
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
            {commands.map((cmd, index) => (
              <div key={index} className="group relative">
                <span className="text-foreground-muted">{cmd.comment}</span>
                <div className="mt-1 flex items-center justify-between">
                  <div>
                    <span className="text-brand-400">$</span>{" "}
                    <span className="text-foreground">{cmd.command}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(cmd.command, index)}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-background-tertiary text-foreground-muted hover:text-foreground-secondary"
                    aria-label={`Copy command: ${cmd.command}`}
                  >
                    {copiedIndex === index ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {cmd.output && (
                  <div className="mt-2 text-foreground-muted text-xs">
                    {cmd.output.map((line, lineIndex) => (
                      <div key={lineIndex}>
                        <span className="text-success">&#x2713;</span> {line}
                      </div>
                    ))}
                    {index === commands.length - 1 && (
                      <div>
                        <span className="text-brand-400">&#x2192;</span> Submit for review at /submit
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
