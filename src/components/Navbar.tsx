'use client';

import React from 'react';
import { useSaaS } from '@/context/SaaSContext';
import { TierType } from '@/lib/types';
import { TIERS } from '@/lib/constants';
import { formatNumber } from '@/lib/utils';
import { Cpu, RotateCcw, Sparkles, ShieldCheck } from 'lucide-react';

export function Navbar() {
  const { state, setTier, resetAllData, activeTierConfig, remainingTokens, tokenUsagePercent, openUpgradeModal } =
    useSaaS();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-400/40">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-tight text-base sm:text-lg">
                SaaSForge <span className="text-indigo-400 font-semibold">Engine</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
                v1.0 Live
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Multi-Tenant AI SaaS & Token Metering Hub
            </p>
          </div>
        </div>

        {/* Floating Evaluator Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
            <span className="text-[11px] font-semibold text-zinc-400 px-2 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Role Switcher:
            </span>
            {(['free', 'pro', 'enterprise'] as TierType[]).map((t) => {
              const active = state.currentTier === t;
              return (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {TIERS[t].name.split(' ')[0]}
                </button>
              );
            })}
          </div>

          {/* Quick Token Badge */}
          <button
            onClick={() => openUpgradeModal()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition"
            title="Click to view plans & upgrade"
          >
            <div className="text-right hidden sm:block">
              <div className="text-[10px] text-zinc-400 leading-tight">Monthly Quota</div>
              <div className="text-xs font-bold text-zinc-200">
                {formatNumber(remainingTokens)}{' '}
                <span className="text-zinc-400 font-normal text-[10px]">left</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center relative">
              <span
                className={`text-[10px] font-bold ${
                  tokenUsagePercent > 85
                    ? 'text-rose-400'
                    : tokenUsagePercent > 50
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {tokenUsagePercent}%
              </span>
            </div>
          </button>

          {/* Upgrade Plan Button */}
          <button
            onClick={() => openUpgradeModal()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-950 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Upgrade
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={resetAllData}
            title="Reset sandbox state to defaults"
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Role Switcher Sub-bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 border-t border-zinc-900 bg-zinc-950/60 text-xs">
        <span className="text-zinc-400 text-[11px] font-medium">Role:</span>
        <div className="flex gap-1.5">
          {(['free', 'pro', 'enterprise'] as TierType[]).map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                state.currentTier === t
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
              }`}
            >
              {TIERS[t].name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}