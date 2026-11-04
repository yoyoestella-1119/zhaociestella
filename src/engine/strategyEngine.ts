/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RequirementProfile, StrategyDecision, InquiryOption } from '../types';
import { HEADPHONE_ONTOLOGY } from '../data/headphoneOntology';

/**
 * 澄清决策引擎 (Layer 2 - Master Agent + 双 Skill 架构):
 * 包含营销策略 Skill (生成 reply_strategy) 与 探需 Skill (生成 proactive_inquiry)，
 * 严格执行【四大克制规则】：
 * 1. 追问 ≥ 2 次立即停止 (inquiryCount >= 2 -> DIRECT_RECOMMENDATION)
 * 2. 决策期强信号立即停止 (如“直接推”、“就推荐一个吧”)
 * 3. 用户上轮未响应探需选项立即停止 (避免步步紧逼)
 * 4. 追问必须【带选项】问，低认知负荷
 */
export function determineStrategy(
  profile: RequirementProfile,
  currentInquiryCount: number,
  lastTurnWasInquiry: boolean,
  userInput: string
): StrategyDecision {
  const maxInquiryTurns = HEADPHONE_ONTOLOGY.restraintRules.maxInquiryTurns;

  // 规则 0: 伪需求/极端不切实际诉求拦截 (如防核辐射/永不充电) -> 直接科普与辟谣，禁止发散追问
  if (/防核辐射|量子耳机|永不需要充电|永久不用充/i.test(userInput)) {
    return {
      strategyType: 'DIRECT_RECOMMENDATION',
      inquiryCount: currentInquiryCount,
      maxInquiryReached: false,
      decisionSignalTriggered: true,
      topicShiftBypass: false,
      reason: '【防幻觉守则生效】识别到违背声学与物理常识的诉求，禁止发散追问，必须直接予以科学客观说明与真实标杆替代。'
    };
  }

  // 规则 1: 决策期信号检测 -> 直接出推荐
  if (profile.decisionSignalDetected || /别问|闭眼|直接|算了我不想选|就买|选哪个/i.test(userInput)) {
    return {
      strategyType: 'DIRECT_RECOMMENDATION',
      inquiryCount: currentInquiryCount,
      maxInquiryReached: false,
      decisionSignalTriggered: true,
      topicShiftBypass: false,
      reason: '【克制规则触发】识别到用户强决策收敛意图（如“直接推/就选一个”），立即终止多轮探需，结论先行直出推荐。'
    };
  }

  // 规则 2: 追问轮数达到上限 (≥2轮) -> 强制终止探需
  if (currentInquiryCount >= maxInquiryTurns) {
    return {
      strategyType: 'DIRECT_RECOMMENDATION',
      inquiryCount: currentInquiryCount,
      maxInquiryReached: true,
      decisionSignalTriggered: false,
      topicShiftBypass: false,
      reason: `【克制规则触发】已达到多轮探需追问上限（${maxInquiryTurns}轮），禁止过度盘问用户，依据现有四维画像直接给出最优解。`
    };
  }

  // 规则 3: 上轮如果追问了选项，用户未选选项而是跳过问具体参数 -> 顺应用户，直接推荐
  const topicShiftMatch = HEADPHONE_ONTOLOGY.restraintRules.topicShiftIndicators.some(kw =>
    userInput.includes(kw)
  );
  if (lastTurnWasInquiry && topicShiftMatch) {
    return {
      strategyType: 'DIRECT_RECOMMENDATION',
      inquiryCount: currentInquiryCount,
      maxInquiryReached: false,
      decisionSignalTriggered: false,
      topicShiftBypass: true,
      reason: '【克制规则触发】检测到用户未响应上轮选项而是聚焦具体品类/参数，为防止打扰体验，停止追问并结合意图直接解答与推荐。'
    };
  }

  // 规则 4: 预算严重冲突 (如 300元 想要 苹果降噪/高端HiFi) -> 启动预算冲突引导
  if (
    profile.budget.max !== null &&
    profile.budget.max <= 400 &&
    (userInput.includes('苹果') || userInput.includes('airpods') || userInput.includes('索尼xm') || userInput.includes('发烧hifi'))
  ) {
    return {
      strategyType: 'BUDGET_CONFLICT_GUIDE',
      inquiryCount: currentInquiryCount,
      maxInquiryReached: false,
      decisionSignalTriggered: false,
      topicShiftBypass: false,
      reason: '【智能策略触发】用户预算 (≤400元) 与对标的高端旗舰期望存在客观跨度，启动平价越级平替引导与取舍说明。'
    };
  }

  // 5. 必要槽位缺失判定 (仅当信息严重不足时才发起探需追问)
  // 5.1 极度模糊需求 (场景与形态同时未知，例如：“想买个耳机推荐一下”、“什么类型都行”)
  const isExtremelyVague =
    (profile.scene.primary === 'unknown' && profile.specs.formFactor === 'unknown') ||
    userInput.includes('什么类型都行') ||
    userInput.includes('随便推荐') ||
    (userInput.length <= 15 && profile.budget.max === null && profile.scene.primary === 'unknown');

  if (isExtremelyVague) {
    const options: InquiryOption[] = [
      { id: 'opt_commute', label: '🚇 地铁/出差强降噪', actionValue: '平时主要是地铁通勤出差，需要强降噪', clarifyDimension: 'scene' },
      { id: 'opt_office', label: '💼 工位办公/通话开会', actionValue: '工位办公久戴，希望通话清晰不压耳朵', clarifyDimension: 'scene' },
      { id: 'opt_sports', label: '🏃 跑步运动/不塞耳朵', actionValue: '户外跑步运动，希望不塞耳道防水防汗', clarifyDimension: 'scene' },
      { id: 'opt_gaming', label: '🎮 电竞游戏/超低延迟', actionValue: '打吃鸡CS2游戏，需要超低延迟听声辨位', clarifyDimension: 'scene' }
    ];

    return {
      strategyType: 'PROACTIVE_INQUIRY',
      inquiryCount: currentInquiryCount + 1,
      maxInquiryReached: false,
      decisionSignalTriggered: false,
      topicShiftBypass: false,
      reason: '【探需Skill触发】用户需求较发散，启动第一轮场景聚焦追问，提供4个明确选项。',
      proactiveInquiry: {
        question: '为了帮您精准锁定最契合的耳机，请问平时最常在哪个场景使用呢？',
        options,
        dimension: '使用场景 (Scene)'
      }
    };
  }

  // 5.2 场景完全未知，但指定了预算
  if (profile.scene.primary === 'unknown' && currentInquiryCount === 0) {
    const options: InquiryOption[] = [
      { id: 'opt_in_ear', label: '🫘 小巧入耳式 (日常通勤/强隔音)', actionValue: '倾向小巧入耳式，放口袋方便，隔音好', clarifyDimension: 'formFactor' },
      { id: 'opt_over_ear', label: '🎧 头戴大耳 (声场大/长续航)', actionValue: '倾向头戴式大耳，降噪更强音质更好', clarifyDimension: 'formFactor' },
      { id: 'opt_open_ear', label: '🪝 开放式/挂耳 (不塞耳彻底透气)', actionValue: '倾向开放挂耳或耳夹，完全不塞耳洞怕闷', clarifyDimension: 'formFactor' }
    ];

    return {
      strategyType: 'PROACTIVE_INQUIRY',
      inquiryCount: currentInquiryCount + 1,
      maxInquiryReached: false,
      decisionSignalTriggered: false,
      topicShiftBypass: false,
      reason: '【探需Skill触发】形态与场景缺失，启动结构化形态偏好追问。',
      proactiveInquiry: {
        question: '了解您的预算！在日常佩戴形态上，您更倾向哪一种体验？',
        options,
        dimension: '佩戴形态 (Form Factor)'
      }
    };
  }

  // 其余情况：信息足够决策，直接输出推荐
  return {
    strategyType: 'DIRECT_RECOMMENDATION',
    inquiryCount: currentInquiryCount,
    maxInquiryReached: false,
    decisionSignalTriggered: false,
    topicShiftBypass: false,
    reason: '【营销Skill触发】四维需求画像关键维度已满足匹配阈值，直接进行知识库精确召回与结论先行推荐。'
  };
}
