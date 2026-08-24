'use client';

import React, { useState } from 'react';
import { useSaaS } from '@/context/SaaSContext';
import { AVAILABLE_MODELS } from '@/lib/constants';
import { AIModelConfig } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import { AlertCircle, Bot, Check, Copy, Flame, Lock, Play, Sparkles, Terminal } from 'lucide-react';

const PROMPT_TEMPLATES = [
  {
    label: 'Rate Limiter Middleware',
    prompt: 'Write a production-grade TypeScript token-bucket rate limiter middleware for Next.js API routes with Redis fallback.'
  },
  {
    label: 'Database Index Audit',
    prompt: 'Analyze this SQL scenario: A table with 12M user events suffers slow indexing on (user_id, created_at). Recommend an optimal partition strategy.'
  },
  {
    label: 'Multi-Tenant Architecture',
    prompt: 'Summarize the top 3 architectural trade-offs between Schema-per-tenant vs. Shared-schema with row-level security in PostgreSQL.'
  }
];

export function PlaygroundCard() {
  const { state, activeTierConfig, recordUsage, openUpgradeModal } = useSaaS();

  const [selectedModel, setSelectedModel] = useState<string>('groq/compound-mini');
  const [prompt, setPrompt] = useState<string>(PROMPT_TEMPLATES[0].prompt);
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUsage, setLastUsage] = useState<{
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    latencyMs: number;
    costUsd: number;
  } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedModelConfig = AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[0];
  const isModelLocked = !activeTierConfig.allowedModels.includes(selectedModel);

  const handleSelectModel = (model: AIModelConfig) => {
    setSelectedModel(model.id);
    setErrorMessage(null);
    if (!activeTierConfig.allowedModels.includes(model.id)) {
      openUpgradeModal(model.minTier);
    }
  };

  const handleRunAI = async () => {
    if (!prompt.trim()) return;

    if (isModelLocked) {
      openUpgradeModal(selectedModelConfig.minTier);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setResponse('');

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model: selectedModel,
          tier: state.currentTier,
          currentTokensUsed: state.tokensUsedThisMonth
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.upgradeRequired || data.quotaExceeded) {
          openUpgradeModal(data.requiredTier || 'pro');
        }
        throw new Error(data.error || 'Failed to generate response.');
      }

      setResponse(data.text);
      setLastUsage(data.usage);

      // Record to global SaaS telemetry store
      recordUsage({
        model: selectedModel,
        promptTokens: data.usage.promptTokens,
        completionTokens: data.usage.completionTokens,
        totalTokens: data.usage.totalTokens,
        latencyMs: data.usage.latencyMs,
        status: 'success',
        promptPreview: prompt.slice(0, 100),
        costUsd: data.usage.costUsd
      });
    } catch (err: unknown) {
      const e = err as { message?: string };
      setErrorMessage(e.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyResponse = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 md:p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">✨ Interactive AI Model Sandbox</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Test multi-model inference. Each query dynamically decrements your monthly token quota.
          </p>
        </div>

        {/* Model Selector Pills */}
        <div className="flex flex-wrap gap-1.5">
          {AVAILABLE_MODELS.map((model) => {
            const isLocked = !activeTierConfig.allowedModels.includes(model.id);
            const isSelected = selectedModel === model.id;

            return (
              <button
                key={model.id}
                onClick={() => handleSelectModel(model)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950'
                    : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800 border border-zinc-700/60'
                }`}
              >
                {isLocked && <Lock className="w-3 h-3 text-amber-400" />}
                <span>{model.name}</span>
                {model.badge && (
                  <span className="hidden md:inline text-[9px] opacity-75">
                    ({model.badge})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Model Notice if Locked */}
      {isModelLocked && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>{selectedModelConfig.name}</strong> is locked on your current plan ({state.currentTier.toUpperCase()}). Upgrade to{' '}
              <strong>{selectedModelConfig.minTier.toUpperCase()}</strong> to execute.
            </span>
          </div>
          <button
            onClick={() => openUpgradeModal(selectedModelConfig.minTier)}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs transition shrink-0 ml-2"
          >
            Upgrade Plan
          </button>
        </div>
      )}

      {/* Prompt Templates */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-zinc-400 text-[11px] font-semibold whitespace-nowrap">✨ Quick Prompts:</span>
        {PROMPT_TEMPLATES.map((tpl, i) => (
          <button
            key={i}
            onClick={() => setPrompt(tpl.prompt)}
            className="px-2.5 py-1 rounded-md bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-[11px] whitespace-nowrap transition active:scale-95"
          >
            {tpl.label}
          </button>
        ))}
      </div>

      {/* Prompt Input Box */}
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          placeholder="Enter a prompt or question for the AI..."
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition resize-y font-mono"
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
          <span className="text-[11px] text-zinc-400">
            Selected: <strong className="text-zinc-300">{selectedModelConfig.name}</strong> &bull; Cost:{' '}
            <strong className="text-indigo-400">${selectedModelConfig.costPer1kTokens}/1k tokens</strong>
          </span>
          <button
            onClick={handleRunAI}
            disabled={isLoading || !prompt.trim()}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-lg shadow-indigo-950 transition active:scale-95 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Flame className="w-4 h-4 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Run AI Query
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="font-bold">Notice:</strong> {errorMessage}
          </div>
        </div>
      )}

      {/* Output Console */}
      {(response || isLoading || lastUsage) && (
        <div className="mt-2 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden">
          {/* Console Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/80 bg-zinc-900/40 text-xs text-zinc-400">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Output Stream</span>
            </div>
            {lastUsage && (
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-emerald-400 font-semibold font-mono">
                  {lastUsage.latencyMs}ms
                </span>
                <span>
                  <strong className="text-zinc-200 font-mono">{formatNumber(lastUsage.totalTokens)}</strong> tokens
                </span>
                <button
                  onClick={copyResponse}
                  className="flex items-center gap-1 hover:text-white transition font-semibold"
                  title="Copy response"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Console Body */}
          <div className="p-4 text-xs font-mono text-zinc-300 leading-relaxed max-h-80 overflow-y-auto whitespace-pre-wrap selection:bg-indigo-500/30">
            {isLoading ? (
              <div className="flex items-center gap-2 text-zinc-400 animate-pulse">
                <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                Querying Groq Gateway and updating quota balance...
              </div>
            ) : (
              response
            )}
          </div>
        </div>
      )}
    </div>
  );
}