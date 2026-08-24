'use client';

import React from 'react';
import { useSaaS } from '@/context/SaaSContext';
import { formatNumber, formatCurrency } from '@/lib/utils';
import { Activity, Gauge, Key, ShieldCheck } from 'lucide-react';

export function MetricCards() {
  const { state, activeTierConfig, tokenUsagePercent, remainingTokens } = useSaaS();

  // Compute total simulated cost from logs
  const totalCostUsd = state.activityLogs.reduce((acc, curr) => acc + curr.costUsd, 0);
  const activeKeysCount = state.apiKeys.filter((k) => k.status === 'active').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Monthly Token Meter */}
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Token Usage (Monthly)</span>
          <Gauge className="w-4 h-4 text-indigo-400" />
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">
              {formatNumber(state.tokensUsedThisMonth)}
            </span>
            <span className="text-xs text-zinc-400 font-medium font-mono">
              / {formatNumber(activeTierConfig.monthlyTokens)}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mt-3">
            <div
              className={`h-full transition-all duration-500 ${
                tokenUsagePercent > 85
                  ? 'bg-rose-500'
                  : tokenUsagePercent > 60
                  ? 'bg-amber-500'
                  : 'bg-indigo-500'
              }`}
              style={{ width: `${tokenUsagePercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-zinc-400 mt-2">
            <span>{tokenUsagePercent}% consumed</span>
            <span className="font-semibold text-zinc-300 font-mono">{formatNumber(remainingTokens)} remaining</span>
          </div>
        </div>
      </div>

      {/* 2. Active Subscription Tier */}
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Active Subscription</span>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white capitalize">{activeTierConfig.name}</div>
          <p className="text-xs text-zinc-400 mt-1">
            Max {activeTierConfig.maxRequestsPerMin} req/min &bull;{' '}
            {activeTierConfig.hasApiAccess ? 'API Keys Active' : 'Web Sandbox Only'}
          </p>
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Active Account Status
        </div>
      </div>

      {/* 3. Total Requests Executed */}
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Total AI Queries</span>
          <Activity className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white font-mono">{state.totalRequestsMade}</div>
          <p className="text-xs text-zinc-400 mt-1">
            Est. Cost: <span className="text-zinc-200 font-semibold font-mono">{formatCurrency(totalCostUsd)}</span>
          </p>
        </div>
        <div className="mt-3 text-[11px] text-zinc-400">
          Telemetry logged across {state.activityLogs.length} events
        </div>
      </div>

      {/* 4. Active API Keys */}
      <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-zinc-400 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">Developer API Keys</span>
          <Key className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white font-mono">{activeKeysCount} Active</div>
          <p className="text-xs text-zinc-400 mt-1">
            {state.currentTier === 'free' ? 'Paywalled on Free tier' : 'Sub-500ms Edge Gateway'}
          </p>
        </div>
        <div className="mt-3 text-[11px] text-zinc-400">
          {state.apiKeys.length} total generated keys
        </div>
      </div>
    </div>
  );
}