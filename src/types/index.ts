/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 耳机形态分类
export type FormFactor =
  | '入耳式'
  | '头戴罩耳'
  | '半入耳式'
  | '开放式/耳挂'
  | '耳夹式'
  | '骨传导'
  | '有线入耳'
  | '有线大耳'
  | 'unknown';

// 场景分类
export type PrimaryScene =
  | '通勤/差旅'
  | '沉浸办公'
  | '运动/户外'
  | 'HiFi发烧'
  | '电竞游戏'
  | '学生高性价比'
  | '日常休闲'
  | 'unknown';

// 履约时效
export type DeliverySpeed = '次日达' | '当日达' | '现货速发' | '不限' | 'unknown';

// 商品库中的耳机数据模型 (脱敏真实参数)
export interface HeadphoneItem {
  id: string;
  name: string;
  brand: string;
  category: '头戴式降噪' | '真无线入耳式' | '开放式/骨传导' | '电竞游戏耳机' | 'HiFi有线监听' | '高性价比TWS';
  formFactor: FormFactor;
  price: number;
  ancDepthDb: number | null; // 降噪深度 (dB)
  ancMode: string; // 降噪特性说明
  batteryLife: string; // 续航描述
  batteryHours: number; // 单次或综合标称小时
  weightG: number; // 重量克数
  comfortRating: string; // 舒适度佩戴说明
  latencyMs: number; // 延迟毫秒数
  waterproof: string; // 防水防尘等级
  soundSignature: string; // 声音风格
  micQuality: string; // 麦克风通话降噪
  suitableScenes: string[]; // 适配的核心场景
  deliveryTag: DeliverySpeed;
  pros: string[]; // 核心优势 (锚定字段)
  cons: string[]; // 选购妥协点
  imageUrl?: string;
  inStock: boolean;
  salesVolume: string; // 销量热度
  positiveRate: string; // 好评率
}

// 四维需求画像 (4D Profile)
export interface RequirementProfile {
  scene: {
    primary: PrimaryScene;
    subScene?: string;
    painPoints: string[];
    confidence: number; // 0-1
  };
  specs: {
    formFactor: FormFactor;
    ancRequired: boolean | 'preferred' | 'unnecessary' | 'unknown';
    batteryPriority: 'high' | 'medium' | 'low' | 'unknown';
    comfortPriority: 'high' | 'medium' | 'low' | 'unknown';
    latencySensitive: boolean | 'unknown';
    waterproofLevel: string | 'unknown';
    soundPreference: string | 'unknown';
  };
  delivery: {
    speed: DeliverySpeed;
    strictTime: boolean;
  };
  budget: {
    min: number | null;
    max: number | null;
    flexibility: 'strict' | 'negotiable' | 'unknown';
    rawBudgetStr?: string;
  };
  turnCount: number; // 当前多轮澄清轮数
  decisionSignalDetected: boolean; // 是否检测到决策期强信号
  userTone: 'exploring' | 'hesitating' | 'urgent_buying' | 'comparing';
}

// 探需与策略决策
export interface InquiryOption {
  id: string;
  label: string;
  actionValue: string;
  clarifyDimension: 'formFactor' | 'budget' | 'scene' | 'anc' | 'comfort';
}

export interface StrategyDecision {
  strategyType: 'PROACTIVE_INQUIRY' | 'DIRECT_RECOMMENDATION' | 'BUDGET_CONFLICT_GUIDE' | 'SPEC_VERIFICATION';
  inquiryCount: number;
  maxInquiryReached: boolean;
  decisionSignalTriggered: boolean;
  topicShiftBypass: boolean;
  reason: string;
  proactiveInquiry?: {
    question: string;
    options: InquiryOption[];
    dimension: string;
  };
}

// 候选召回与打分结果
export interface CandidateMatch {
  item: HeadphoneItem;
  totalScore: number;
  hardFilterPassed: boolean;
  scoreBreakdown: {
    sceneFit: number; // 0-35
    budgetFit: number; // 0-25
    specsFit: number; // 0-25
    deliveryFit: number; // 0-15
  };
  matchReasons: string[];
  caveats: string[];
}

// 防幻觉审计追踪 (Provenance Audit)
export interface HallucinationAudit {
  passed: boolean;
  isAllInCatalog: boolean;
  claimedAttributes: {
    attrName: string;
    claimedValue: string;
    catalogTruth: string;
    verified: boolean;
  }[];
  unsupportedClaimsHandledHonestly: boolean;
}

// 思考过程中间态 (用于可视化面板)
export interface ThinkingProcessTrace {
  step1_parsing: {
    rawInput: string;
    profile: RequirementProfile;
    extractedKeywords: string[];
    unknownCount: number;
  };
  step2_strategy: StrategyDecision;
  step3_retrieval: {
    totalCatalogSize: number;
    hardFilterPassedCount: number;
    topMatches: CandidateMatch[];
    rejectedSamples: { name: string; reason: string }[];
  };
  step4_generationAudit: HallucinationAudit;
  timestamp: string;
}

// 对话消息
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  recommendedProducts?: HeadphoneItem[];
  options?: InquiryOption[];
  thinkingTrace?: ThinkingProcessTrace;
  error?: boolean;
}

// 评测用例 (Benchmark)
export interface BenchmarkTestCase {
  id: string;
  category: '模糊多义' | '预算冲突' | '痛点决策' | '决策收敛信号' | '极端冷门' | '多轮探需克制';
  inputQuery: string;
  contextTurns?: string[]; // 上下文
  expectedBehavior: 'MUST_CLARIFY' | 'MUST_RECOMMEND_DIRECTLY' | 'BUDGET_NEGOTIATE';
  targetFormFactor?: FormFactor;
  expectedKeywordsInReply: string[];
  forbiddenHallucinations: string[]; // 严禁编造的词
  goldStandardScore: number; // 3
  scoringRubric: {
    relevance: string; // 切中核心 (1分)
    completeness: string; // 诉求全覆盖 (1分)
    actionability: string; // 可直接行动 (0.5分)
    toneAndGrounding: string; // 清晰有温度且真实 (0.5分)
  };
}

// 用户画像与偏好设置 (User Profile System)
export interface UserProfile {
  id: string;
  nickname: string;
  audioPreferences: {
    preferredSoundSignature: '三频均衡' | '澎湃低音' | '通透人声女毒' | '高保真中正监听' | '开阔声场交响' | 'default';
    requiresHiResCodec: boolean; // LDAC / LHDC / 无损高解析
    prefersAncDepth: 'strong' | 'moderate' | 'unnecessary' | 'default';
  };
  comfortFeatures: {
    wearsGlasses: boolean; // 是否戴眼镜 (影响大耳推荐)
    earCanalSensitivity: 'sensitive' | 'normal' | 'oily_ear' | 'small_canal'; // 耳道特性
    preferredFormFactors: FormFactor[];
    maxWeightToleranceG: number | null; // 头戴或单耳最大耐受克重
  };
  typicalScenarios: PrimaryScene[]; // 常规高频使用场景
  budgetTier: {
    defaultMaxBudget: number | null;
    priority: 'performance_first' | 'cost_effective' | 'balanced';
  };
  deviceEcosystem: 'apple' | 'android_harmony' | 'pc_windows' | 'all';
  updatedAt: string;
}

// 推荐与交互历史记录 (Recommendation & Interaction History)
export interface RecommendationHistoryItem {
  id: string;
  timestamp: string;
  query: string;
  primaryScene: PrimaryScene;
  recommendedProducts: HeadphoneItem[];
  userFeedback?: 'helpful' | 'saved' | 'compared';
  profileApplied?: boolean;
}

