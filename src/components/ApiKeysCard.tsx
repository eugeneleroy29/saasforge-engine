'use client';

import React, { useState } from 'react';
import { useSaaS } from '@/context/SaaSContext';
import { Check, Copy, Key, Lock, Plus, ShieldAlert, Trash2 } from 'lucide-react';

export function ApiKeysCard() {
  const { state, generateApiKey, revokeApiKey, openUpgradeModal } = useSaaS();
  const [newKeyName, setNewKeyName] = useState('');
  const [justGeneratedKey, setJustGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isFreeTier = state.currentTier === 'free';

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFreeTier) {
      openUpgradeModal('pro');
      return;
    }
    const { rawSecret } = generateApiKey(newKeyName || 'Production Secret');
    setJustGeneratedKey(rawSecret);
    setNewKeyName('');
  };

  const copySecret = (secret: string) => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 md:p-6 flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Developer API Keys</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Provision scoped authorization tokens for backend microservices and CI/CD pipelines.
          </p>
        </div>

        {/* Generate Key Form */}
        <form onSubmit={handleCreateKey} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Key Label (e.g. Prod Backend)"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            disabled={isFreeTier}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-950 transition whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Secret Key
          </button>
        </form>
      </div>

      {/* Paywall Banner for Free Tier */}
      {isFreeTier && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-xs">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              <strong>Developer API Key Generation</strong> is restricted to <strong>PRO</strong> and{' '}
              <strong>ENTERPRISE</strong> subscriptions.
            </span>
          </div>
          <button
            onClick={() => openUpgradeModal('pro')}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs transition shrink-0 ml-2"
          >
            Upgrade to Pro
          </button>
        </div>
      )}

      {/* One-Time Secret Reveal Banner */}
      {justGeneratedKey && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4" />
            Save your secret key now. You will not be able to see it again!
          </div>
          <div className="flex items-center justify-between bg-zinc-950 border border-amber-500/40 rounded-lg px-3 py-2">
            <span className="font-mono text-xs text-amber-200 select-all break-all">
              {justGeneratedKey}
            </span>
            <button
              onClick={() => copySecret(justGeneratedKey)}
              className="flex items-center gap-1 ml-3 px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Key'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Keys List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="border-b border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="pb-2 font-medium">Name & Prefix</th>
              <th className="pb-2 font-medium">Secret Token</th>
              <th className="pb-2 font-medium">Created</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-850">
            {state.apiKeys.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 text-center text-zinc-400">
                  No active API keys found. Generate one above.
                </td>
              </tr>
            ) : (
              state.apiKeys.map((k) => (
                <tr key={k.id} className="hover:bg-zinc-900/40">
                  <td className="py-3 font-semibold text-white">{k.name}</td>
                  <td className="py-3 font-mono text-zinc-400">{k.secretMasked}</td>
                  <td className="py-3 text-zinc-400">
                    {new Date(k.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        k.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {k.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {k.status === 'active' ? (
                      <button
                        onClick={() => revokeApiKey(k.id)}
                        className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 transition text-[11px]"
                        title="Revoke API key"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Revoke
                      </button>
                    ) : (
                      <span className="text-zinc-400 text-[11px]">Revoked</span>
                    )}
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