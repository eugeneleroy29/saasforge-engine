'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { MetricCards } from '@/components/MetricCards';
import { PlaygroundCard } from '@/components/PlaygroundCard';
import { ApiKeysCard } from '@/components/ApiKeysCard';
import { ActivityLogsCard } from '@/components/ActivityLogsCard';
import { UpgradeModal } from '@/components/UpgradeModal';
import { SaaSProvider } from '@/context/SaaSContext';
import { Code, ChevronDown, ChevronUp, Activity } from 'lucide-react';

export default function Home() {
  const [showAuditorMode, setShowAuditorMode] = useState(false);

  return (
    <SaaSProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Top Banner Introduction */}
          <div className="rounded-2xl bg-gradient-to-r from-indigo-950/40 via-zinc-900/60 to-zinc-900/40 border border-indigo-500/20 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                AI SaaS Monetization &amp; Token Metering Engine
              </h1>
              <p className="text-xs md:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                Explore how modern AI platforms manage user subscription tiers, meter token consumption, enforce paywalls for premium models, and issue developer API keys in real time.
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

          {/* Collapsible Developer & Auditor Drawer */}
          <div className="border border-zinc-800 rounded-2xl bg-zinc-900/50 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAuditorMode(!showAuditorMode)}
              className="w-full px-5 py-3.5 flex items-center justify-between text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 transition-all"
            >
              <span className="flex items-center gap-2">
                <Code size={14} className="text-amber-400" />
                🔬 Developer &amp; System Telemetry Mode
              </span>
              <span className="flex items-center gap-1.5 text-zinc-500 font-mono">
                {showAuditorMode ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </span>
            </button>

            {showAuditorMode && (
              <div className="p-5 border-t border-zinc-800 bg-zinc-950/80 space-y-4 text-xs font-mono text-zinc-400">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <p className="text-zinc-500 text-[10px] uppercase font-bold">Quota Engine</p>
                    <p className="text-amber-300 font-bold mt-1 flex items-center gap-1.5">
                      <Activity size={12} className="text-amber-400" /> Token-Bucket Metering
                    </p>
                  </div>
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <p className="text-zinc-500 text-[10px] uppercase font-bold">Model Tier Gates</p>
                    <p className="text-indigo-300 font-bold mt-1">Free &bull; Pro &bull; Enterprise</p>
                  </div>
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <p className="text-zinc-500 text-[10px] uppercase font-bold">Inference Speed</p>
                    <p className="text-emerald-300 font-bold mt-1">Sub-500ms Groq Cloud</p>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
                  Auditor Note: SaaSForge Engine enforces zero-leakage token boundaries on the server before dispatching calls to Groq endpoints, calculating exact cost-per-thousand tokens and persisting granular audit logs.
                </p>
              </div>
            )}
          </div>
        </main>

        <UpgradeModal />

        {/* Global Footer */}
        <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
          <p>
            Built by <strong className="text-zinc-300">Eugene Leroy</strong> &bull; AI Product Engineer &bull; Powered by Groq Cloud &amp; Next.js
          </p>
        </footer>
      </div>
    </SaaSProvider>
  );
}