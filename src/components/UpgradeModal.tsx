'use client';

import React from 'react';
import { useSaaS } from '@/context/SaaSContext';
import { TIERS } from '@/lib/constants';
import { TierType } from '@/lib/types';
import { Check, Sparkles, X, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export function UpgradeModal() {
  const { isUpgradeModalOpen, closeUpgradeModal, simulateUpgrade, state } = useSaaS();

  if (!isUpgradeModalOpen) return null;

  const handleSelectTier = (tier: TierType) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    simulateUpgrade(tier);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={closeUpgradeModal}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Tier Upgrade Simulator
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Unlock High-Throughput AI Compute
          </h2>
          <p className="text-zinc-400 text-sm mt-2">
            Switch plans to unlock higher token quotas, flagship reasoning models (`openai/gpt-oss-120b`), and live API keys.
          </p>
        </div>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {(['free', 'pro', 'enterprise'] as TierType[]).map((tierKey) => {
            const tier = TIERS[tierKey];
            const isCurrent = state.currentTier === tierKey;

            return (
              <div
                key={tier.id}
                className={`relative flex flex-col rounded-xl border p-5 transition ${
                  isCurrent
                    ? 'border-indigo-500/80 bg-zinc-900/90 ring-1 ring-indigo-500/40'
                    : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                }`}
              >
                {tier.id === 'pro' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow">
                    MOST POPULAR
                  </div>
                )}

                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                </div>

                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-extrabold text-white">
                    ${tier.priceMonthly}
                  </span>
                  <span className="text-xs text-zinc-400">/ month</span>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1 text-xs text-zinc-300">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectTier(tierKey)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 transition ${
                    isCurrent
                      ? 'bg-zinc-800 text-zinc-400 cursor-default border border-zinc-700'
                      : tierKey === 'enterprise'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950'
                  }`}
                >
                  {isCurrent ? (
                    'Current Active Plan'
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      Switch to {tier.name}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-zinc-400 mt-6">
          * This is a live simulation. Selecting any tier instantly provisions token balances and unlocks model permissions in state.
        </p>
      </div>
    </div>
  );
}