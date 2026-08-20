'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { MetricCards } from '@/components/MetricCards';
import { PlaygroundCard } from '@/components/PlaygroundCard';
import { ApiKeysCard } from '@/components/ApiKeysCard';
import { ActivityLogsCard } from '@/components/ActivityLogsCard';
import { UpgradeModal } from '@/components/UpgradeModal';
import { SaaSProvider } from '@/context/SaaSContext';

export default function Home() {
  return (
    <SaaSProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Top Banner Introduction */}
          <div className="rounded-2xl bg-gradient-to-r from-indigo-950/40 via-zinc-900/60 to-zinc-900/40 border border-indigo-500/20 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                AI SaaS Monetization & Token Metering Hub
              </h1>
              <p className="text-xs md:text-sm text-zinc-400 mt-1 max-w-2xl">
                Demonstrating multi-tenant token quotas, tier paywalls, real-time telemetry, and developer API key lifecycle on high-speed Groq LLM infrastructure.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Gateway Ready
              </span>
            </div>
          </div>

          {/* Key Metric Overview Cards */}
          <MetricCards />

          {/* Main Workspace Grid */}
          <div className="grid grid-cols-1 gap-6">
            <PlaygroundCard />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ApiKeysCard />
              <ActivityLogsCard />
            </div>
          </div>
        </main>

        <UpgradeModal />

        {/* Global Footer */}
        <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-400">
          <p>
            Built by <strong className="text-zinc-300">Eugene Leroy</strong> &bull; Phase 6 AI Product Engineer Portfolio Capstone &bull; Powered by Groq Cloud & Next.js 15
          </p>
        </footer>
      </div>
    </SaaSProvider>
  );
}