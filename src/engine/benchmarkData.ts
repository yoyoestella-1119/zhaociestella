/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BenchmarkTestCase } from '../types';

export const BENCHMARK_TEST_SUITE: BenchmarkTestCase[] = [
  // 1. 模糊多义类 (Fuzzy & Multi-faceted Intent)
  {
    id: 'tc-01',
    category: '模糊多义',
    inputQuery: '夏天挤地铁通勤戴，要轻一点，耳朵容易出汗闷热，预算千元内。',
    expectedBehavior: 'MUST_RECOMMEND_DIRECTLY',
    targetFormFactor: '入耳式',
    expectedKeywordsInReply: ['轻', '降噪', '透气', '地铁', '千元'],
    forbiddenHallucinations: ['AirPods Max', '支持100米潜水', '永久不需要充电'],
    goldStandardScore: 3,
    scoringRubric: {
      relevance: '精准识别地铁通勤需要深度降噪与轻便防闷痛点 (1分)',
      completeness: '覆盖预算≤1000元、形态入耳轻量化、降噪要求 (1分)',
      actionability: '给出首选款与备选对比，告知单耳克重与客观妥协点 (0.5分)',
      toneAndGrounding: '参数逐字来自商品库，结论先行结构清晰 (0.5分)'
    }
  },
  {
    id: 'tc-02',
    category: '模糊多义',
    inputQuery: '想买个耳机平时戴戴，什么类型都行，有没有推荐的？',
    expectedBehavior: 'MUST_CLARIFY',
    expectedKeywordsInReply: ['场景', '形态', '选项'],
    forbiddenHallucinations: ['随便买买', '买最贵的'],
    goldStandardScore: 3,
    scoringRubric: {
      relevance: '识别需求极度模糊，未直接盲目推荐，启动探需 (1分)',
      completeness: '提供明确结构化选项（通勤/办公/运动/电竞）(1分)',
      actionability: '带选项按键，降低用户输入思考负担 (0.5分)',
      toneAndGrounding: '语气亲切专业，克制不施压 (0.5分)'
    }
  },
  {
    id: 'tc-03',
    category: '模糊多义',
    inputQuery: '经常高铁出差，要连公司电脑开视频会议，还想在路上安静睡一觉。',
    expectedBehavior: 'MUST_RECOMMEND_DIRECTLY',
    expectedKeywordsInReply: ['高铁', '出差', '会议', '双设备', '降噪'],
    forbiddenHallucinations: ['没有麦克风的耳机', '游泳耳机'],
    goldStandardScore: 3,
    scoringRubric: {
      relevance: '锁定差旅深度降噪与多麦通话双重诉求 (1分)',
      completeness: '兼顾双设备切换与长时间续航保障 (1分)',
      actionability: '明确推荐具备多麦克风与双芯降噪的商务主力机 (0.5分)',
      toneAndGrounding: '锚定通话降噪算法与续航真实参数 (0.5分)'
    }
  },
  {
    id: 'tc-04',
    category: '模糊多义',
    inputQuery: '送女朋友生日礼物，她喜欢听流行女声和看书，颜值要高好看的。',
    expectedBehavior: 'MUST_RECOMMEND_DIRECTLY',
    expectedKeywordsInReply: ['人声', '轻巧', '颜值', '女毒', '舒适'],
    forbiddenHallucinations: ['厚重工业大耳麦', '笨重电竞绿光耳机'],
    goldStandardScore: 3,
    scoringRubric: {
      relevance: '抓住小耳道轻巧、人声细腻与送礼高颜值属性 (1分)',
      completeness: '匹配精致小巧的TWS或时尚耳夹式 (1分)',
      actionability: '提供首选款与配色礼品属性说明 (0.5分)',
      toneAndGrounding: '温润得体，真实参数支持 (0.5分)'
    }
  },

  // 2. 预算冲突类 (Budget Conflict & Trade-offs)
  {
    id: 'tc-05',
    category: '预算冲突',
    inputQuery: '预算300块，想要苹果AirPods Pro那样的降噪和通透效果。',
    expectedBehavior: 'BUDGET_NEGOTIATE',
    expectedKeywordsInReply: ['客观', '旗舰', '性价比', '300', '降噪'],
    forbiddenHallucinations: ['真苹果原装300元', '苹果耳机降价到300'],
    goldStandardScore: 3,
    scoringRubric: {
      relevance: '坦诚指出300元与千元苹果旗舰的客观芯片技术差距 (1分)',
      completeness: '推荐300元档具备近40dB深度的平替越级神机 (1分)',
      actionability: '列举核心参数与真实妥协点，给出决策指导 (0.5分)',
      toneAndGrounding: '不贬低用户预算，态度诚恳，无虚构假货 (0.5分)'
    }
  },
  {
    id: 'tc-06',
    category: '预算冲突',
    inputQuery: '200块想买个骨传导耳机去跑步，有靠谱的吗？',
    expectedBehavior: 'BUDGET_NEGOTIATE',
    expectedKeywordsInReply: ['骨传导', '200', '气传导', '开放式', '音质'],
    forbiddenHallucinations: ['200元真韶音旗舰'],
    goldStandardScore: 3,
    scoringRubric: {
      relevance: '解释200元真骨传导技术门槛，引导至高性价比开放气传导 (1分)',
      completeness: '兼顾跑步不塞耳朵、防汗、预算严控200-300元 (1分)',
      actionability: '推荐倍思Eli或平价开放耳挂 (0.5分)',
      toneAndGrounding: '真实告知低频与漏音边界 (0.5分)'
    }
  },
  {
    id: 'tc-07',
    category: '预算冲突',
    inputQuery: '500元想要录音棚级别的专业监听大耳机，平时还要接手机听。',
    expectedBehavior: 'MUST_RECOMMEND_DIRECTLY',
    expectedKeywordsInReply: ['监听', '易推', '真实', '500'],
    forbiddenHallucinations: ['几千元大奥', '必须万元台式前端'],
    goldStandardScore: 3,
    scoringRubric: {
      relevance: '命中入门级高解析有线或封闭监听诉求 (1分)',
      completeness: '解决手机直推阻抗问题与预算门槛 (1分)',
      actionability: '推荐水月雨或铁三角入门款，给出选购理由 (0.5分)',
      toneAndGrounding: '参数真实，指出无麦或线材特性 (0.5分)'
    }
  },

  // 3. 痛点决策类 (Deep Pain Points & Anatomy)
  {
    id: 'tc-08',
    category: '痛点决策',
    inputQuery: '耳道很小容易发炎，以前戴入耳式半小时就胀痛头疼，求推荐通勤听播客的。',
    expectedBehavior: 'MUST_RECOMMEND_DIRECTLY',
    targetFormFactor: '开放式/耳挂',
    expectedKeywordsInReply: ['不塞耳', '耳道', '开放式', '耳夹', '舒适'],
    forbiddenHallucinations: ['强行推荐深入耳粗管套耳机'],
    goldStandardScore: 3,
    scoringRubric: {
      relevance: '首要解决耳道过敏胀痛痛点，果断放弃常规入耳 (1分)',
      completeness: '推荐耳夹式或开放式挂耳，兼顾通勤听播客人声清晰 (1分)',
      actionability: '说明无压迫原理与单耳克重，给出直买建议 (0.5分)',
      toneAndGrounding: '关切耳道健康，坦诚说明嘈杂环境音量影响 (0.5分)'
    }
  },
  {
    id: 'tc-09',
    category: '痛点决策',
    inputQuery: '每天戴近视眼镜，以前买的头戴耳机压得眼镜腿疼，头围还大，有救吗？',
    expectedBehavior: 'MUST_RECOMMEND_DIRECTLY',
    targetFormFactor: '头戴罩耳',
    expectedKeywordsInReply: ['眼镜', '大耳罩', '减压', '零压', '头围'],
    forbiddenHallucinations: ['硬塑料夹头夹死的大耳'],
    goldStandardScore: 3,
    scoringRubric: {
      relevance: '精准命中眼镜党与大头围痛点 (1分)',
      completeness: '筛选出带特制眼镜槽或深耳罩大沙发的头戴款 (1分)',
      actionability: '首选漫步者W820NB(零压眼镜槽)或Bose Ultra大沙发 (0.5分)',
      toneAndGrounding: '真实引用商品库专利减压耳罩字段 (0.5分)'
    }
  },
  {
    id: 'tc-10',
    category: '痛点决策',
    inputQuery: '经常在江边骑自行车，风声呼呼响根本听不清导航，买哪个降风噪好？',
    expectedBehavior: 'MUST_RECOMMEND_DIRECTLY',
    expectedKeywordsInReply: ['抗风噪', '骑行', '微风', '骨传导', '安全'],
    forbiddenHallucinations: ['完全无风阻的魔法耳机'],
    goldStandardScore: 3,
    scoringRubric: {
      relevance: '识别骑行大风噪与公路安全环境感知双重核心 (1分)',
      completeness: '推荐物理抗风道结构或专业抗风噪骨传导 (1分)',
      actionability: '首选华为FreeBuds Pro 3或韶音OpenRun Pro 2 (0.5分)',
      toneAndGrounding: '提醒户外骑行保持环境听觉安全 (0.5分)'
    }
  },
  {
    id: 'tc-11',
    category: '痛点决策',
    inputQuery: '大学宿舍室友打呼噜跟打雷一样，晚上睡不着，有什么能戴着睡觉侧躺的？',
    expectedBehavior: 'MUST_RECOMMEND_DIRECTLY',
    expectedKeywordsInReply: ['小巧', '侧躺', '打呼', '低频', '隔音'],
    forbiddenHallucinations: ['戴巨大头戴睡觉'],
    goldStandardScore: 3,
    scoringRubric: {
      relevance: '捕捉睡眠侧躺不压耳与隔绝低频鼾声需求 (1分)',
      completeness: '推荐超微型轻量TWS或平价小豆豆 (1分)',
      actionability: '首选单耳仅4g出头的极小入耳 (0.5分)',
      toneAndGrounding: '温和提醒睡眠佩戴时长与清洁建议 (0.5分)'
    }
  },

  // 4. 决策收敛信号 (Closing & Direct Decision Signals)
  {
    id: 'tc-12',
    category: '决策收敛信号',
    inputQuery: '别问那么多了，1500以内直接给我一个闭眼买的降噪耳机，现在就下单。',
    expectedBehavior: 'MUST_RECOMMEND_DIRECTLY',
    expectedKeywordsInReply: ['结论先行', '首选', '1499', '闭眼', '现货'],
    forbiddenHallucinations: ['请问你喜欢什么颜色', '请问你平时听什么歌'],
    goldStandardScore: 3,
    scoringRubric: {
      relevance: '【克制规则生效】立刻停止任何追问，直接结论先行 (1分)',
      completeness: '锁定1500内顶级标杆款索尼WF-1000XM5或华为Pro3 (1分)',
      actionability: '给出明确价格、核心优势、现货配送建议，可立即行动 (0.5分)',
      toneAndGrounding: '干脆利落不拖泥带水，参数精确到元与dB (0.5分)'
    }
  },
  {
    id: 'tc-13',
    category: '决策收敛信号',
    inputQuery: '索尼XM5和Bose QC Ultra二选一，我主要在办公室用，选哪个？',
    expectedBehavior: 'MUST_RECOMMEND_DIRECTLY',
    expectedKeywordsInReply: ['二选一', '索尼', 'Bose', '办公室', '建议'],
    forbiddenHallucinations: ['第三款完全无关的耳机'],
    goldStandardScore: 3,
    scoringRubric: {
      relevance: '敏锐识别对比决策意图，直接给出针对办公室的决断建议 (1分)',
      completeness: '对比两者的降噪特点、耳罩透气性与通话麦克风 (1分)',
      actionability: '明确给出首选判定依据，打消纠结 (0.5分)',
      toneAndGrounding: '客观中立，依据商品库实测参数对照 (0.5分)'
    }
  },
  {
    id: 'tc-14',
    category: '决策收敛信号',
    inputQuery: '就推荐一个吧，懒得挑了，预算2000左右头戴降噪最好的。',
    expectedBehavior: 'MUST_RECOMMEND_DIRECTLY',
    targetFormFactor: '头戴罩耳',
    expectedKeywordsInReply: ['首选', '头戴', '2000', '降噪标杆'],
    forbiddenHallucinations: ['多选列表发散追问'],
    goldStandardScore: 3,
    scoringRubric: {
      relevance: '识别懒人收敛买单信号，单品结论置顶 (1分)',
      completeness: '首推索尼WH-1000XM5或森海Momentum 4 (1分)',
      actionability: '给出250g轻量、30小时续航与直接购买动作 (0.5分)',
      toneAndGrounding: '自信清晰，真实属性锚定 (0.5分)'
    }
  },

  // 5. 极端冷门与专业场景 (Edge Cases & Special Specs)
  {
    id: 'tc-15',
    category: '极端冷门',
    inputQuery: '有能戴着在泳池游泳的耳机吗？必须真能下水2米，还能存歌不带手机。',
    expectedBehavior: 'MUST_RECOMMEND_DIRECTLY',
    targetFormFactor: '骨传导',
    expectedKeywordsInReply: ['IP68', '游泳', '水下', '内存', '韶音'],
    forbiddenHallucinations: ['支持蓝牙在水下50米通话', '普通IPX4耳机可以游泳'],
    goldStandardScore: 3,
    scoringRubric: {
      relevance: '准确锁定IP68水下防浸泡与离线MP3独立播放刚需 (1分)',
      completeness: '推荐韶音OpenSwim Pro，注明32GB内存与水下双模 (1分)',
      actionability: '强调水下蓝牙无法穿透需切换内置存储，给出安全说明 (0.5分)',
      toneAndGrounding: '防虚假宣称，如实说明水下物理特性 (0.5分)'
    }
  },
  {
    id: 'tc-16',
    category: '极端冷门',
    inputQuery: '专门打CS2和瓦罗兰特，必须延迟在20ms以内，麦克风报点要超级清晰。',
    expectedBehavior: 'MUST_RECOMMEND_DIRECTLY',
    targetFormFactor: '头戴罩耳',
    expectedKeywordsInReply: ['延迟', '2.4G', 'CS2', '听声辨位', '麦克风'],
    forbiddenHallucinations: ['普通蓝牙耳机延迟5ms'],
    goldStandardScore: 3,
    scoringRubric: {
      relevance: '精准匹配2.4GHz无线专业电竞耳机，坚决不用高延迟蓝牙 (1分)',
      completeness: '推荐雷蛇黑鲨V2 Pro或罗技PRO X 2，注明12-15ms极低延迟 (1分)',
      actionability: '标明FPS职业EQ与可拆卸广播麦克风 (0.5分)',
      toneAndGrounding: '专业游戏术语精准，参数硬核 (0.5分)'
    }
  },
  {
    id: 'tc-17',
    category: '极端冷门',
    inputQuery: '听古典交响乐大编制，手头有台式耳放，要声场大脱箱感强的有线大耳。',
    expectedBehavior: 'MUST_RECOMMEND_DIRECTLY',
    targetFormFactor: '有线大耳',
    expectedKeywordsInReply: ['HD 600', '开放式', '声场', '古典', '阻抗'],
    forbiddenHallucinations: ['百元蓝牙耳机声场无敌秒杀HD600'],
    goldStandardScore: 3,
    scoringRubric: {
      relevance: '识别古典大编制发烧要求，匹配开放式发烧大耳 (1分)',
      completeness: '首推森海塞尔HD 600，注明300欧阻抗与天鹅绒透气耳罩 (1分)',
      actionability: '提醒开放式漏音特性不适合通勤，定位书房室内 (0.5分)',
      toneAndGrounding: '严谨声学词汇，无夸大数字 (0.5分)'
    }
  },
  {
    id: 'tc-18',
    category: '极端冷门',
    inputQuery: '有没有支持防核辐射、永不需要充电的石墨烯量子耳机？',
    expectedBehavior: 'MUST_RECOMMEND_DIRECTLY',
    expectedKeywordsInReply: ['暂无', '不支持', '客观', '科学'],
    forbiddenHallucinations: ['推荐核辐射耳机', '编造量子耳机型号'],
    goldStandardScore: 3,
    scoringRubric: {
      relevance: '【防幻觉测试】识别离谱非理性诉求，明确说明商品库暂无此类产品 (1分)',
      completeness: '客观解释声学常识与现有真无线电池技术边界 (1分)',
      actionability: '引导至真实存在的超长续航(如森海60小时)标杆款 (0.5分)',
      toneAndGrounding: '不随用户起舞，守住商品库防幻觉底线 (0.5分)'
    }
  },

  // 6. 多轮探需克制规则校验 (Multi-turn Restraint Rules)
  {
    id: 'tc-19',
    category: '多轮探需克制',
    inputQuery: '平时跑步用。',
    contextTurns: ['我想买个耳机。', '请问您主要在什么场景使用？'],
    expectedBehavior: 'MUST_RECOMMEND_DIRECTLY',
    targetFormFactor: '开放式/耳挂',
    expectedKeywordsInReply: ['跑步', '不掉', '防水', '开放式', '推荐'],
    forbiddenHallucinations: ['继续追问第三次问你喜欢什么颜色'],
    goldStandardScore: 3,
    scoringRubric: {
      relevance: '场景已明确为跑步，迅速收敛形态至开放式/骨传导 (1分)',
      completeness: '不再过度追问，根据跑步特性直接推荐稳固防汗单品 (1分)',
      actionability: '推荐韶音或倍思运动款，说明单手盲操与防汗 (0.5分)',
      toneAndGrounding: '克制高效，两轮内完成闭环 (0.5分)'
    }
  },
  {
    id: 'tc-20',
    category: '多轮探需克制',
    inputQuery: '算了我不想选选项，你就说索尼XM5降噪到底好不好吧！',
    contextTurns: ['请问在佩戴形态上，您更倾向入耳还是头戴？'],
    expectedBehavior: 'MUST_RECOMMEND_DIRECTLY',
    expectedKeywordsInReply: ['索尼', 'XM5', '40dB', '降噪', '客观'],
    forbiddenHallucinations: ['请您必须先点击上面的选项'],
    goldStandardScore: 3,
    scoringRubric: {
      relevance: '【用户未响应跳过追问】立即顺应用户焦点，直接深度解答XM5参数 (1分)',
      completeness: '提供实测40dB、QN2e芯片降噪表现与适用场景 (1分)',
      actionability: '对比入耳版与头戴版，给出购买判定 (0.5分)',
      toneAndGrounding: '不生硬回踩，服务体验自然 (0.5分)'
    }
  },
  {
    id: 'tc-21',
    category: '多轮探需克制',
    inputQuery: '预算就500左右吧，随便买一个能用的。',
    contextTurns: ['想买个平时用的耳机', '请问平时使用场景和形态偏好是？', '通勤戴，小巧点的'],
    expectedBehavior: 'MUST_RECOMMEND_DIRECTLY',
    targetFormFactor: '入耳式',
    expectedKeywordsInReply: ['500', '漫步者', '声阔', '首选'],
    forbiddenHallucinations: ['继续发起新追问'],
    goldStandardScore: 3,
    scoringRubric: {
      relevance: '【两轮上限触发】多轮信息已补齐（通勤+小巧+500元），直接输出最优解 (1分)',
      completeness: '推荐声阔Liberty 4 NC或漫步者，性能与预算精准吻合 (1分)',
      actionability: '结论先行置顶，说明50小时续航与40dB降噪 (0.5分)',
      toneAndGrounding: '无冗余废话，四步闭环完成 (0.5分)'
    }
  },
  {
    id: 'tc-22',
    category: '痛点决策',
    inputQuery: '油耳朵，耳道经常湿答答的，戴海绵塞很不舒服，夏天还特别容易臭。',
    expectedBehavior: 'MUST_RECOMMEND_DIRECTLY',
    targetFormFactor: '开放式/耳挂',
    expectedKeywordsInReply: ['油耳', '开放式', '耳夹', '干爽', '不堵耳道'],
    forbiddenHallucinations: ['海绵耳塞深入耳'],
    goldStandardScore: 3,
    scoringRubric: {
      relevance: '深刻理解油耳痛点，严禁推荐聚氨酯海绵套，主推开放通气款 (1分)',
      completeness: '推荐华为FreeClip耳夹式或韶音舒适圈 (1分)',
      actionability: '说明耳道通风干爽与硅胶易擦拭清洁优势 (0.5分)',
      toneAndGrounding: '体贴共情，专业声学与人体工学结合 (0.5分)'
    }
  },
  {
    id: 'tc-23',
    category: '模糊多义',
    inputQuery: '明天一早就要出差飞海外，必须今天或者明天一早送到，预算无所谓。',
    expectedBehavior: 'MUST_RECOMMEND_DIRECTLY',
    expectedKeywordsInReply: ['当日达', '次日达', '现货', '飞行', '头等舱'],
    forbiddenHallucinations: ['预售3天发货的耳机'],
    goldStandardScore: 3,
    scoringRubric: {
      relevance: '强履约时效第一优先级，锁定当日达/次日达现货 (1分)',
      completeness: '针对长途海外飞行，匹配飞机消噪顶级Bose Ultra或索尼XM5 (1分)',
      actionability: '标注履约时效保障标签，提示立刻下单锁定库存 (0.5分)',
      toneAndGrounding: '时效响应敏锐，给出长途续航建议 (0.5分)'
    }
  },
  {
    id: 'tc-24',
    category: '预算冲突',
    inputQuery: '100块钱以内，还有降噪耳机吗？不要假货。',
    expectedBehavior: 'MUST_RECOMMEND_DIRECTLY',
    expectedKeywordsInReply: ['100', 'QCY', '百元', '性价比', '客观'],
    forbiddenHallucinations: ['100元索尼', '100元苹果降噪'],
    goldStandardScore: 3,
    scoringRubric: {
      relevance: '百元极限预算，真实推荐百元级大厂正品QCY T13 ANC (1分)',
      completeness: '客观告知28dB降噪与塑料做工妥协点 (1分)',
      actionability: '说明百元入门首选，丢了不心疼，直接行动 (0.5分)',
      toneAndGrounding: '实事求是，绝不给虚假承诺 (0.5分)'
    }
  },
  {
    id: 'tc-25',
    category: '痛点决策',
    inputQuery: '考研自习室用，需要安静但不想戴大耳罩被压头发，经常一坐就是一天。',
    expectedBehavior: 'MUST_RECOMMEND_DIRECTLY',
    targetFormFactor: '入耳式',
    expectedKeywordsInReply: ['自习室', '轻便', '不压发型', '长续航', '舒适'],
    forbiddenHallucinations: ['笨重头戴大耳'],
    goldStandardScore: 3,
    scoringRubric: {
      relevance: '捕捉考研自习久坐、不压头发与持续安静核心约束 (1分)',
      completeness: '推荐单耳轻盈(≤5g)、单次续航长、无耳压入耳款 (1分)',
      actionability: '推荐红米Buds 5 Pro或漫步者，单次10小时续航无需频繁充电 (0.5分)',
      toneAndGrounding: '考研加油温暖鼓励，结构化参数支撑 (0.5分)'
    }
  }
];

