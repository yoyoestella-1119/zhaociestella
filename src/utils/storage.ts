/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, RecommendationHistoryItem } from '../types';

const PROFILE_STORAGE_KEY = 'soundmatch_user_profile_v1';
const HISTORY_STORAGE_KEY = 'soundmatch_recommendation_history_v1';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr_default',
  nickname: '音乐旅人',
  audioPreferences: {
    preferredSoundSignature: '三频均衡',
    requiresHiResCodec: true,
    prefersAncDepth: 'strong'
  },
  comfortFeatures: {
    wearsGlasses: true,
    earCanalSensitivity: 'sensitive',
    preferredFormFactors: ['入耳式', '头戴罩耳'],
    maxWeightToleranceG: 260
  },
  typicalScenarios: ['通勤/差旅', '沉浸办公'],
  budgetTier: {
    defaultMaxBudget: 1500,
    priority: 'balanced'
  },
  deviceEcosystem: 'all',
  updatedAt: new Date().toISOString()
};

export const PROFILE_PRESETS: { name: string; description: string; profile: Partial<UserProfile> }[] = [
  {
    name: '戴眼镜通勤办公族',
    description: '戴眼镜不夹头、地铁强降噪、工位清晰通话',
    profile: {
      audioPreferences: { preferredSoundSignature: '三频均衡', requiresHiResCodec: true, prefersAncDepth: 'strong' },
      comfortFeatures: { wearsGlasses: true, earCanalSensitivity: 'sensitive', preferredFormFactors: ['头戴罩耳', '入耳式'], maxWeightToleranceG: 260 },
      typicalScenarios: ['通勤/差旅', '沉浸办公'],
      budgetTier: { defaultMaxBudget: 1500, priority: 'balanced' }
    }
  },
  {
    name: '敏感小耳道轻量党',
    description: '拒绝胀痛、开放式/耳夹优先、轻如若无物',
    profile: {
      audioPreferences: { preferredSoundSignature: '通透人声女毒', requiresHiResCodec: false, prefersAncDepth: 'moderate' },
      comfortFeatures: { wearsGlasses: false, earCanalSensitivity: 'small_canal', preferredFormFactors: ['开放式/耳挂', '耳夹式', '半入耳式'], maxWeightToleranceG: 10 },
      typicalScenarios: ['通勤/差旅', '日常休闲'],
      budgetTier: { defaultMaxBudget: 1000, priority: 'balanced' }
    }
  },
  {
    name: '发烧无损古典鉴赏家',
    description: '追求极致声场还原、Hi-Res认证与大动圈',
    profile: {
      audioPreferences: { preferredSoundSignature: '高保真中正监听', requiresHiResCodec: true, prefersAncDepth: 'unnecessary' },
      comfortFeatures: { wearsGlasses: false, earCanalSensitivity: 'normal', preferredFormFactors: ['有线大耳', '头戴罩耳', '有线入耳'], maxWeightToleranceG: null },
      typicalScenarios: ['HiFi发烧', '沉浸办公'],
      budgetTier: { defaultMaxBudget: 2500, priority: 'performance_first' }
    }
  },
  {
    name: '电竞开黑低延迟玩家',
    description: '2.4G无线极低延迟、听声辨位与清晰降噪麦',
    profile: {
      audioPreferences: { preferredSoundSignature: '澎湃低音', requiresHiResCodec: false, prefersAncDepth: 'unnecessary' },
      comfortFeatures: { wearsGlasses: true, earCanalSensitivity: 'normal', preferredFormFactors: ['头戴罩耳'], maxWeightToleranceG: 340 },
      typicalScenarios: ['电竞游戏', '沉浸办公'],
      budgetTier: { defaultMaxBudget: 1200, priority: 'performance_first' }
    }
  },
  {
    name: '高性价比学生党',
    description: '预算严控300-500元、超长续航水桶机',
    profile: {
      audioPreferences: { preferredSoundSignature: '三频均衡', requiresHiResCodec: false, prefersAncDepth: 'strong' },
      comfortFeatures: { wearsGlasses: false, earCanalSensitivity: 'normal', preferredFormFactors: ['入耳式', '头戴罩耳'], maxWeightToleranceG: 250 },
      typicalScenarios: ['学生高性价比', '通勤/差旅'],
      budgetTier: { defaultMaxBudget: 400, priority: 'cost_effective' }
    }
  }
];

export function getStoredUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return DEFAULT_USER_PROFILE;
    return JSON.parse(raw);
  } catch (err) {
    return DEFAULT_USER_PROFILE;
  }
}

export function saveStoredUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile to localStorage:', err);
  }
}

export function getStoredRecommendationHistory(): RecommendationHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export function saveRecommendationHistoryItem(item: RecommendationHistoryItem): void {
  try {
    const existing = getStoredRecommendationHistory();
    // Keep up to 30 recent recommendations
    const updated = [item, ...existing.filter((h) => h.id !== item.id)].slice(0, 30);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save history item:', err);
  }
}

export function clearStoredRecommendationHistory(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear history:', err);
  }
}
