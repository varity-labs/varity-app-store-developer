"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useContract } from "@/hooks/useContract";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { varityL3 } from "@/lib/thirdweb";

export default function InitializePage() {
  const { authenticated, login } = useAuth();
  const { initialize, isLoading, error, txHash, account } = useContract();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInitialize = async () => {
    if (!account) {
      setErrorMessage("Please connect your wallet first");
      setStatus("error");
      return;
    }

    setStatus("idle");
    setErrorMessage("");

    try {
      await initialize();
      setStatus("success");
    } catch (err) {
      console.error("Initialization error:", err);
      const message = err instanceof Error ? err.message : "Failed to initialize contract";
      setErrorMessage(message);
      setStatus("error");
    }
  };

  if (!authenticated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <h1 className="text-xl font-semibold text-slate-100">Contract Initialization</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to initialize the contract.</p>
        <button
          onClick={login}
          className="mt-4 rounded-md bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-white"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100">Initialize Contract</h1>
        <p className="mt-2 text-sm text-slate-500">
          This is a one-time setup that sets the deployer as the first admin.
        </p>
      </div>

      {/* Success message */}
      {status === "success" && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-900 bg-emerald-950/50 p-4">
          <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald-400" />
          <div className="flex-1">
            <h3 className="font-medium text-emerald-400">Contract Initialized Successfully!</h3>
            <p className="mt-1 text-sm text-emerald-400/80">
              The contract has been initialized. Your wallet address is now set as admin.
            </p>
            {txHash && varityL3.blockExplorers?.[0] && (
              <a
                href={`${varityL3.blockExplorers[0].url}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 underline"
              >
                View transaction
              </a>
            )}
            <p className="mt-4 text-sm text-emerald-400">
              You can now:
            </p>
            <ul className="mt-2 list-disc list-inside text-sm text-emerald-400/80">
              <li>Submit applications from the Submit page</li>
              <li>Approve applications from the Admin page</li>
              <li>Add additional admins using add_admin function</li>
            </ul>
          </div>
        </div>
      )}

      {/* Error message */}
      {status === "error" && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-900 bg-red-950/50 p-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
          <div>
            <h3 className="font-medium text-red-400">Initialization Failed</h3>
            <p className="mt-1 text-sm text-red-400/80">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Contract info */}
      <div className="mb-6 rounded-lg border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="text-lg font-medium text-slate-100">Contract Information</h2>
        <div className="mt-4 space-y-3 text-sm">
          <div>
            <span className="text-slate-500">Contract Address:</span>
            <p className="mt-1 font-mono text-slate-300">0x3faa42a8639fcb076160d553e8d6e05add7d97a5</p>
          </div>
          <div>
            <span className="text-slate-500">Network:</span>
            <p className="mt-1 text-slate-300">Varity L3 Testnet (Chain ID: 33529)</p>
          </div>
          <div>
            <span className="text-slate-500">Your Wallet:</span>
            <p className="mt-1 font-mono text-slate-300">{account?.address || "Not connected"}</p>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-900 bg-amber-950/50 p-4">
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-400" />
        <div>
          <h3 className="font-medium text-amber-400">Important</h3>
          <p className="mt-1 text-sm text-amber-400/80">
            This function should only be called ONCE. If the contract is already initialized,
            this transaction will fail (which is expected behavior).
          </p>
        </div>
      </div>

      {/* Initialize button */}
      <div className="flex justify-center">
        <button
          onClick={handleInitialize}
          disabled={isLoading || status === "success"}
          className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-6 py-3 text-sm font-medium text-slate-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? "Initializing Contract..." : status === "success" ? "Already Initialized" : "Initialize Contract"}
        </button>
      </div>
    </div>
  );
}
