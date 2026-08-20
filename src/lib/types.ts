export type TierType = 'free' | 'pro' | 'enterprise';

export interface TierConfig {
  id: TierType;
  name: string;
  badge: string;
  color: string;
  monthlyTokens: number;
  maxRequestsPerMin: number;
  allowedModels: string[];
  maxTokensPerRequest: number;
  hasApiAccess: boolean;
  hasPriorityQueue: boolean;
  priceMonthly: number;
  features: string[];
}

export interface AIModelConfig {
  id: string;
  name: string;
  provider: string;
  minTier: TierType;
  description: string;
  costPer1kTokens: number;
  badge?: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  secretMasked: string;
  fullSecretOnce?: string;
  createdAt: string;
  lastUsedAt: string | null;
  status: 'active' | 'revoked';
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  status: 'success' | 'rate_limited' | 'quota_exceeded' | 'error';
  promptPreview: string;
  costUsd: number;
}

export interface UserState {
  currentTier: TierType;
  tokensUsedThisMonth: number;
  totalRequestsMade: number;
  apiKeys: ApiKeyItem[];
  activityLogs: ActivityLogItem[];
}