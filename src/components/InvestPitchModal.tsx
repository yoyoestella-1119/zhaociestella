/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Modal,
  Tabs,
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Slider,
  Tag,
  Button,
  Space,
  Typography,
  Alert,
  Descriptions,
  message,
  Tooltip
} from 'antd';
import {
  FundOutlined,
  DollarCircleOutlined,
  RiseOutlined,
  SafetyCertificateOutlined,
  CalculatorOutlined,
  PieChartOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  CopyOutlined,
  CheckOutlined,
  ApartmentOutlined,
  TeamOutlined
} from '@ant-design/icons';

const { Text, Paragraph, Title } = Typography;

interface InvestPitchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InvestPitchModal: React.FC<InvestPitchModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<string>('metrics');
  const [copied, setCopied] = useState<boolean>(false);

  // 动态 ROI 测算器状态
  const [dailyQueries, setDailyQueries] = useState<number>(50000); // 日均咨询量
  const [avgOrderValue, setAvgOrderValue] = useState<number>(680); // 客单价 (¥)
  const [conversionRate, setConversionRate] = useState<number>(8.5); // 导购转化率 (%)
  const [takeRate, setTakeRate] = useState<number>(6.0); // 平台/品牌CPS佣金比例 (%)

  // 计算测算财务结果
  const monthlyQueries = dailyQueries * 30;
  const monthlyOrders = Math.round(monthlyQueries * (conversionRate / 100));
  const monthlyGmv = monthlyOrders * avgOrderValue;
  const monthlyRevenue = monthlyGmv * (takeRate / 100);
  // 单次 query 耗费（包含本地意图解析+候选集加权打分+防幻觉质检，按高吞吐单次 ¥0.0035 计算）
  const singleQueryCost = 0.0035;
  const monthlyInferenceCost = monthlyQueries * singleQueryCost;
  const monthlyGrossProfit = monthlyRevenue - monthlyInferenceCost;
  const monthlyRoi = monthlyInferenceCost > 0 ? (monthlyRevenue / monthlyInferenceCost).toFixed(1) : '0';

  const pitchMemoText = `# SoundMatch AI - 耳机品类智能导购助手 投资与商业化评审备忘录 (#invest)

## 1. 核心投资亮点 (Investment Highlights)
- 赛道痛点：耳机品类退货率高达 20%~28%，用户痛点在生活化场景（如通勤捂汗、戴眼镜夹头），传统电商搜索因参数割裂导致大量流失。
- 创新解法：三层精简架构（口语转四维 Slot、探需克制状态机、100% 真实商品库防幻觉召回）。
- 验证数据：GMV 转化率较传统漏斗提升 +38.5%，退货率降至 9.2%，单次推理成本低至 ¥0.0035。

## 2. 单位经济模型 (Unit Economics)
- 单次咨询推理成本：¥0.0035 / query
- 导购转化率：${conversionRate}%，平均客单价：¥${avgOrderValue}
- 预计月促成 GMV：¥${(monthlyGmv / 10000).toFixed(1)} 万
- 预计月导购抽佣毛利：¥${(monthlyGrossProfit / 10000).toFixed(1)} 万，推理成本/营收占比 < 3%

## 3. 商业化路径 (Go-To-Market)
- Phase 1: 头部电商平台智能导购插件 (CPS 分成 4%~8%)
- Phase 2: 3C 消费电子品牌官网与私域商城 SaaS 授权 (年费 + 转化溢价分成)
- Phase 3: 扩品类复制（数码外设、智能穿戴、户外运动装备）
`;

  const handleCopyPitchMemo = () => {
    navigator.clipboard.writeText(pitchMemoText);
    setCopied(true);
    message.success('已复制投资评审备忘录 (Pitch Memo) 全文！');
    setTimeout(() => setCopied(false), 2000);
  };

  const tabItems = [
    {
      key: 'metrics',
      label: (
        <span>
          <RiseOutlined /> 核心投融资亮点
        </span>
      ),
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Alert
            message="投资评审重点 (#invest)：高质量商业化闭环与极低单次履约成本"
            description="SoundMatch AI 将大模型口语化理解与结构化商户知识库结合，攻克传统电商 3C 品类高流失与高退货瓶颈，实现极高单次履约毛利。"
            type="info"
            showIcon
            style={{ background: '#0b1329', borderColor: '#1d2c4d' }}
          />

          {/* 4 大核心关键经营指标卡片 */}
          <Row gutter={[12, 12]}>
            <Col xs={12} sm={6}>
              <Card size="small" style={{ background: '#0f172a', borderColor: '#1e293b', textAlign: 'center' }}>
                <Statistic
                  title={<span style={{ color: '#94a3b8', fontSize: 11 }}>GMV 转化率提升</span>}
                  value={38.5}
                  precision={1}
                  prefix={<RiseOutlined style={{ color: '#34d399' }} />}
                  suffix="%"
                  valueStyle={{ color: '#34d399', fontWeight: 700, fontSize: 20 }}
                />
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>对比传统参数搜索漏斗</div>
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small" style={{ background: '#0f172a', borderColor: '#1e293b', textAlign: 'center' }}>
                <Statistic
                  title={<span style={{ color: '#94a3b8', fontSize: 11 }}>品类退货率下降</span>}
                  value={9.2}
                  precision={1}
                  prefix={<SafetyCertificateOutlined style={{ color: '#38bdf8' }} />}
                  suffix="%"
                  valueStyle={{ color: '#38bdf8', fontWeight: 700, fontSize: 20 }}
                />
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>行业基准约 22%~28%</div>
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small" style={{ background: '#0f172a', borderColor: '#1e293b', textAlign: 'center' }}>
                <Statistic
                  title={<span style={{ color: '#94a3b8', fontSize: 11 }}>单次推理成本</span>}
                  value="¥0.0035"
                  prefix={<ThunderboltOutlined style={{ color: '#fbbf24' }} />}
                  valueStyle={{ color: '#fbbf24', fontWeight: 700, fontSize: 20 }}
                />
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>三层架构裁剪过滤</div>
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small" style={{ background: '#0f172a', borderColor: '#1e293b', textAlign: 'center' }}>
                <Statistic
                  title={<span style={{ color: '#94a3b8', fontSize: 11 }}>选购决策耗时</span>}
                  value={2.8}
                  precision={1}
                  suffix="min"
                  valueStyle={{ color: '#a855f7', fontWeight: 700, fontSize: 20 }}
                />
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>从平均 45 分钟缩短</div>
              </Card>
            </Col>
          </Row>

          {/* 投资壁垒与护城河对比 */}
          <Card
            size="small"
            title={<span style={{ color: '#f8fafc', fontSize: 13 }}><TrophyOutlined style={{ color: '#eab308' }} /> 技术壁垒与竞品护城河</span>}
            style={{ background: '#0f172a', borderColor: '#1e293b' }}
          >
            <Descriptions size="small" column={{ xs: 1, sm: 2, md: 3 }} bordered>
              <Descriptions.Item label="抗幻觉设计">
                <Tag color="success">100% 真实库对齐</Tag>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>严禁推荐未收录型号，价格与参数逐字溯源</div>
              </Descriptions.Item>
              <Descriptions.Item label="探需克制状态机">
                <Tag color="purple">最多2轮 + 选项</Tag>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>决策期信号（如明确千元内降噪）直接给结论，拒绝盘问</div>
              </Descriptions.Item>
              <Descriptions.Item label="推荐理由说服力">
                <Tag color="blue">挂靠真实属性</Tag>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>结论先行，直白陈述核心优势与透明权衡</div>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      )
    },
    {
      key: 'calculator',
      label: (
        <span>
          <CalculatorOutlined /> 商业化与动态 ROI 测算
        </span>
      ),
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Paragraph style={{ color: '#94a3b8', fontSize: 12, margin: 0 }}>
            通过调节下方业务参数，实时模拟 SoundMatch AI 导购助手在电商平台或品牌商城上线后的财务回报模型（Unit Economics）：
          </Paragraph>

          <Row gutter={[16, 16]}>
            {/* 左侧可调参数 */}
            <Col xs={24} md={12}>
              <Card
                size="small"
                title={<span style={{ color: '#f8fafc', fontSize: 13 }}>业务参数设定 (Variables)</span>}
                style={{ background: '#0f172a', borderColor: '#1e293b' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: '#cbd5e1' }}>日均导购咨询量 (Queries / Day)</span>
                      <span style={{ color: '#818cf8', fontWeight: 600 }}>{dailyQueries.toLocaleString()} 次</span>
                    </div>
                    <Slider
                      min={5000}
                      max={200000}
                      step={5000}
                      value={dailyQueries}
                      onChange={setDailyQueries}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: '#cbd5e1' }}>品类平均客单价 (AOV)</span>
                      <span style={{ color: '#fbbf24', fontWeight: 600 }}>¥{avgOrderValue}</span>
                    </div>
                    <Slider
                      min={200}
                      max={2500}
                      step={50}
                      value={avgOrderValue}
                      onChange={setAvgOrderValue}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: '#cbd5e1' }}>导购后下单转化率 (Conversion Rate)</span>
                      <span style={{ color: '#34d399', fontWeight: 600 }}>{conversionRate}%</span>
                    </div>
                    <Slider
                      min={2.0}
                      max={20.0}
                      step={0.5}
                      value={conversionRate}
                      onChange={setConversionRate}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: '#cbd5e1' }}>平台 / 品牌 CPS 分佣比例 (Take Rate)</span>
                      <span style={{ color: '#38bdf8', fontWeight: 600 }}>{takeRate}%</span>
                    </div>
                    <Slider
                      min={2.0}
                      max={15.0}
                      step={0.5}
                      value={takeRate}
                      onChange={setTakeRate}
                    />
                  </div>
                </div>
              </Card>
            </Col>

            {/* 右侧测算结果 */}
            <Col xs={24} md={12}>
              <Card
                size="small"
                title={<span style={{ color: '#f8fafc', fontSize: 13 }}>财务与收益预估 (Monthly Financials)</span>}
                style={{ background: '#0b1329', borderColor: '#1d2c4d' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <Row gutter={[12, 12]}>
                    <Col span={12}>
                      <Statistic
                        title={<span style={{ color: '#94a3b8', fontSize: 11 }}>月促成 GMV</span>}
                        value={(monthlyGmv / 10000).toFixed(1)}
                        suffix="万元"
                        valueStyle={{ color: '#fbbf24', fontSize: 18, fontWeight: 700 }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title={<span style={{ color: '#94a3b8', fontSize: 11 }}>月促成订单量</span>}
                        value={monthlyOrders}
                        suffix="单"
                        valueStyle={{ color: '#f8fafc', fontSize: 18, fontWeight: 700 }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title={<span style={{ color: '#94a3b8', fontSize: 11 }}>月导购分佣毛收入</span>}
                        value={(monthlyRevenue / 10000).toFixed(2)}
                        suffix="万元"
                        valueStyle={{ color: '#34d399', fontSize: 18, fontWeight: 700 }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title={<span style={{ color: '#94a3b8', fontSize: 11 }}>月模型服务器/API成本</span>}
                        value={(monthlyInferenceCost / 10000).toFixed(2)}
                        suffix="万元"
                        valueStyle={{ color: '#fb7185', fontSize: 18, fontWeight: 700 }}
                      />
                    </Col>
                  </Row>

                  <div style={{ background: '#020617', padding: 12, borderRadius: 8, border: '1px solid #1e293b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: '#f8fafc', fontWeight: 600 }}>月度经营净毛利</span>
                      <span style={{ fontSize: 18, color: '#34d399', fontWeight: 700 }}>
                        ¥{(monthlyGrossProfit / 10000).toFixed(2)} 万元
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, fontSize: 12 }}>
                      <span style={{ color: '#94a3b8' }}>Token 投入产出比 (ROI)</span>
                      <Tag color="gold" style={{ fontSize: 12, fontWeight: 700 }}>
                        {monthlyRoi}x (1 : {monthlyRoi})
                      </Tag>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <Progress
                        percent={Math.min(100, Math.round(Number(monthlyRoi) * 1.5))}
                        strokeColor={{ '0%': '#6366f1', '100%': '#34d399' }}
                        showInfo={false}
                        size="small"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: 'market',
      label: (
        <span>
          <PieChartOutlined /> 市场规模与商业模式
        </span>
      ),
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Row gutter={[12, 12]}>
            <Col xs={24} md={8}>
              <Card size="small" style={{ background: '#0f172a', borderColor: '#1e293b' }}>
                <Text strong style={{ color: '#38bdf8', fontSize: 13, display: 'block', marginBottom: 4 }}>
                  TAM (全球音频设备)
                </Text>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc' }}>¥ 5,200 亿</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>全球耳机、TWS与头戴设备年出货总额</div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card size="small" style={{ background: '#0f172a', borderColor: '#1e293b' }}>
                <Text strong style={{ color: '#818cf8', fontSize: 13, display: 'block', marginBottom: 4 }}>
                  SAM (国内电商 3C 音频)
                </Text>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc' }}>¥ 680 亿</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>国内各大电商线上耳机年零售总盘</div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card size="small" style={{ background: '#0f172a', borderColor: '#1e293b' }}>
                <Text strong style={{ color: '#34d399', fontSize: 13, display: 'block', marginBottom: 4 }}>
                  SOM (AI 导购场景渗透)
                </Text>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc' }}>¥ 34 亿</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>初期按 5% 智能导购分佣闭环测算</div>
              </Card>
            </Col>
          </Row>

          <Card
            size="small"
            title={<span style={{ color: '#f8fafc', fontSize: 13 }}><DollarCircleOutlined style={{ color: '#34d399' }} /> 三元商业化变现模式</span>}
            style={{ background: '#0f172a', borderColor: '#1e293b' }}
          >
            <Row gutter={[12, 12]}>
              <Col xs={24} md={8}>
                <div style={{ background: '#020617', padding: 12, borderRadius: 8, height: '100%', border: '1px solid #1e293b' }}>
                  <Tag color="cyan">模式 1</Tag>
                  <Text strong style={{ color: '#f8fafc', display: 'block', margin: '6px 0 4px', fontSize: 13 }}>
                    电商平台 CPS 促成分佣
                  </Text>
                  <Paragraph style={{ color: '#94a3b8', fontSize: 11, lineHeight: 1.6, margin: 0 }}>
                    通过精准匹配导购降低跳出，引导用户直接加入购物车与购买，按实际成单获得 4%~8% 的佣金分润。
                  </Paragraph>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div style={{ background: '#020617', padding: 12, borderRadius: 8, height: '100%', border: '1px solid #1e293b' }}>
                  <Tag color="purple">模式 2</Tag>
                  <Text strong style={{ color: '#f8fafc', display: 'block', margin: '6px 0 4px', fontSize: 13 }}>
                    品牌新品首发场景推荐位
                  </Text>
                  <Paragraph style={{ color: '#94a3b8', fontSize: 11, lineHeight: 1.6, margin: 0 }}>
                    在不违背用户真实需求的前提下，为声学大厂新品提供高契合度场景优先曝光与深度测评背书。
                  </Paragraph>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div style={{ background: '#020617', padding: 12, borderRadius: 8, height: '100%', border: '1px solid #1e293b' }}>
                  <Tag color="gold">模式 3</Tag>
                  <Text strong style={{ color: '#f8fafc', display: 'block', margin: '6px 0 4px', fontSize: 13 }}>
                    企业级导购 Engine SaaS 授权
                  </Text>
                  <Paragraph style={{ color: '#94a3b8', fontSize: 11, lineHeight: 1.6, margin: 0 }}>
                    向垂类电商 APP、数码零售商或品牌独立站输出标准化 API / SDK，收取年费及按调用量阶梯计费。
                  </Paragraph>
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      )
    },
    {
      key: 'roadmap',
      label: (
        <span>
          <RocketOutlined /> 融资与演进路线
        </span>
      ),
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card
            size="small"
            title={<span style={{ color: '#f8fafc', fontSize: 13 }}><ApartmentOutlined style={{ color: '#818cf8' }} /> 三阶段技术与业务飞轮</span>}
            style={{ background: '#0f172a', borderColor: '#1e293b' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div style={{ background: '#020617', padding: 12, borderRadius: 8, border: '1px solid #1e293b' }}>
                <Tag color="blue">阶段一：验证期</Tag>
                <div style={{ fontWeight: 600, color: '#f8fafc', margin: '6px 0 4px', fontSize: 13 }}>耳机品类单点打透</div>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#94a3b8', lineHeight: 1.7 }}>
                  <li>构建 36+ 真实品类知识图谱</li>
                  <li>落地 4 维画像与探需克制状态机</li>
                  <li>完成 25+ 全场景 Benchmark 验证</li>
                </ul>
              </div>
              <div style={{ background: '#020617', padding: 12, borderRadius: 8, border: '1px solid #1e293b' }}>
                <Tag color="cyan">阶段二：拓品期</Tag>
                <div style={{ fontWeight: 600, color: '#f8fafc', margin: '6px 0 4px', fontSize: 13 }}>3C 数码与户外装备复制</div>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#94a3b8', lineHeight: 1.7 }}>
                  <li>拓展至键鼠外设、显示器、露营装备</li>
                  <li>对接电商商家端 PIM 自动更新</li>
                  <li>引入多模态商品参数卡片对比</li>
                </ul>
              </div>
              <div style={{ background: '#020617', padding: 12, borderRadius: 8, border: '1px solid #1e293b' }}>
                <Tag color="gold">阶段三：平台期</Tag>
                <div style={{ fontWeight: 600, color: '#f8fafc', margin: '6px 0 4px', fontSize: 13 }}>全域自主导购 Agent 网络</div>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: '#94a3b8', lineHeight: 1.7 }}>
                  <li>自主跨电商平台比价与优惠券组合</li>
                  <li>个性化耳道声学特征试戴模拟</li>
                  <li>全球化多语言出海导购部署</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card
            size="small"
            title={<span style={{ color: '#f8fafc', fontSize: 13 }}><TeamOutlined style={{ color: '#34d399' }} /> 资金使用规划 (Use of Funds)</span>}
            style={{ background: '#0f172a', borderColor: '#1e293b' }}
          >
            <Row gutter={[16, 12]}>
              <Col xs={24} md={8}>
                <div style={{ fontSize: 12, color: '#cbd5e1', marginBottom: 4 }}>品类声学知识库与算法 (40%)</div>
                <Progress percent={40} strokeColor="#6366f1" size="small" />
              </Col>
              <Col xs={24} md={8}>
                <div style={{ fontSize: 12, color: '#cbd5e1', marginBottom: 4 }}>低延迟算力与推理优化 (30%)</div>
                <Progress percent={30} strokeColor="#38bdf8" size="small" />
              </Col>
              <Col xs={24} md={8}>
                <div style={{ fontSize: 12, color: '#cbd5e1', marginBottom: 4 }}>渠道商户拓展与商务合作 (30%)</div>
                <Progress percent={30} strokeColor="#34d399" size="small" />
              </Col>
            </Row>
          </Card>
        </div>
      )
    }
  ];

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      width={900}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 24 }}>
          <Space size={8} align="center">
            <span style={{ color: '#818cf8', fontSize: 18 }}>
              <FundOutlined />
            </span>
            <div>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>
                投资评审与商业化价值分析
              </span>
              <Tag color="purple" style={{ marginLeft: 8 }}>#invest 投资人视角</Tag>
            </div>
          </Space>
          <Button
            type="default"
            size="small"
            icon={copied ? <CheckOutlined style={{ color: '#34d399' }} /> : <CopyOutlined />}
            onClick={handleCopyPitchMemo}
            style={{ background: '#1e293b', borderColor: '#334155', color: '#cbd5e1' }}
          >
            {copied ? '已复制备忘录' : '复制 Pitch Memo'}
          </Button>
        </div>
      }
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#64748b' }}>
            支持在浏览器 URL 追加 <code style={{ color: '#818cf8' }}>#invest</code> 锚点直达本评审面板
          </span>
          <Button type="primary" onClick={onClose} style={{ background: '#6366f1', borderColor: '#6366f1' }}>
            完成评审
          </Button>
        </div>
      }
      styles={{
        body: { background: '#0b1120', padding: '16px 20px' },
        header: { background: '#0f172a', borderBottom: '1px solid #1e293b', paddingBottom: 12 }
      }}
    >
      <div style={{ padding: '8px 0 0' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="middle"
        />
      </div>
    </Modal>
  );
};
