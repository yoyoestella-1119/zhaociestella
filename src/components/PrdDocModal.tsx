/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Modal,
  Tabs,
  Card,
  Row,
  Col,
  Tag,
  Button,
  Space,
  Typography,
  message
} from 'antd';
import {
  BookOutlined,
  CopyOutlined,
  CheckOutlined,
  ApartmentOutlined,
  SafetyCertificateOutlined,
  TrophyOutlined,
  CompassOutlined,
  SlidersOutlined
} from '@ant-design/icons';

const { Text, Paragraph, Title } = Typography;

interface PrdDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrdDocModal: React.FC<PrdDocModalProps> = ({ isOpen, onClose }) => {
  const [activeKey, setActiveKey] = useState<string>('sec1');
  const [copied, setCopied] = useState<boolean>(false);

  const fullMarkdownDoc = `# SoundMatch AI - 耳机品类智能导购助手 PRD 与产品说明文档

## 1. 背景与行业问题
在传统数码 3C 消费场景（尤其耳机品类）中，用户常带有高度口语化、复合模糊的意图（如“夏天戴着挤地铁不会闷出汗、轻一点不压耳”），而传统电商搜索与漏斗筛选器存在严重割裂：
- 无法理解场景化隐喻
- 参数门槛高导致放弃选购
- 传统客服或机械Bot废话多、易产生大模型虚构幻觉

## 2. 用户场景示例（六大核心场景）
1. 通勤/差旅 2. 沉浸办公/会议 3. 运动/户外 4. HiFi发烧 5. 专业电竞低延迟 6. 学生高性价比

## 3. 产品技术架构（裁剪后三层精简架构）
- Layer 1: 需求解析层 (Semantic Slot Parser) -> 四维画像
- Layer 2: 澄清决策层 (Master Agent + 双 Skill 并行) -> 四大克制规则
- Layer 3: 确定性推荐与防幻觉生成 (Grounding & Verification) -> 36款真实库 + 好回答四标准

## 4. 需求解析 Schema 与耳机品类词典
详细定义四维画像 JSON 与场景/痛点映射规则

## 5. 对话流程与探需克制规则状态机
最多追问2轮、带选项问、决策期信号直接下定论

## 6. 边界与防幻觉机制
100%真实商品库对齐、逐字参数核验、缺失属性坦诚告知

## 7. 评估方案（25+条测试 Query + 0-3 分黄金标尺）
切中核心(1.0) + 诉求全覆盖(1.0) + 可直接行动(0.5) + 清晰有温度(0.5)

## 8. 后续演进规划
Phase 1: 当前 Demo -> Phase 2: 电商 PIM 对接 -> Phase 3: 多模态体感试戴
`;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(fullMarkdownDoc);
    setCopied(true);
    message.success('已复制完整 PRD Markdown 文档！');
    setTimeout(() => setCopied(false), 2000);
  };

  const tabItems = [
    {
      key: 'sec1',
      label: '1. 背景与痛点',
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Title level={5} style={{ color: '#f8fafc', margin: 0 }}>
            1. 产品背景与行业痛点分析
          </Title>
          <Paragraph style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.7 }}>
            普通消费者在挑选耳机时，表达往往是生活化场景（例如：“夏天挤地铁戴”、“耳道小容易发炎”、“戴眼镜夹头”），而传统电商仅提供专业工程参数（动圈、动铁、LDAC），造成严重的认知脱节与高退货率。
          </Paragraph>
          <Row gutter={[12, 12]}>
            <Col xs={24} md={12}>
              <Card size="small" style={{ background: 'rgba(244, 63, 94, 0.08)', borderColor: 'rgba(244, 63, 94, 0.3)' }}>
                <Text strong style={{ color: '#fb7185', display: 'block', marginBottom: 4 }}>传统电商漏斗式筛选痛点：</Text>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: '#cbd5e1', lineHeight: 1.7 }}>
                  <li>专业参数门槛高，普通用户不知如何选择</li>
                  <li>勾选多重过滤条件后经常搜出 0 条结果</li>
                  <li>无法告知是否夹眼镜腿、夏天戴是否捂汗等体征体验</li>
                </ul>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card size="small" style={{ background: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                <Text strong style={{ color: '#34d399', display: 'block', marginBottom: 4 }}>SoundMatch AI 破局解法：</Text>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: '#cbd5e1', lineHeight: 1.7 }}>
                  <li>四维画像抽取：口语自动转译为场景、属性、履约、预算</li>
                  <li>克制探需拒绝盘问：最多2轮追问、带选项、信号直接停</li>
                  <li>防幻觉确定性知识库：只推真实收录款，参数逐字溯源</li>
                </ul>
              </Card>
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: 'sec2',
      label: '2. 六大场景定义',
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Title level={5} style={{ color: '#f8fafc', margin: 0 }}>
            2. 耳机核心六大场景定义与特征矩阵
          </Title>
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12} key="c1">
              <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
                <Text strong style={{ color: '#818cf8', display: 'block' }}>🚇 通勤 / 差旅场景</Text>
                <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>
                  核心诉求：≥38dB 深度 ANC，压制交通低频轰鸣；抗风噪；通透报站防坐过站；轻便好收纳。
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} key="c2">
              <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
                <Text strong style={{ color: '#818cf8', display: 'block' }}>💼 沉浸办公 / 会议</Text>
                <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>
                  核心诉求：多麦克风 AI 通话降噪（过滤键盘声与同事人声）；双设备无缝流转；零耳压。
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} key="c3">
              <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
                <Text strong style={{ color: '#818cf8', display: 'block' }}>🏃 运动 / 户外场景</Text>
                <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>
                  核心诉求：开放式/骨传导不塞耳道；防汗防中耳炎；保留环境车流声音保障人身安全。
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} key="c4">
              <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
                <Text strong style={{ color: '#818cf8', display: 'block' }}>🎼 HiFi 发烧 / 监听</Text>
                <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>
                  核心诉求：高解析度驱动单体、中正中性声音还原、有线无损零延迟、脱箱感大声场。
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} key="c5">
              <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
                <Text strong style={{ color: '#818cf8', display: 'block' }}>🎮 电竞低延迟游戏</Text>
                <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>
                  核心诉求：2.4GHz 无线（延迟 &lt; 20ms），枪声与脚步声瞬态分明，广播级降噪麦克风。
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} key="c6">
              <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
                <Text strong style={{ color: '#818cf8', display: 'block' }}>🎓 学生高性价比</Text>
                <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>
                  核心诉求：300 元内实现越级 38dB 降噪与 30+ 小时长续航，皮实耐用，丢失不心疼。
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: 'sec3',
      label: '3. 三层产品架构',
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Title level={5} style={{ color: '#f8fafc', margin: 0 }}>
            3. 裁剪后三层精简架构
          </Title>
          <Card size="small" style={{ background: '#020617', borderColor: '#1e293b' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#cbd5e1', lineHeight: 1.8 }}>
              <div style={{ color: '#818cf8', fontWeight: 700 }}>[用户口语输入] ➔ Layer 1: 需求解析层 (Semantic Slot Parser)</div>
              <div style={{ paddingLeft: 16 }}>└─ 抽取四维画像：场景(scene)、属性(specs)、履约(delivery)、预算(budget)，缺项标 unknown</div>
              <div style={{ color: '#c084fc', fontWeight: 700, marginTop: 6 }}>➔ Layer 2: 澄清决策层 (Master Agent + 双 Skill 并行)</div>
              <div style={{ paddingLeft: 16 }}>
                ├─ 营销 Skill：识别决策收敛信号与预算冲突，输出 reply_strategy
                <br />
                ├─ 探需 Skill：输出带选项追问，严格执行四大克制规则（追问≥2次停、决策信号停、上轮未响应停、必须带选项问）
              </div>
              <div style={{ color: '#34d399', fontWeight: 700, marginTop: 6 }}>➔ Layer 3: 确定性推荐与防幻觉生成 (Grounding & Verification)</div>
              <div style={{ paddingLeft: 16 }}>
                ├─ 36 款真实商品库硬过滤 + 软打分矩阵 (场景35分+预算25分+属性25分+履约15分)
                <br />
                ├─ 防幻觉质检：型号、价格、降噪dB、克重 100% 对齐真实字段
                <br />
                └─ 好回答四标准生成回复：结论先行 1~2 款推荐，挂真实理由与选购妥协点
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      key: 'sec4',
      label: '4. 四维Schema与词典',
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Title level={5} style={{ color: '#f8fafc', margin: 0 }}>
            4. 四维画像 JSON Schema 与品类同义词映射词典
          </Title>
          <pre
            style={{
              background: '#020617',
              padding: 12,
              borderRadius: 8,
              border: '1px solid #1e293b',
              color: '#38bdf8',
              fontFamily: 'monospace',
              fontSize: 11,
              margin: 0
            }}
          >{`{
  "scene": { "primary": "通勤/差旅 | 沉浸办公 | 运动/户外 | HiFi发烧 | 电竞游戏 | 学生高性价比 | unknown", "painPoints": [] },
  "specs": { "formFactor": "入耳式 | 头戴罩耳 | 开放式/耳挂 | 耳夹式 | 骨传导 | unknown", "ancRequired": true },
  "delivery": { "speed": "次日达 | 当日达 | unknown", "strictTime": false },
  "budget": { "min": number | null, "max": number | null, "flexibility": "strict | negotiable" }
}`}</pre>
          <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
            <Text strong style={{ color: '#f8fafc', display: 'block', marginBottom: 4 }}>品类同义词与痛点映射：</Text>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: '#cbd5e1', lineHeight: 1.7 }}>
              <li>“夏天不闷 / 油耳 / 耳道小怕痛” ➔ 自动映射开放式/耳挂或耳夹式</li>
              <li>“地铁轰隆隆 / 飞机发动机” ➔ 自动映射 ≥38dB 深度 ANC</li>
              <li>“打瓦 / 吃鸡 / CS2” ➔ 自动映射 2.4GHz 无线低延迟 &lt;20ms</li>
              <li>“百元 / 学生党 / 便宜” ➔ 自动锁定预算上限 ≤ 400 元</li>
            </ul>
          </Card>
        </div>
      )
    },
    {
      key: 'sec5',
      label: '5. 状态机与克制规则',
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Title level={5} style={{ color: '#f8fafc', margin: 0 }}>
            5. 对话状态机与探需四大克制规则
          </Title>
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12} key="r1">
              <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
                <Tag color="gold" style={{ marginBottom: 4 }}>规则 1：追问次数封顶 (≤2轮)</Tag>
                <div style={{ fontSize: 12, color: '#cbd5e1' }}>最多发起 2 轮追问；达到后强制终止探需，根据现有画像直接输出最优解。</div>
              </Card>
            </Col>
            <Col xs={24} sm={12} key="r2">
              <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
                <Tag color="gold" style={{ marginBottom: 4 }}>规则 2：决策期强信号拦截</Tag>
                <div style={{ fontSize: 12, color: '#cbd5e1' }}>出现“直接推/选一个/别问了/二选一哪个好”，立即停止追问，结论先行直出推荐。</div>
              </Card>
            </Col>
            <Col xs={24} sm={12} key="r3">
              <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
                <Tag color="gold" style={{ marginBottom: 4 }}>规则 3：上轮未响应顺应</Tag>
                <div style={{ fontSize: 12, color: '#cbd5e1' }}>若用户跳过上轮选项转而询问其他参数，立刻顺应解答，不再重复追问。</div>
              </Card>
            </Col>
            <Col xs={24} sm={12} key="r4">
              <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
                <Tag color="gold" style={{ marginBottom: 4 }}>规则 4：追问必须带选项</Tag>
                <div style={{ fontSize: 12, color: '#cbd5e1' }}>每次追问提供 2~4 个结构化选项按键，杜绝开放漫无边际的提问。</div>
              </Card>
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: 'sec6',
      label: '6. 边界与防幻觉',
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Title level={5} style={{ color: '#f8fafc', margin: 0 }}>
            6. 边界与防幻觉机制 (Zero Hallucination)
          </Title>
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12} key="b1">
              <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
                <Text strong style={{ color: '#34d399', display: 'block' }}>1. 严禁推荐库外商品</Text>
                <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>所有推荐型号必须在 36 款脱敏商品库中存在，杜绝胡乱拼凑假型号。</div>
              </Card>
            </Col>
            <Col xs={24} sm={12} key="b2">
              <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
                <Text strong style={{ color: '#34d399', display: 'block' }}>2. 关键参数逐字核验</Text>
                <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>文案中的官方售价、降噪分贝数(dB)、续航时间、单耳重量(g)逐字校验对齐。</div>
              </Card>
            </Col>
            <Col xs={24} sm={12} key="b3">
              <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
                <Text strong style={{ color: '#34d399', display: 'block' }}>3. 伪需求客观澄清</Text>
                <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>对“防核辐射”、“永不充电”等违背物理常识提问，明确回答“暂不支持/商品库无此产品”。</div>
              </Card>
            </Col>
            <Col xs={24} sm={12} key="b4">
              <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
                <Text strong style={{ color: '#34d399', display: 'block' }}>4. 坦诚告知妥协点 (Cons)</Text>
                <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>每款推荐耳机均配有 1~2 条真实物理妥协点（如不可折叠、夏天佩戴易捂汗）。</div>
              </Card>
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: 'sec7',
      label: '7. 评估体系与标尺',
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Title level={5} style={{ color: '#f8fafc', margin: 0 }}>
            7. 评估方案与 0-3 分黄金标尺
          </Title>
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12} key="s3">
              <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
                <Tag color="success">3分 (优秀标杆)</Tag>
                <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>好回答四标准全达标：结论先行切中痛点、诉求全覆盖、给出明确行动建议、清晰有温度。</div>
              </Card>
            </Col>
            <Col xs={24} sm={12} key="s2">
              <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
                <Tag color="processing">2分 (合格基线)</Tag>
                <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>槽位解析完整，克制探需规则生效，推荐单品价格与场景吻合，参数无误。</div>
              </Card>
            </Col>
            <Col xs={24} sm={12} key="s1">
              <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
                <Tag color="warning">1分 (勉强及格)</Tag>
                <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>推荐了耳机但机械堆砌参数，未能针对痛点做场景化权衡，或产生轻度冗余追问。</div>
              </Card>
            </Col>
            <Col xs={24} sm={12} key="s0">
              <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
                <Tag color="error">0分 (不及格/幻觉)</Tag>
                <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 4 }}>出现捏造的假型号、价格参数造假、触碰禁忌词、或严重答非所问，一票否决。</div>
              </Card>
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: 'sec8',
      label: '8. 演进规划',
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Title level={5} style={{ color: '#f8fafc', margin: 0 }}>
            8. 后续演进与商业化落地路线
          </Title>
          <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
            <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.8 }}>
              <div><strong style={{ color: '#818cf8' }}>Phase 1 (当前 Demo)：</strong>三层精简架构、36款脱敏耳机库、思考过程可视化面板、四大克制规则、0-3分 Benchmark 评测集。</div>
              <div><strong style={{ color: '#c084fc' }}>Phase 2 (电商企业级接入)：</strong>对接主流电商商品中心 PIM API，引入实时优惠券、省份区域实时库存与履约时效，支持一键加购。</div>
              <div><strong style={{ color: '#38bdf8' }}>Phase 3 (多模态体感试戴)：</strong>支持用户上传耳朵佩戴照片，通过计算机视觉智能判定耳道大小与耳廓角度，自适应匹配最佳耳套尺寸。</div>
            </div>
          </Card>
        </div>
      )
    }
  ];

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1000}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 28 }}>
          <Space size={10} align="center">
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16
              }}
            >
              <BookOutlined />
            </div>
            <div>
              <Space size={8}>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>
                  产品需求说明文档 (PRD) 与架构设计说明
                </span>
                <Tag color="purple">Version 1.0 Production</Tag>
              </Space>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400 }}>
                涵盖八大章节：从痛点背景到三层架构、耳机词典、克制状态机与评测体系
              </div>
            </div>
          </Space>

          <Button
            type="default"
            icon={copied ? <CheckOutlined style={{ color: '#34d399' }} /> : <CopyOutlined />}
            onClick={handleCopyMarkdown}
            style={{ background: '#1e293b', borderColor: '#334155', color: '#cbd5e1' }}
          >
            {copied ? '已复制 Markdown' : '复制全文'}
          </Button>
        </div>
      }
      styles={{
        body: { background: '#0f172a' },
        header: { background: '#0f172a', borderBottom: '1px solid #1e293b', paddingBottom: 12 }
      }}
    >
      <div style={{ padding: '8px 0 0' }}>
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          items={tabItems}
          tabPosition="left"
          style={{ minHeight: 460 }}
        />
      </div>
    </Modal>
  );
};
