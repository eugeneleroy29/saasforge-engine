import { AIModelConfig, TierConfig } from './types';

export const TIERS: Record<'free' | 'pro' | 'enterprise', TierConfig> = {
  free: {
    id: 'free',
    name: 'Starter Sandbox',
    badge: 'FREE TIER',
    color: 'text-zinc-400 border-zinc-700 bg-zinc-900/50',
    monthlyTokens: 10_000,
    maxRequestsPerMin: 5,
    allowedModels: ['groq/compound-mini'],
    maxTokensPerRequest: 1024,
    hasApiAccess: false,
    hasPriorityQueue: false,
    priceMonthly: 0,
    features: [
      '10,000 Free Monthly AI Tokens',
      'Access to groq/compound-mini',
      'Max 1,024 Output Tokens/req',
      'In-Browser AI Playground',
      'Standard Web Queue'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro Developer',
    badge: 'PRO DEVELOPER',
    color: 'text-indigo-400 border-indigo-500/40 bg-indigo-950/30',
    monthlyTokens: 250_000,
    maxRequestsPerMin: 30,
    allowedModels: ['groq/compound-mini', 'qwen/qwen3.6-27b'],
    maxTokensPerRequest: 2048,
    hasApiAccess: true,
    hasPriorityQueue: true,
    priceMonthly: 29,
    features: [
      '250,000 Monthly AI Tokens',
      'Access to qwen/qwen3.6-27b & Compound Mini',
      'Developer API Key Access (Live Keys)',
      'Sub-500ms Edge Gateway Priority',
      'Full Request Telemetry & Logs'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Scale',
    badge: 'ENTERPRISE UNLIMITED',
    color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30',
    monthlyTokens: 2_000_000,
    maxRequestsPerMin: 120,
    allowedModels: ['groq/compound-mini', 'qwen/qwen3.6-27b', 'openai/gpt-oss-120b'],
    maxTokensPerRequest: 4096,
    hasApiAccess: true,
    hasPriorityQueue: true,
    priceMonthly: 199,
    features: [
      '2,000,000 Monthly AI Tokens',
      'Access to Flagship openai/gpt-oss-120b',
      'Unlimited Developer API Keys',
      'Dedicated High-Concurrency Quota',
      'Custom System Guardrails & Paywall Simulator'
    ]
  }
};

export const AVAILABLE_MODELS: AIModelConfig[] = [
  {
    id: 'groq/compound-mini',
    name: 'Compound Mini',
    provider: 'Groq Compound',
    minTier: 'free',
    description: 'Ultra-fast compound model optimized for quick reasoning and summarization.',
    costPer1kTokens: 0.00015,
    badge: 'Fast & Lightweight'
  },
  {
    id: 'qwen/qwen3.6-27b',
    name: 'Qwen 3.6 27B',
    provider: 'Alibaba Cloud',
    minTier: 'pro',
    description: 'Balanced powerhouse model with superior coding and multilingual capabilities.',
    costPer1kTokens: 0.0006,
    badge: 'Pro Grade'
  },
  {
    id: 'openai/gpt-oss-120b',
    name: 'GPT OSS 120B',
    provider: 'OpenAI Open-Weight',
    minTier: 'enterprise',
    description: 'Flagship open-weight model for complex technical synthesis and deep architecture.',
    costPer1kTokens: 0.002,
    badge: 'Flagship Enterprise'
  }
];

export const INITIAL_USER_STATE = {
  currentTier: 'free' as const,
  tokensUsedThisMonth: 1420,
  totalRequestsMade: 4,
  apiKeys: [
    {
      id: 'key_init_01',
      name: 'Default Production Key',
      keyPrefix: 'sf_live_',
      secretMasked: 'sf_live_8f7b...e92a',
      createdAt: '2025-01-15T08:30:00.000Z',
      lastUsedAt: '2025-02-01T14:22:10.000Z',
      status: 'active' as const
    }
  ],
  activityLogs: [
    {
      id: 'log_init_01',
      timestamp: '2025-02-01T14:22:10.000Z',
      model: 'groq/compound-mini',
      promptTokens: 180,
      completionTokens: 240,
      totalTokens: 420,
      latencyMs: 142,
      status: 'success' as const,
      promptPreview: 'Analyze system architecture bottlenecks for a high-concurrency API...',
      costUsd: 0.000063
    },
    {
      id: 'log_init_02',
      timestamp: '2025-01-30T10:15:45.000Z',
      model: 'groq/compound-mini',
      promptTokens: 450,
      completionTokens: 550,
      totalTokens: 1000,
      latencyMs: 260,
      status: 'success' as const,
      promptPreview: 'Write a TypeScript middleware for token bucket rate limiting...',
      costUsd: 0.00015
    }
  ]
};