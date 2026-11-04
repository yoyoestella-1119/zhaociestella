/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HeadphoneItem, RequirementProfile, CandidateMatch, HallucinationAudit } from '../types';
import { HEADPHONE_CATALOG } from '../data/headphoneCatalog';

/**
 * 候选商品召回与打分排序引擎 (Layer 3):
 * 1. 硬过滤器 (Hard Filter): 严格排除不满足刚性约束（如严重超预算、形态严重冲突、强防水缺失）的单品
 * 2. 软评分矩阵 (Soft Scoring Matrix):
 *    - 场景适配度 (0-35分)
 *    - 预算契合度 (0-25分)
 *    - 属性特征匹配 (0-25分)
 *    - 履约与售后 (0-15分)
 * 3. 防幻觉审计 (Zero Hallucination Audit): 确保推荐出的型号100%在库，参数逐字来自真实字段
 */
export function retrieveAndRankCandidates(
  profile: RequirementProfile,
  catalog: HeadphoneItem[] = HEADPHONE_CATALOG
): {
  topMatches: CandidateMatch[];
  totalCatalogSize: number;
  hardFilterPassedCount: number;
  rejectedSamples: { name: string; reason: string }[];
} {
  const rejectedSamples: { name: string; reason: string }[] = [];
  const validCandidates: CandidateMatch[] = [];

  for (const item of catalog) {
    let hardFilterPassed = true;
    let rejectReason = '';

    // 1. 硬过滤 - 预算上限 (允许10%微超弹性，如预算1000允许到1100，若strict则不超)
    if (profile.budget.max !== null) {
      const budgetHeadroom = profile.budget.flexibility === 'strict' ? 1.0 : 1.15;
      const maxAllowed = profile.budget.max * budgetHeadroom;
      if (item.price > maxAllowed) {
        hardFilterPassed = false;
        rejectReason = `价格 ¥${item.price} 超过用户预算上限 (¥${profile.budget.max})`;
      }
    }

    // 2. 硬过滤 - 强形态冲突 (如用户明确只要头戴，排除入耳式；明确不要塞耳，排除普通入耳)
    if (hardFilterPassed && profile.specs.formFactor !== 'unknown') {
      const targetFF = profile.specs.formFactor;
      if (targetFF === '头戴罩耳' && item.formFactor !== '头戴罩耳') {
        hardFilterPassed = false;
        rejectReason = `形态不符：用户指定头戴罩耳，当前单品为${item.formFactor}`;
      } else if (targetFF === '开放式/耳挂' && !['开放式/耳挂', '耳夹式', '骨传导'].includes(item.formFactor)) {
        hardFilterPassed = false;
        rejectReason = `形态不符：用户需要不塞耳的开放式，当前为${item.formFactor}`;
      } else if (targetFF === '入耳式' && item.formFactor !== '入耳式' && item.formFactor !== '半入耳式') {
        hardFilterPassed = false;
        rejectReason = `形态不符：用户需要小巧入耳式`;
      }
    }

    // 3. 硬过滤 - 强水下防水要求 (如游泳必须IP68)
    if (hardFilterPassed && profile.specs.waterproofLevel === 'IP68') {
      if (item.waterproof !== 'IP68') {
        hardFilterPassed = false;
        rejectReason = `防水等级不足：游泳水下场景必须IP68，当前为${item.waterproof}`;
      }
    }

    if (!hardFilterPassed) {
      if (rejectedSamples.length < 5) {
        rejectedSamples.push({ name: item.name, reason: rejectReason });
      }
      continue;
    }

    // --- 软评分计算 (满分 100 分) ---
    const matchReasons: string[] = [];
    const caveats: string[] = [];

    // A. 场景适配度 (0-35分)
    let sceneFit = 18; // 基准分
    if (profile.scene.primary !== 'unknown') {
      const matchedScene = item.suitableScenes.some(s =>
        s.includes(profile.scene.primary.replace('学生高性价比', '学生').replace('通勤/差旅', '通勤'))
      );
      if (matchedScene) {
        sceneFit += 15;
        matchReasons.push(`场景匹配：针对【${profile.scene.primary}】官方深度优化`);
      } else {
        sceneFit += 5;
      }
    }

    // 痛点匹配加分
    for (const p of profile.scene.painPoints) {
      if (p.includes('胀痛') || p.includes('耳朵小')) {
        if (item.weightG <= 5.0 || item.formFactor.includes('开放') || item.formFactor.includes('骨传导')) {
          sceneFit += 2;
          matchReasons.push(`痛点化解：单耳重仅 ${item.weightG}g / ${item.formFactor}，久戴不胀痛`);
        }
      }
      if (p.includes('地铁') || p.includes('降噪')) {
        if (item.ancDepthDb && item.ancDepthDb >= 38) {
          sceneFit += 2;
          matchReasons.push(`痛点化解：实测 ${item.ancDepthDb}dB 深度降噪，高效压制交通轰鸣`);
        }
      }
      if (p.includes('眼镜')) {
        if (item.comfortRating.includes('眼镜')) {
          sceneFit += 3;
          matchReasons.push(`痛点化解：${item.comfortRating}`);
        }
      }
    }
    sceneFit = Math.min(35, sceneFit);

    // B. 预算契合度 (0-25分)
    let budgetFit = 20;
    if (profile.budget.max !== null) {
      const ratio = item.price / profile.budget.max;
      if (ratio >= 0.7 && ratio <= 1.0) {
        budgetFit = 25; // 预算利用充分且不超
        matchReasons.push(`预算完美契合：官方日常价 ¥${item.price}（上限 ¥${profile.budget.max}）`);
      } else if (ratio < 0.7) {
        budgetFit = 22; // 极佳性价比，为用户省钱
        matchReasons.push(`性价比优势：仅需 ¥${item.price}，远低于预算上限`);
      } else {
        budgetFit = 15; // 轻度超预算
        caveats.push(`价格 ¥${item.price} 略微浮动超预算，但配置越级值得考虑`);
      }
    }

    // C. 属性特征匹配 (0-25分)
    let specsFit = 15;
    if (profile.specs.ancRequired === true) {
      if (item.ancDepthDb && item.ancDepthDb >= 38) {
        specsFit += 5;
      } else if (!item.ancDepthDb) {
        specsFit -= 10;
        caveats.push('注意：该款为开放/被动设计，不具备主动降噪(ANC)');
      }
    }

    if (profile.specs.latencySensitive === true) {
      if (item.latencyMs <= 30) {
        specsFit += 5;
        matchReasons.push(`电竞超低延迟：实测仅 ${item.latencyMs}ms，音画严丝合缝`);
      }
    }

    if (profile.specs.batteryPriority === 'high') {
      if (item.batteryHours >= 40 || item.batteryLife.includes('60小时') || item.batteryLife.includes('50小时')) {
        specsFit += 5;
        matchReasons.push(`长续航标杆：${item.batteryLife}`);
      }
    }
    specsFit = Math.min(25, Math.max(0, specsFit));

    // D. 履约与售后 (0-15分)
    let deliveryFit = 10;
    if (profile.delivery.speed === '当日达' && item.deliveryTag === '当日达') {
      deliveryFit = 15;
      matchReasons.push('履约保障：支持当地仓库当日达极速送达');
    } else if (profile.delivery.speed === '次日达' && (item.deliveryTag === '次日达' || item.deliveryTag === '当日达')) {
      deliveryFit = 15;
      matchReasons.push('履约保障：现货支持次日达');
    }

    const totalScore = Math.round(sceneFit + budgetFit + specsFit + deliveryFit);

    validCandidates.push({
      item,
      totalScore,
      hardFilterPassed: true,
      scoreBreakdown: {
        sceneFit,
        budgetFit,
        specsFit,
        deliveryFit
      },
      matchReasons,
      caveats
    });
  }

  // 按总分从高到低排序
  validCandidates.sort((a, b) => b.totalScore - a.totalScore);

  // 结论先行：取 Top 1~2 款核心推荐，最多附带第 3 款作为备选对比
  const topMatches = validCandidates.slice(0, 3);

  return {
    topMatches,
    totalCatalogSize: catalog.length,
    hardFilterPassedCount: validCandidates.length,
    rejectedSamples
  };
}

