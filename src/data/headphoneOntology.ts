/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 耳机品类专用本体与同义词映射词典 (Ontology & Synonyms Mapping)

export interface SynonymMapping {
  standardValue: string;
  synonyms: string[];
  explanation: string;
}

export const HEADPHONE_ONTOLOGY = {
  // 1. 形态特征本体
  formFactors: [
    {
      standardValue: '入耳式',
      synonyms: ['入耳', '降噪豆', '耳塞', '入耳式耳机', '胶套耳机', 'TWS', '真无线'],
      explanation: '硅胶套或海绵塞入耳道，物理被动隔音强，适合强噪音环境，但敏感耳道易胀痛'
    },
    {
      standardValue: '头戴罩耳',
      synonyms: ['头戴', '大耳', '耳罩', '包耳', '大耳机', '头戴式', '耳麦'],
      explanation: '耳罩包裹整个耳朵，声场大、降噪深、续航极长，但夏季户外易闷热，体积偏大'
    },
    {
      standardValue: '半入耳式',
      synonyms: ['半入耳', '平头塞', '浅入耳', '像AirPods2那种', '不塞耳道'],
      explanation: '挂在耳廓边缘不深入耳道，零耳压感极舒服，但漏音和被动隔音较弱'
    },
    {
      standardValue: '开放式/耳挂',
      synonyms: ['耳挂', '开放式', '挂耳', 'OWS', '气传导', '不入耳', '耳挂式'],
      explanation: '耳挂绕在耳郭后方，扬声器悬浮于耳道口，耳道清爽通风，兼顾环境安全'
    },
    {
      standardValue: '耳夹式',
      synonyms: ['耳夹', '夹耳', '耳环耳机', 'C形夹', '耳骨夹'],
      explanation: '夹在耳轮边，宛如饰品，不分左右耳，极轻舒适无佩戴异物感'
    },
    {
      standardValue: '骨传导',
      synonyms: ['骨传导', '韶音那种', '贴在骨头上', '游泳耳机', '震动传声'],
      explanation: '通过颅骨振动将声音传入内耳，完全开放双耳，汗水不堵耳道，运动安全首选'
    },
    {
      standardValue: '有线大耳',
      synonyms: ['有线头戴', '监听大耳', '台式耳机', '开放式大耳', '封闭大耳'],
      explanation: '专业发烧或录音室无损音质，零延迟无需充电，多需搭配前端或台式耳放'
    },
    {
      standardValue: '有线入耳',
      synonyms: ['有线耳塞', '小尾巴耳机', 'HiFi入耳', '可换线耳机', '动铁', '动圈耳塞'],
      explanation: '发烧入门或纯粹听音，解析度高，无需担心电池衰减与蓝牙压缩'
    }
  ],

  // 2. 场景与口语意图映射
  sceneMappings: [
    {
      primary: '通勤/差旅',
      synonyms: ['通勤', '地铁', '公交', '高铁', '飞机', '出差', '路上戴', '挤地铁', '报站', '轰隆隆', '降风噪', '油耳', '夏天'],
      coreNeeds: ['40dB以上深度ANC', '抗风噪', '轻便便携', '通透模式防坐过站'],
      painPoints: ['地铁尖锐铁轨声', '飞机发动机轰鸣', '走在路上听不见报站']
    },
    {
      primary: '沉浸办公',
      synonyms: ['办公室', '工位', '自习室', '图书馆', '写代码', '开会', '连麦', '通话清晰', '键盘声', '摸鱼', '看书', '宿舍', '寝室', '打呼', '睡觉', '侧躺', '考研'],
      coreNeeds: ['消除同事交谈杂音', '麦克风高保真通话降噪', '双设备无缝流转', '长时间佩戴不压耳'],
      painPoints: ['同事大声讲电话', '机械键盘噼里啪啦', '戴大耳被老板发现']
    },
    {
      primary: '运动/户外',
      synonyms: ['跑步', '晨跑', '夜跑', '健身房', '出汗', '暴汗', '骑行', '游泳', '泳池', '打球', '甩不掉', '防水'],
      coreNeeds: ['稳固不脱落', 'IPX4~IP68防水抗汗', '开放耳道感知环境汽车', '防风噪'],
      painPoints: ['剧烈晃动耳机飞出去', '出汗耳朵黏腻发痒中耳炎', '听不到后方来车不安全']
    },
    {
      primary: 'HiFi发烧',
      synonyms: ['音质', '发烧', 'HiFi', '听歌', '古典', '人声', '女毒', '动铁', '声场', '无损', '小尾巴', '解码', '录音棚', '专业监听', '监听大耳', '流行女声', '送女朋友'],
      coreNeeds: ['高解析度驱动单元', '中正调音无音染', '高码率LDAC/LHDC/有线无损', '宽阔声场与分离度'],
      painPoints: ['蓝牙压缩失真高频发闷', '低频浑浊动次打次盖住人声', '推力不足声场扁平']
    },
    {
      primary: '电竞游戏',
      synonyms: ['游戏', '打游戏', '吃鸡', 'CS2', '无畏契约', '瓦罗兰特', '开黑', '听声辨位', '脚步声', '延迟', '连麦'],
      coreNeeds: ['2.4GHz低延迟(<30ms)', '高瞬态高精听声辨位', '广播级麦克风不喷麦', '耳罩透气不夹头'],
      painPoints: ['蓝牙延迟200ms开枪慢半拍', '脚步声被低音轰鸣掩盖', '麦克风电流杂音多']
    },
    {
      primary: '学生高性价比',
      synonyms: ['学生党', '预算有限', '百元', '性价比', '便宜好用', '贫穷', '性价比高', '两百块', '三百内', '100块', '200块', '300块', '平价'],
      coreNeeds: ['300元内越级降噪与续航', '耐摔耐用', '丢了不心疼', '支持基础APP调节'],
      painPoints: ['预算低买到杂牌白牌假降噪', '电池三个月就尿崩', '底噪刺耳沙沙响']
    }
  ],

  // 3. 口语化痛点与属性槽位归一化
  colloquialPainPointRules: [
    { pattern: /(戴久|胀|痛|疼|耳朵小|耳道小|耳压)/, targetAttr: 'comfortPriority', value: 'high' },
    { pattern: /(闷热|出汗|夏天|透气|捂耳朵|油耳)/, targetAttr: 'formFactorPref', value: '开放式/耳挂_或_半入耳' },
    { pattern: /(吵|隔音|降噪|安静|地铁|轰鸣|杂音)/, targetAttr: 'ancRequired', value: true },
    { pattern: /(打电话|开会|连麦|微信语音|收音|说话)/, targetAttr: 'micPriority', value: 'high' },
    { pattern: /(电竞|游戏|CS|吃鸡|延迟|音画同步)/, targetAttr: 'latencySensitive', value: true },
    { pattern: /(几天不充|长续航|电量|懒得充|充一次)/, targetAttr: 'batteryPriority', value: 'high' },
    { pattern: /(水|游泳|下雨|暴汗|潜水)/, targetAttr: 'waterproofRequired', value: 'IP55+' }
  ],

  // 4. 探需克制规则定义 (Restraint & Stopping Rules)
  restraintRules: {
    maxInquiryTurns: 2, // 最多追问2轮，达到则无条件结论先行推荐
    decisionKeywords: [
      '直接推', '就推荐', '别问了', '别问那么多', '选一个', '买哪个', '二选一', '哪个好',
      '现在就要', '现在就下单', '直接给链接', '给型号', '就决定', '懒得想', '哪个最值',
      '直接告诉我买哪个', '不纠结了', '闭眼买', '闭眼入', '直接给我一个', '算了我不想选'
    ],
    topicShiftIndicators: [
      '多少钱', '参数', '续航多久', '重不重', '索尼XM5', 'Bose怎么样', '降噪怎么样', '到底好不好'
    ]
  }
};
