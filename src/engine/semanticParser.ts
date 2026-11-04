/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormFactor, PrimaryScene, RequirementProfile, DeliverySpeed } from '../types';
import { HEADPHONE_ONTOLOGY } from '../data/headphoneOntology';

/**
 * 需求解析器 (Layer 1):
 * 将口语化、模糊、非结构化的自然语言请求精准转化为四维画像 (JSON schema)。
 * 未提及或无法判定的项明确标记为 'unknown' 或 null，杜绝过度推测。
 */
export function parseUserQuery(
  rawInput: string,
  turnCount: number = 0,
  previousProfile?: RequirementProfile
): {
  profile: RequirementProfile;
  extractedKeywords: string[];
  unknownCount: number;
} {
  const text = rawInput.trim();
  const lowerText = text.toLowerCase();
  const extractedKeywords: string[] = [];

  // 1. 预算槽位提取 (Budget Extraction)
  let minBudget: number | null = previousProfile?.budget.min ?? null;
  let maxBudget: number | null = previousProfile?.budget.max ?? null;
  let budgetFlexibility: 'strict' | 'negotiable' | 'unknown' = previousProfile?.budget.flexibility ?? 'unknown';
  let rawBudgetStr: string | undefined = previousProfile?.budget.rawBudgetStr;

  // 匹配预算区间: e.g. "1000-1500", "500到1000", "500左右", "千元内", "2000以内", "300元档", "百元"
  const rangeMatch = text.match(/(\d+)\s*(?:-|到|~|至)\s*(\d+)\s*(?:元|块|k|K)?/);
  const maxMatch = text.match(/(?:预算|大概|在)?\s*(\d+)\s*(?:元|块|k|K)?\s*(?:以内|以下|内|封顶|左右|上下|档)/);
  const minMatch = text.match(/(\d+)\s*(?:元|块)?\s*(?:以上|起步)/);
  const kMatch = text.match(/(\d+(?:\.\d+)?)\s*[kK]/);

  if (rangeMatch) {
    minBudget = parseInt(rangeMatch[1], 10);
    maxBudget = parseInt(rangeMatch[2], 10);
    rawBudgetStr = `${minBudget}-${maxBudget}元`;
    budgetFlexibility = 'strict';
    extractedKeywords.push(`预算区间: ${rawBudgetStr}`);
  } else if (maxMatch) {
    let val = parseInt(maxMatch[1], 10);
    // 处理形如 "1k" 或 "2k"
    if (val < 20 && text.includes('k')) val = val * 1000;
    maxBudget = val;
    rawBudgetStr = `${val}元以内`;
    budgetFlexibility = text.includes('左右') || text.includes('可小超') ? 'negotiable' : 'strict';
    extractedKeywords.push(`预算上限: ${rawBudgetStr}`);
  } else if (kMatch) {
    const val = Math.round(parseFloat(kMatch[1]) * 1000);
    maxBudget = val;
    rawBudgetStr = `${val}元左右`;
    budgetFlexibility = 'negotiable';
    extractedKeywords.push(`预算: 约${val}元`);
  } else if (/千元|1000/i.test(text)) {
    if (text.includes('两千') || text.includes('2000')) {
      maxBudget = 2000;
      rawBudgetStr = '2000元档';
    } else {
      maxBudget = 1000;
      rawBudgetStr = '千元档';
    }
    extractedKeywords.push(rawBudgetStr);
  } else if (/百元|平价|便宜|学生党/i.test(text)) {
    maxBudget = maxBudget ?? 400;
    rawBudgetStr = '百元性价比 (≤400元)';
    extractedKeywords.push('百元预算');
  }

  // 2. 形态特征提取 (Form Factor Extraction)
  let formFactor: FormFactor = previousProfile?.specs.formFactor ?? 'unknown';

  for (const ff of HEADPHONE_ONTOLOGY.formFactors) {
    const hit = ff.synonyms.some(s => text.toLowerCase().includes(s.toLowerCase()));
    if (hit) {
      formFactor = ff.standardValue as FormFactor;
      extractedKeywords.push(`形态: ${formFactor}`);
      break;
    }
  }

  // 特殊口语规则：由上下文自然推断形态倾向
  if (formFactor === 'unknown') {
    if (/不入耳|耳洞痛|耳道胀|耳道炎|中耳炎|怕闷|油耳|开放|耳挂/i.test(text)) {
      formFactor = '开放式/耳挂';
      extractedKeywords.push('形态推导: 开放式不塞耳');
    } else if (/大耳|包耳|耳罩|头梁|头围|夹头|压眼镜|戴眼镜/i.test(text)) {
      formFactor = '头戴罩耳';
      extractedKeywords.push('形态推导: 头戴罩耳');
    } else if (/打游戏|cs2|瓦罗兰特|吃鸡|脚步声|连麦/i.test(text)) {
      formFactor = '头戴罩耳';
      extractedKeywords.push('形态推导: 电竞头戴大耳');
    } else if (/游泳|泳池|下水/i.test(text)) {
      formFactor = '骨传导';
      extractedKeywords.push('形态推导: 游泳骨传导');
    } else if (/轻|轻便|放口袋|小巧|地铁|自习室|不压发型|侧躺|睡觉/i.test(text)) {
      formFactor = '入耳式';
      extractedKeywords.push('形态推导: 轻巧入耳式');
    }
  }

  // 3. 场景槽位识别 (Scene Extraction)
  let primaryScene: PrimaryScene = previousProfile?.scene.primary ?? 'unknown';
  let subScene: string | undefined = previousProfile?.scene.subScene;
  const painPoints: string[] = [...(previousProfile?.scene.painPoints ?? [])];

  for (const sm of HEADPHONE_ONTOLOGY.sceneMappings) {
    const hit = sm.synonyms.some(s => text.toLowerCase().includes(s.toLowerCase()));
    if (hit) {
      primaryScene = sm.primary as PrimaryScene;
      extractedKeywords.push(`场景: ${primaryScene}`);
      break;
    }
  }

  // 细化子场景与痛点提取
  if (/地铁|公交|高铁|飞机|出差/i.test(text)) {
    subScene = '强噪音交通通勤';
    extractedKeywords.push('子场景: 强噪音交通');
  } else if (/骑行|防风噪|大风/i.test(text)) {
    subScene = '户外迎风运动';
    painPoints.push('呼啸迎风杂音');
  } else if (/自习|图书馆|宿舍/i.test(text)) {
    subScene = '静谧自习/学习专注';
  } else if (/游泳|泳池|潜水/i.test(text)) {
    subScene = '水下运动游泳';
    extractedKeywords.push('子场景: 水下运动');
  } else if (/会议|开会|打电话|连麦/i.test(text)) {
    subScene = '商务通话与连麦';
  }

  // 痛点捕捉
  if (/防核辐射|量子耳机|永不需要充电|永久不用充/i.test(text)) {
    if (!painPoints.includes('非现实伪诉求(防核辐射/永不充电)')) painPoints.push('非现实伪诉求(防核辐射/永不充电)');
    extractedKeywords.push('边界拦截: 非现实物理诉求');
  }
  if (/耳道痛|耳朵胀|戴久了疼|戴不久/i.test(text)) {
    if (!painPoints.includes('长时间佩戴耳道胀痛')) painPoints.push('长时间佩戴耳道胀痛');
  }
  if (/听不清报站|怕坐过站/i.test(text)) {
    if (!painPoints.includes('通勤担心听不清报站')) painPoints.push('通勤担心听不清报站');
  }
  if (/出汗|夏天|闷热|捂耳朵/i.test(text)) {
    if (!painPoints.includes('出汗闷热油耳发痒')) painPoints.push('出汗闷热油耳发痒');
  }
  if (/戴眼镜|眼镜腿|压眼镜/i.test(text)) {
    if (!painPoints.includes('戴眼镜夹头夹耳骨')) painPoints.push('戴眼镜夹头夹耳骨');
  }

  // 4. 属性规格判定 (Specs Extraction)
  let ancRequired: boolean | 'preferred' | 'unnecessary' | 'unknown' = previousProfile?.specs.ancRequired ?? 'unknown';
  if (/降噪|安静|隔音|消噪|地铁|飞机/i.test(text)) {
    ancRequired = true;
    extractedKeywords.push('需求: 主动降噪(ANC)');
  } else if (/不入耳|开放式|骨传导|听路况|安全/i.test(text)) {
    ancRequired = 'unnecessary';
    extractedKeywords.push('属性: 开放通透环境音');
  }

  let batteryPriority: 'high' | 'medium' | 'low' | 'unknown' = previousProfile?.specs.batteryPriority ?? 'unknown';
  if (/续航|几天不充|长续航|电量|懒得充|充一次/i.test(text)) {
    batteryPriority = 'high';
    extractedKeywords.push('高优先级: 超长续航');
  }

  let comfortPriority: 'high' | 'medium' | 'low' | 'unknown' = previousProfile?.specs.comfortPriority ?? 'unknown';
  if (/舒适|轻|轻便|不痛|不胀|小耳|女声|软|无感/i.test(text) || painPoints.length > 0) {
    comfortPriority = 'high';
    extractedKeywords.push('高优先级: 佩戴舒适度');
  }

  let latencySensitive: boolean | 'unknown' = previousProfile?.specs.latencySensitive ?? 'unknown';
  if (/游戏|延迟|打枪|cs2|吃鸡|音画同步/i.test(text)) {
    latencySensitive = true;
    extractedKeywords.push('属性: 超低延迟(<30ms)');
  }

  let waterproofLevel = previousProfile?.specs.waterproofLevel ?? 'unknown';
  if (/游泳|水下/i.test(text)) {
    waterproofLevel = 'IP68';
    extractedKeywords.push('硬性要求: IP68水下级防水');
  } else if (/出汗|暴汗|下雨|运动/i.test(text)) {
    waterproofLevel = 'IPX4+';
    extractedKeywords.push('要求: 生活防汗防水');
  }

  let soundPreference = previousProfile?.specs.soundPreference ?? 'unknown';
  if (/女毒|人声|清脆|高音/i.test(text)) soundPreference = '人声高频通透';
  else if (/低音|重低音|动次打次|震撼/i.test(text)) soundPreference = '澎湃低音';
  else if (/古典|交响|声场|hifi|无损/i.test(text)) soundPreference = 'HiFi声场分离度';

  // 5. 履约要求判定 (Delivery Extraction)
  let speed: DeliverySpeed = previousProfile?.delivery.speed ?? 'unknown';
  let strictTime = previousProfile?.delivery.strictTime ?? false;
  if (/明天要|急用|马上|次日达|今天到|当日达|现货/i.test(text)) {
    speed = text.includes('当日') || text.includes('今天') ? '当日达' : '次日达';
    strictTime = true;
    extractedKeywords.push(`履约要求: ${speed}`);
  }

  // 6. 决策期信号检测 (Decision Signal Detection)
  const isDecisionSignal = HEADPHONE_ONTOLOGY.restraintRules.decisionKeywords.some(kw =>
    text.includes(kw)
  );

  let userTone: 'exploring' | 'hesitating' | 'urgent_buying' | 'comparing' = 'exploring';
  if (isDecisionSignal) {
    userTone = 'urgent_buying';
    extractedKeywords.push('识别到决策期强信号: 用户期望立即推荐结论');
  } else if (/对比|还是|区别|选哪款/i.test(text)) {
    userTone = 'comparing';
  } else if (/纠结|不知道|犹豫/i.test(text)) {
    userTone = 'hesitating';
  }

  // 计算未决/unknown数量
  let unknownCount = 0;
  if (primaryScene === 'unknown') unknownCount++;
  if (formFactor === 'unknown') unknownCount++;
  if (maxBudget === null) unknownCount++;
  if (ancRequired === 'unknown') unknownCount++;

  const profile: RequirementProfile = {
    scene: {
      primary: primaryScene,
      subScene,
      painPoints,
      confidence: primaryScene === 'unknown' ? 0.3 : 0.95
    },
    specs: {
      formFactor,
      ancRequired,
      batteryPriority,
      comfortPriority,
      latencySensitive,
      waterproofLevel,
      soundPreference
    },
    delivery: {
      speed,
      strictTime
    },
    budget: {
      min: minBudget,
      max: maxBudget,
      flexibility: budgetFlexibility,
      rawBudgetStr
    },
    turnCount,
    decisionSignalDetected: isDecisionSignal,
    userTone
  };

  return {
    profile,
    extractedKeywords,
    unknownCount
  };
}
