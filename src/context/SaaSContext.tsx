'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityLogItem, ApiKeyItem, TierType, UserState } from '@/lib/types';
import { INITIAL_USER_STATE, TIERS } from '@/lib/constants';
import { generateRandomKey } from '@/lib/utils';

interface SaaSContextType {
  state: UserState;
  isHydrated: boolean;
  activeTierConfig: typeof TIERS['free'];
  tokenUsagePercent: number;
  remainingTokens: number;
  setTier: (tier: TierType) => void;
  recordUsage: (log: Omit<ActivityLogItem, 'id' | 'timestamp'>) => void;
  generateApiKey: (name: string) => { rawSecret: string; keyItem: ApiKeyItem };
  revokeApiKey: (id: string) => void;
  resetAllData: () => void;
  isUpgradeModalOpen: boolean;
  targetUpgradeTier: TierType;
  openUpgradeModal: (tier?: TierType) => void;
  closeUpgradeModal: () => void;
  simulateUpgrade: (tier: TierType) => void;
}

const STORAGE_KEY = 'saasforge_state_v1';

const SaaSContext = createContext<SaaSContextType | undefined>(undefined);

export function SaaSProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<UserState>(INITIAL_USER_STATE);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [targetUpgradeTier, setTargetUpgradeTier] = useState<TierType>('pro');

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(parsed);
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn('Failed to save state to localStorage', e);
      }
    }
  }, [state, isHydrated]);

  const activeTierConfig = TIERS[state.currentTier] || TIERS.free;
  const tokenUsagePercent = Math.min(
    100,
    Math.round((state.tokensUsedThisMonth / activeTierConfig.monthlyTokens) * 100)
  );
  const remainingTokens = Math.max(0, activeTierConfig.monthlyTokens - state.tokensUsedThisMonth);

  const setTier = (tier: TierType) => {
    setState((prev) => ({
      ...prev,
      currentTier: tier
    }));
  };

  const recordUsage = (logData: Omit<ActivityLogItem, 'id' | 'timestamp'>) => {
    const newLog: ActivityLogItem = {
      ...logData,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };

    setState((prev) => ({
      ...prev,
      tokensUsedThisMonth: prev.tokensUsedThisMonth + logData.totalTokens,
      totalRequestsMade: prev.totalRequestsMade + 1,
      activityLogs: [newLog, ...prev.activityLogs].slice(0, 50)
    }));
  };

  const generateApiKey = (name: string) => {
    const { raw, masked } = generateRandomKey();
    const newKey: ApiKeyItem = {
      id: `key_${Date.now()}`,
      name: name.trim() || 'API Key',
      keyPrefix: 'sf_live_',
      secretMasked: masked,
      fullSecretOnce: raw,
      createdAt: new Date().toISOString(),
      lastUsedAt: null,
      status: 'active'
    };

    setState((prev) => ({
      ...prev,
      apiKeys: [newKey, ...prev.apiKeys]
    }));

    return { rawSecret: raw, keyItem: newKey };
  };

  const revokeApiKey = (id: string) => {
    setState((prev) => ({
      ...prev,
      apiKeys: prev.apiKeys.map((k) => (k.id === id ? { ...k, status: 'revoked' as const } : k))
    }));
  };

  const resetAllData = () => {
    setState(INITIAL_USER_STATE);
    localStorage.removeItem(STORAGE_KEY);
  };

  const openUpgradeModal = (tier: TierType = 'pro') => {
    setTargetUpgradeTier(tier);
    setIsUpgradeModalOpen(true);
  };

  const closeUpgradeModal = () => {
    setIsUpgradeModalOpen(false);
  };

  const simulateUpgrade = (tier: TierType) => {
    setTier(tier);
    closeUpgradeModal();
  };

  return (
    <SaaSContext.Provider
      value={{
        state,
        isHydrated,
        activeTierConfig,
        tokenUsagePercent,
        remainingTokens,
        setTier,
        recordUsage,
        generateApiKey,
        revokeApiKey,
        resetAllData,
        isUpgradeModalOpen,
        targetUpgradeTier,
        openUpgradeModal,
        closeUpgradeModal,
        simulateUpgrade
      }}
    >
      {children}
    </SaaSContext.Provider>
  );
}

export function useSaaS() {
  const context = useContext(SaaSContext);
  if (!context) {
    throw new Error('useSaaS must be used within a SaaSProvider');
  }
  return context;
}