/**
 * 0-3 分自动评测运行器:
 * 对输入 query 运行三层 pipeline，并针对好回答四标准进行多维打分：
 * 0分: 出现幻觉或答非所问
 * 1分: 机械罗列参数，未切中核心或过度追问
 * 2分: 四维覆盖合格，推荐准，参数无误
 * 3分: 好回答四标准全达标 (切中核心/诉求全覆盖/可直接行动/清晰有温度且思考过程可信)
 */
export function evaluateSingleTestCase(
  testCase: BenchmarkTestCase,
  actualReply: string,
  actualBehavior: string,
  recommendedItems: { name: string; price: number }[],
  isHallucinationFree: boolean
): {
  score: number; // 0, 1, 2, 3
  dimensions: {
    relevance: { score: number; max: 1.0; comment: string };
    completeness: { score: number; max: 1.0; comment: string };
    actionability: { score: number; max: 0.5; comment: string };
    toneAndGrounding: { score: number; max: 0.5; comment: string };
  };
  passed: boolean;
  notes: string[];
} {
  const notes: string[] = [];

  // 1. 致命缺陷检查 (幻觉检查)
  for (const forbidden of testCase.forbiddenHallucinations) {
    if (actualReply.includes(forbidden)) {
      return {
        score: 0,
        dimensions: {
          relevance: { score: 0, max: 1.0, comment: '检测到违禁词或虚假幻觉属性' },
          completeness: { score: 0, max: 1.0, comment: '未完成真实验证' },
          actionability: { score: 0, max: 0.5, comment: '不可信' },
          toneAndGrounding: { score: 0, max: 0.5, comment: '幻觉严重' }
        },
        passed: false,
        notes: [`触碰禁忌词：包含幻觉或不实宣称「${forbidden}」`]
      };
    }
  }

  if (!isHallucinationFree) {
    return {
      score: 0,
      dimensions: {
        relevance: { score: 0, max: 1.0, comment: '商品库校验未通过' },
        completeness: { score: 0, max: 1.0, comment: '含未收录假型号' },
        actionability: { score: 0, max: 0.5, comment: '无法购买' },
        toneAndGrounding: { score: 0, max: 0.5, comment: '非真实库数据' }
      },
      passed: false,
      notes: ['防幻觉质检未通过：推荐了非库内真实商品或价格参数捏造']
    };
  }

  // 2. 行为策略判定
  let relScore = 0.5;
  let relComment = '基本切题';
  if (testCase.expectedBehavior === 'MUST_CLARIFY') {
    if (actualBehavior === 'PROACTIVE_INQUIRY') {
      relScore = 1.0;
      relComment = '切中意图发散本质，准确触发克制探需';
    } else {
      relScore = 0.3;
      relComment = '需求极度模糊时不应直接下结论盲推';
    }
  } else {
    // 应当直接推荐
    if (actualBehavior !== 'PROACTIVE_INQUIRY') {
      relScore = 1.0;
      relComment = '切中核心，结论先行给出品类定性';
    } else {
      relScore = 0.4;
      relComment = '在用户明确时仍发起了冗余追问';
    }
  }

  // 3. 诉求覆盖度检查
  let compScore = 0.5;
  let compComment = '覆盖主要诉求';
  let keywordHits = 0;
  for (const kw of testCase.expectedKeywordsInReply) {
    if (actualReply.includes(kw)) keywordHits++;
  }
  const hitRatio = keywordHits / Math.max(1, testCase.expectedKeywordsInReply.length);
  if (hitRatio >= 0.6) {
    compScore = 1.0;
    compComment = `关键词与诉求覆盖全面 (命中率 ${Math.round(hitRatio * 100)}%)`;
  } else {
    compScore = 0.6;
    compComment = '部分次要诉求未在回复中明示';
  }

  // 4. 可直接行动度
  let actScore = 0.3;
  let actComment = '提供了基础信息';
  if (actualReply.includes('建议直接入手') || actualReply.includes('首选') || actualReply.includes('选购决策动作') || actualReply.includes('妥协点')) {
    actScore = 0.5;
    actComment = '结论明确，含客观妥协点，可直接做购买决策';
  }

  // 5. 清晰有温度与真实属性锚定
  let toneScore = 0.3;
  let toneComment = '结构清晰';
  if (actualReply.includes('•') && (actualReply.includes('dB') || actualReply.includes('g') || actualReply.includes('小时') || actualReply.includes('¥'))) {
    toneScore = 0.5;
    toneComment = '排版得体有温度，每一项理由均锚定真实参数';
  }

  const rawSum = relScore + compScore + actScore + toneScore;
  let finalScore = 2;
  if (rawSum >= 2.8) finalScore = 3;
  else if (rawSum >= 1.8) finalScore = 2;
  else finalScore = 1;

  notes.push(`策略判定: ${actualBehavior === testCase.expectedBehavior ? '符合预期' : '轻度偏差'}`);
  notes.push(`推荐单品: ${recommendedItems.map(i => `${i.name}(¥${i.price})`).join(' / ') || '无单品(探需中)'}`);

  return {
    score: finalScore,
    dimensions: {
      relevance: { score: relScore, max: 1.0, comment: relComment },
      completeness: { score: compScore, max: 1.0, comment: compComment },
      actionability: { score: actScore, max: 0.5, comment: actComment },
      toneAndGrounding: { score: toneScore, max: 0.5, comment: toneComment }
    },
    passed: finalScore >= 2,
    notes
  };
}
