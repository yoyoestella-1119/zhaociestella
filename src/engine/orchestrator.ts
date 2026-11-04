/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChatMessage, RequirementProfile, ThinkingProcessTrace, UserProfile } from '../types';
import { parseUserQuery } from './semanticParser';
import { determineStrategy } from './strategyEngine';
import { retrieveAndRankCandidates, verifyAgainstCatalog } from './retrievalEngine';
import { generateGuidedReply } from './responseGenerator';

export interface ProcessTurnInput {
  userInput: string;
  turnCount: number;
  lastTurnWasInquiry: boolean;
  accumulatedProfile?: RequirementProfile;
  userProfile?: UserProfile;
}

export function processConversationTurn(input: ProcessTurnInput): ChatMessage {
  const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false });

  // 1. Layer 1: 需求解析 (口语模糊意图 -> 四维结构化 JSON Schema)
  const { profile, extractedKeywords, unknownCount } = parseUserQuery(
    input.userInput,
    input.turnCount,
    input.accumulatedProfile
  );

  // 融入用户持久化画像偏好 (Personalized Profile Injection)
  if (input.userProfile) {
    const up = input.userProfile;
    // 注入耳道敏感特性
    if (up.comfortFeatures.earCanalSensitivity === 'sensitive' || up.comfortFeatures.earCanalSensitivity === 'small_canal') {
      if (!profile.scene.painPoints.includes('长时间佩戴耳道胀痛')) {
        profile.scene.painPoints.push('长时间佩戴耳道胀痛');
        extractedKeywords.push('画像感知: 小耳道/耳压敏感');
      }
    }
    // 注入戴眼镜痛点
    if (up.comfortFeatures.wearsGlasses) {
      if (!profile.scene.painPoints.includes('戴眼镜夹头夹耳骨')) {
        profile.scene.painPoints.push('戴眼镜夹头夹耳骨');
        extractedKeywords.push('画像感知: 戴眼镜防夹头');
      }
    }
    // 若用户未指定预算，补充画像预设预算
    if (profile.budget.max === null && up.budgetTier.defaultMaxBudget) {
      profile.budget.max = up.budgetTier.defaultMaxBudget;
      profile.budget.rawBudgetStr = `画像默认上限 ¥${up.budgetTier.defaultMaxBudget}`;
      extractedKeywords.push(`画像预算: ≤¥${up.budgetTier.defaultMaxBudget}`);
    }
    // 若声音偏好未指定，补充画像偏好
    if (profile.specs.soundPreference === 'unknown' && up.audioPreferences.preferredSoundSignature !== 'default') {
      profile.specs.soundPreference = up.audioPreferences.preferredSoundSignature;
      extractedKeywords.push(`画像音质: ${up.audioPreferences.preferredSoundSignature}`);
    }
  }

  // 2. Layer 2: 澄清决策 (Master Agent + 双 Skill 并行 + 四大克制规则)
  const strategy = determineStrategy(
    profile,
    input.turnCount,
    input.lastTurnWasInquiry,
    input.userInput
  );

  // 3. Layer 3: 商品召回与打分排序 (30-50款脱敏真实商品库硬过滤与软打分)
  const { topMatches, totalCatalogSize, hardFilterPassedCount, rejectedSamples } = retrieveAndRankCandidates(profile);

  // 4. 回复生成 (好回答四标准: 结论先行 + 真实属性理由 + 妥协点)
  const { replyContent, recommendedProducts } = generateGuidedReply(profile, strategy, topMatches);

  // 5. 防幻觉质检审计 (Zero Hallucination Audit)
  const hallucinationAudit = verifyAgainstCatalog(recommendedProducts, replyContent);

  // 组装思考过程中间态 Trace (用于结构化可视化面板展示)
  const thinkingTrace: ThinkingProcessTrace = {
    step1_parsing: {
      rawInput: input.userInput,
      profile,
      extractedKeywords,
      unknownCount
    },
    step2_strategy: strategy,
    step3_retrieval: {
      totalCatalogSize,
      hardFilterPassedCount,
      topMatches,
      rejectedSamples
    },
    step4_generationAudit: hallucinationAudit,
    timestamp
  };

  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    role: 'assistant',
    content: replyContent,
    timestamp,
    recommendedProducts,
    options: strategy.proactiveInquiry?.options,
    thinkingTrace
  };
}
