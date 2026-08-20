import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { TIERS, AVAILABLE_MODELS } from '@/lib/constants';
import { TierType } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Groq API Key is not configured on the server.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      prompt,
      model = 'groq/compound-mini',
      tier = 'free',
      systemPrompt = 'You are SaaSForge Engine, an intelligent, concise AI engineering assistant.',
      currentTokensUsed = 0
    } = body as {
      prompt: string;
      model: string;
      tier: TierType;
      systemPrompt?: string;
      currentTokensUsed?: number;
    };

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required and must not be empty.' },
        { status: 400 }
      );
    }

    // 1. Validate Tier & Quotas
    const tierConfig = TIERS[tier] || TIERS.free;
    if (currentTokensUsed >= tierConfig.monthlyTokens) {
      return NextResponse.json(
        {
          error: `Monthly quota exceeded for ${tierConfig.name} (${tierConfig.monthlyTokens.toLocaleString()} tokens). Please upgrade tier.`,
          quotaExceeded: true
        },
        { status: 429 }
      );
    }

    // 2. Validate Model Access for Tier
    const modelConfig = AVAILABLE_MODELS.find((m) => m.id === model);
    if (!modelConfig) {
      return NextResponse.json(
        { error: `Requested model "${model}" is invalid or not in catalog.` },
        { status: 400 }
      );
    }

    if (!tierConfig.allowedModels.includes(model)) {
      return NextResponse.json(
        {
          error: `Model "${modelConfig.name}" requires ${modelConfig.minTier.toUpperCase()} tier or higher. Your current tier: ${tier.toUpperCase()}.`,
          upgradeRequired: true,
          requiredTier: modelConfig.minTier
        },
        { status: 403 }
      );
    }

    // 3. Execute Groq LLM Generation
    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      model: model,
      temperature: 0.4,
      max_completion_tokens: Math.min(tierConfig.maxTokensPerRequest, 2048)
    });

    const latencyMs = Date.now() - startTime;
    const responseText = completion.choices[0]?.message?.content || 'No response generated.';
    const promptTokens = completion.usage?.prompt_tokens || Math.ceil(prompt.length / 4);
    const completionTokens = completion.usage?.completion_tokens || Math.ceil(responseText.length / 4);
    const totalTokens = promptTokens + completionTokens;
    const costUsd = (totalTokens / 1000) * modelConfig.costPer1kTokens;

    return NextResponse.json({
      success: true,
      text: responseText,
      model,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens,
        latencyMs,
        costUsd
      }
    });
  } catch (err: unknown) {
    const error = err as { message?: string; status?: number };
    const latencyMs = Date.now() - startTime;
    return NextResponse.json(
      {
        error: error.message || 'An unexpected error occurred during AI execution.',
        latencyMs
      },
      { status: error.status || 500 }
    );
  }
}