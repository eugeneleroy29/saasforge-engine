'use client';

import React from 'react';
import { useSaaS } from '@/context/SaaSContext';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { Activity, Clock, Zap } from 'lucide-react';

export function ActivityLogsCard() {
  const { state } = useSaaS();

  return (
    <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 md:p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Live AI Telemetry & Usage Logs</h2>
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Real-time Stream</span>
        </div>
      </div>

      <div className="overflow-x-auto max-h-72 overflow-y-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="sticky top-0 bg-zinc-950/90 backdrop-blur border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="pb-2 font-medium">Timestamp</th>
              <th className="pb-2 font-medium">Model</th>
              <th className="pb-2 font-medium">Tokens (In / Out)</th>
              <th className="pb-2 font-medium">Latency</th>
              <th className="pb-2 font-medium">Est. Cost</th>
              <th className="pb-2 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-850">
            {state.activityLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-zinc-400">
                  No telemetry logs recorded yet. Execute an AI query above to see live events.
                </td>
              </tr>
            ) : (
              state.activityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-900/40 transition">
                  <td className="py-2.5 font-mono text-[11px] text-zinc-400">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-2.5">
                    <span className="font-semibold text-zinc-200">{log.model}</span>
                  </td>
                  <td className="py-2.5 font-mono text-zinc-300">
                    {formatNumber(log.promptTokens)} <span className="text-zinc-400">&rarr;</span>{' '}
                    {formatNumber(log.completionTokens)}{' '}
                    <span className="text-zinc-400">({formatNumber(log.totalTokens)})</span>
                  </td>
                  <td className="py-2.5 font-mono text-emerald-400">
                    {log.latencyMs}ms
                  </td>
                  <td className="py-2.5 font-mono text-zinc-400">
                    {formatCurrency(log.costUsd)}
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <Zap className="w-3 h-3" />
                      200 OK
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}