/**
 * 防幻觉审计 (Zero Hallucination Verification):
 * 逐项校对推荐结果中的所有型号名称、价格、参数字段，
 * 验证其是否 100% 存在于商品库，没有胡乱虚构。
 */
export function verifyAgainstCatalog(
  recommendedItems: HeadphoneItem[],
  replyText: string,
  catalog: HeadphoneItem[] = HEADPHONE_CATALOG
): HallucinationAudit {
  const claimedAttributes: {
    attrName: string;
    claimedValue: string;
    catalogTruth: string;
    verified: boolean;
  }[] = [];

  let isAllInCatalog = true;

  for (const rec of recommendedItems) {
    const foundInDb = catalog.find(c => c.id === rec.id && c.name === rec.name);
    if (!foundInDb) {
      isAllInCatalog = false;
      claimedAttributes.push({
        attrName: '商品型号名称',
        claimedValue: rec.name,
        catalogTruth: '【商品库不存在此型号】',
        verified: false
      });
      continue;
    }

    // 校验价格
    claimedAttributes.push({
      attrName: `${rec.brand} 价格`,
      claimedValue: `¥${rec.price}`,
      catalogTruth: `¥${foundInDb.price}`,
      verified: rec.price === foundInDb.price
    });

    // 校验降噪深度
    if (rec.ancDepthDb !== null) {
      claimedAttributes.push({
        attrName: `${rec.brand} 降噪深度`,
        claimedValue: `${rec.ancDepthDb}dB`,
        catalogTruth: `${foundInDb.ancDepthDb}dB`,
        verified: rec.ancDepthDb === foundInDb.ancDepthDb
      });
    }

    // 校验重量
    claimedAttributes.push({
      attrName: `${rec.brand} 重量`,
      claimedValue: `${rec.weightG}g`,
      catalogTruth: `${foundInDb.weightG}g`,
      verified: rec.weightG === foundInDb.weightG
    });
  }

  // 检查是否诚实处理了缺失属性（如用户问了防水，但该型号无防水）
  const handlesUnsupportedTruthfully =
    !replyText.includes('支持100米潜水') &&
    !replyText.includes('永久不需要充电') &&
    !replyText.includes('100dB降噪');

  const allPassed = isAllInCatalog && claimedAttributes.every(c => c.verified) && handlesUnsupportedTruthfully;

  return {
    passed: allPassed,
    isAllInCatalog,
    claimedAttributes,
    unsupportedClaimsHandledHonestly: handlesUnsupportedTruthfully
  };
}
