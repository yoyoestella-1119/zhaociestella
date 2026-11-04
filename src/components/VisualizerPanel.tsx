/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ThinkingProcessTrace
} from '../types';
import {
  Tabs,
  Descriptions,
  Tag,
  Badge,
  Card,
  Progress,
  Table,
  Button,
  Space,
  Typography,
  Alert,
  Tooltip
} from 'antd';
import {
  AppstoreOutlined,
  CopyOutlined,
  CheckOutlined,
  CloseOutlined,
  CodeOutlined,
  SafetyCertificateOutlined,
  SlidersOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

interface VisualizerPanelProps {
  trace: ThinkingProcessTrace | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VisualizerPanel: React.FC<VisualizerPanelProps> = ({ trace, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<string>('step1');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopyJson = () => {
    if (!trace) return;
    navigator.clipboard.writeText(JSON.stringify(trace, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const auditColumns = [
    {
      title: '核验项目',
      dataIndex: 'attrName',
      key: 'attrName',
      render: (text: string) => <Text style={{ fontSize: 11, color: '#94a3b8' }}>{text}</Text>
    },
    {
      title: '回复宣称值',
      dataIndex: 'claimedValue',
      key: 'claimedValue',
      render: (text: string) => <Text strong style={{ fontSize: 11, color: '#f8fafc' }}>{text}</Text>
    },
    {
      title: '知识库真实值',
      dataIndex: 'catalogTruth',
      key: 'catalogTruth',
      render: (text: string) => <Text code style={{ fontSize: 11, color: '#34d399' }}>{text}</Text>
    },
    {
      title: '状态',
      dataIndex: 'verified',
      key: 'verified',
      align: 'center' as const,
      render: (verified: boolean) =>
        verified ? (
          <Tag color="success" style={{ margin: 0, fontSize: 10 }}>✓ 真实</Tag>
        ) : (
          <Tag color="error" style={{ margin: 0, fontSize: 10 }}>✗ 存疑</Tag>
        )
    }
  ];

  const tabItems = [
    {
      key: 'step1',
      label: '① 需求解析',
      children: trace ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Raw Input Card */}
          <Card size="small" style={{ background: '#0f172a', borderColor: '#1e293b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ fontSize: 11, color: '#94a3b8' }}>原始自然语言输入 (Raw Query)</Text>
              <Text style={{ fontSize: 10, color: '#64748b' }}>{trace.timestamp}</Text>
            </div>
            <Paragraph style={{ margin: 0, color: '#f8fafc', fontWeight: 500, fontSize: 12 }}>
              "{trace.step1_parsing.rawInput}"
            </Paragraph>
            {trace.step1_parsing.extractedKeywords.length > 0 && (
              <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {trace.step1_parsing.extractedKeywords.map((kw, i) => (
                  <Tag key={i} color="purple" style={{ margin: 0, fontSize: 10 }}>
                    {kw}
                  </Tag>
                ))}
              </div>
            )}
          </Card>

          {/* 4D Profile Schema Descriptions */}
          <Card
            size="small"
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#f8fafc' }}>四维需求画像 (4D Profile)</span>
                <Tag color={trace.step1_parsing.unknownCount > 0 ? 'warning' : 'success'} style={{ margin: 0, fontSize: 10 }}>
                  未决槽位: {trace.step1_parsing.unknownCount} 项
                </Tag>
              </div>
            }
            style={{ background: '#0f172a', borderColor: '#1e293b' }}
          >
            <Descriptions size="small" column={1} bordered style={{ fontSize: 11 }}>
              <Descriptions.Item label="1. 使用场景 (Scene)">
                <Space>
                  <Tag color="blue">{trace.step1_parsing.profile.scene.primary}</Tag>
                  {trace.step1_parsing.profile.scene.subScene && (
                    <Text style={{ fontSize: 11, color: '#94a3b8' }}>{trace.step1_parsing.profile.scene.subScene}</Text>
                  )}
                </Space>
                {trace.step1_parsing.profile.scene.painPoints.length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    {trace.step1_parsing.profile.scene.painPoints.map((p, i) => (
                      <Tag key={i} color="red" style={{ margin: '2px 4px 2px 0', fontSize: 10 }}>
                        {p}
                      </Tag>
                    ))}
                  </div>
                )}
              </Descriptions.Item>

              <Descriptions.Item label="2. 属性要求 (Specs)">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 4 }}>
                  <div>形态: <Tag color="purple">{trace.step1_parsing.profile.specs.formFactor}</Tag></div>
                  <div>降噪: <Text strong style={{ color: '#38bdf8' }}>{String(trace.step1_parsing.profile.specs.ancRequired)}</Text></div>
                  <div>舒适度优先: <Text strong>{trace.step1_parsing.profile.specs.comfortPriority}</Text></div>
                  <div>超长续航: <Text strong>{trace.step1_parsing.profile.specs.batteryPriority}</Text></div>
                  <div>防水等级: <Text strong>{trace.step1_parsing.profile.specs.waterproofLevel}</Text></div>
                  <div>声音偏好: <Text strong style={{ color: '#a855f7' }}>{trace.step1_parsing.profile.specs.soundPreference}</Text></div>
                </div>
              </Descriptions.Item>

              <Descriptions.Item label="3. 履约要求 (Delivery)">
                <Space>
                  <Tag color="gold">{trace.step1_parsing.profile.delivery.speed}</Tag>
                  <Text style={{ fontSize: 11, color: '#94a3b8' }}>
                    强时效约束: {trace.step1_parsing.profile.delivery.strictTime ? '是 (急用)' : '否'}
                  </Text>
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="4. 预算要求 (Budget)">
                <Space>
                  <Tag color="green">
                    {trace.step1_parsing.profile.budget.max !== null
                      ? `上限 ¥${trace.step1_parsing.profile.budget.max}`
                      : '预算未明示'}
                  </Tag>
                  <Text style={{ fontSize: 11, color: '#94a3b8' }}>
                    弹性: {trace.step1_parsing.profile.budget.flexibility}
                  </Text>
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      ) : null
    },
    {
      key: 'step2',
      label: '② 澄清决策',
      children: trace ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Strategy Type Alert */}
          <Alert
            message={`策略执行输出: ${trace.step2_strategy.strategyType}`}
            description={trace.step2_strategy.reason}
            type={
              trace.step2_strategy.strategyType === 'DIRECT_RECOMMENDATION'
                ? 'success'
                : trace.step2_strategy.strategyType === 'PROACTIVE_INQUIRY'
                ? 'info'
                : 'warning'
            }
            showIcon
            style={{ background: '#0f172a', borderColor: '#1e293b' }}
          />

          {/* Restraint Rules State Machine Card */}
          <Card
            size="small"
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#f8fafc' }}>探需克制状态机 (Restraint Rules)</span>
                <Tag color="cyan">当前轮次: {trace.step2_strategy.inquiryCount}/2</Tag>
              </div>
            }
            style={{ background: '#0f172a', borderColor: '#1e293b' }}
          >
            <Descriptions size="small" column={1} bordered style={{ fontSize: 11 }}>
              <Descriptions.Item label="1. 追问轮数上限检查 (≤2轮)">
                {trace.step2_strategy.maxInquiryReached ? (
                  <Tag color="error">达到上限强制停止</Tag>
                ) : (
                  <Tag color="success">正常范围内</Tag>
                )}
              </Descriptions.Item>

              <Descriptions.Item label="2. 决策期收敛信号拦截">
                {trace.step2_strategy.decisionSignalTriggered ? (
                  <Tag color="warning">识别到决策信号，直接出推荐</Tag>
                ) : (
                  <Tag color="default">未触发强收敛信号</Tag>
                )}
              </Descriptions.Item>

              <Descriptions.Item label="3. 上轮探需未响应顺应">
                {trace.step2_strategy.topicShiftBypass ? (
                  <Tag color="warning">用户转移焦点，停止追问</Tag>
                ) : (
                  <Tag color="default">无跳过行为</Tag>
                )}
              </Descriptions.Item>

              <Descriptions.Item label="4. 追问带选项检查">
                {trace.step2_strategy.proactiveInquiry ? (
                  <Tag color="processing">带 {trace.step2_strategy.proactiveInquiry.options.length} 个结构化选项</Tag>
                ) : (
                  <Tag color="default">当前无需追问</Tag>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Options payload if inquiry */}
          {trace.step2_strategy.proactiveInquiry && (
            <Card
              size="small"
              title={<span style={{ fontSize: 12, color: '#c084fc' }}>探需 Skill 输出选项 payload</span>}
              style={{ background: '#0f172a', borderColor: 'rgba(168, 85, 247, 0.3)' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {trace.step2_strategy.proactiveInquiry.options.map((opt) => (
                  <div
                    key={opt.id}
                    style={{
                      background: '#020617',
                      padding: '6px 10px',
                      borderRadius: 6,
                      border: '1px solid #1e293b',
                      fontSize: 11,
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Text strong style={{ color: '#e2e8f0' }}>{opt.label}</Text>
                    <Tag style={{ margin: 0, fontSize: 10 }}>{opt.clarifyDimension}</Tag>
                  </div>
                ))}
              </Space>
            </Card>
          )}
        </div>
      ) : null
    },
    {
      key: 'step3',
      label: '③ 召回打分',
      children: trace ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Funnel Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center' }}>
            <Card size="small" style={{ background: '#0f172a', borderColor: '#1e293b' }}>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>商品库总量</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc' }}>
                {trace.step3_retrieval.totalCatalogSize} 款
              </div>
            </Card>
            <Card size="small" style={{ background: '#0f172a', borderColor: '#1e293b' }}>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>硬过滤通过</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#38bdf8' }}>
                {trace.step3_retrieval.hardFilterPassedCount} 款
              </div>
            </Card>
            <Card size="small" style={{ background: '#0f172a', borderColor: '#1e293b' }}>
              <div style={{ fontSize: 10, color: '#94a3b8' }}>最终优选推荐</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#34d399' }}>
                {trace.step3_retrieval.topMatches.length} 款
              </div>
            </Card>
          </div>

          {/* Top Matches Scoring Cards */}
          <Space orientation="vertical" size={10} style={{ width: '100%' }}>
            {trace.step3_retrieval.topMatches.map((m, idx) => (
              <Card
                key={m.item.id}
                size="small"
                style={{ background: '#0f172a', borderColor: idx === 0 ? '#6366f1' : '#1e293b' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <Space size={6}>
                      <Tag color={idx === 0 ? 'gold' : 'blue'}>Top {idx + 1}</Tag>
                      <Text strong style={{ color: '#f8fafc', fontSize: 12 }}>
                        {m.item.name}
                      </Text>
                    </Space>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                      ¥{m.item.price} • {m.item.formFactor}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#818cf8' }}>
                      {m.totalScore}
                    </span>
                    <span style={{ fontSize: 10, color: '#64748b' }}>/100分</span>
                  </div>
                </div>

                {/* Score breakdown progress bars */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, fontSize: 10, color: '#cbd5e1' }}>
                  <div>
                    场景契合 ({m.scoreBreakdown.sceneFit}/35)
                    <Progress percent={Math.round((m.scoreBreakdown.sceneFit / 35) * 100)} size="small" strokeColor="#38bdf8" />
                  </div>
                  <div>
                    预算适配 ({m.scoreBreakdown.budgetFit}/25)
                    <Progress percent={Math.round((m.scoreBreakdown.budgetFit / 25) * 100)} size="small" strokeColor="#34d399" />
                  </div>
                  <div>
                    属性特征 ({m.scoreBreakdown.specsFit}/25)
                    <Progress percent={Math.round((m.scoreBreakdown.specsFit / 25) * 100)} size="small" strokeColor="#a855f7" />
                  </div>
                  <div>
                    履约售后 ({m.scoreBreakdown.deliveryFit}/15)
                    <Progress percent={Math.round((m.scoreBreakdown.deliveryFit / 15) * 100)} size="small" strokeColor="#fbbf24" />
                  </div>
                </div>

                {m.matchReasons.length > 0 && (
                  <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid #1e293b', fontSize: 10, color: '#6ee7b7' }}>
                    ✓ {m.matchReasons[0]}
                  </div>
                )}
              </Card>
            ))}
          </Space>
        </div>
      ) : null
    },
    {
      key: 'step4',
      label: '④ 防幻觉',
      children: trace ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Alert
            message={
              trace.step4_generationAudit.passed
                ? '防幻觉质检通过 (100% 真实商品库对齐)'
                : '检测到未收录属性或参数异常'
            }
            description="严禁向用户推荐虚构型号；价格、降噪dB、重量与续航逐字校验。"
            type={trace.step4_generationAudit.passed ? 'success' : 'error'}
            showIcon
            style={{ background: '#0f172a', borderColor: '#1e293b' }}
          />

          <Card size="small" title={<span style={{ fontSize: 12, color: '#f8fafc' }}>声明属性 vs 真实商品库溯源表</span>} style={{ background: '#0f172a', borderColor: '#1e293b' }}>
            <Table
              size="small"
              columns={auditColumns}
              dataSource={trace.step4_generationAudit.claimedAttributes.map((attr, idx) => ({ ...attr, key: idx }))}
              pagination={false}
              style={{ background: 'transparent' }}
            />
          </Card>
        </div>
      ) : null
    },
    {
      key: 'raw',
      label: (
        <span>
          <CodeOutlined /> JSON
        </span>
      ),
      children: trace ? (
        <pre
          style={{
            background: '#020617',
            padding: 12,
            borderRadius: 8,
            border: '1px solid #1e293b',
            color: '#a5b4fc',
            fontFamily: 'monospace',
            fontSize: 11,
            lineHeight: 1.6,
            maxHeight: 520,
            overflowX: 'auto',
            margin: 0
          }}
        >
          {JSON.stringify(trace, null, 2)}
        </pre>
      ) : null
    }
  ];

  return (
    <aside
      style={{
        width: 480,
        background: '#0b1120',
        borderLeft: '1px solid #1e293b',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)',
        position: 'sticky',
        top: 64,
        zIndex: 20
      }}
    >
      {/* Panel Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#0f172a'
        }}
      >
        <Space size={8} align="center">
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: 'rgba(99, 102, 241, 0.2)',
              color: '#818cf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14
            }}
          >
            <AppstoreOutlined />
          </div>
          <div>
            <Text strong style={{ color: '#f8fafc', fontSize: 13, display: 'block' }}>
              思考过程可视化面板
            </Text>
            <Text style={{ color: '#64748b', fontSize: 10 }}>
              Trace Inspector
            </Text>
          </div>
        </Space>

        <Space size={6}>
          <Tooltip title="复制完整思考 JSON">
            <Button
              size="small"
              icon={copied ? <CheckOutlined style={{ color: '#34d399' }} /> : <CopyOutlined />}
              onClick={handleCopyJson}
              disabled={!trace}
              style={{ background: '#1e293b', borderColor: '#334155', color: '#cbd5e1' }}
            />
          </Tooltip>
          <Button
            size="small"
            icon={<CloseOutlined />}
            onClick={onClose}
            style={{ background: '#1e293b', borderColor: '#334155', color: '#cbd5e1' }}
          />
        </Space>
      </div>

      {/* Panel Tabs Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        {!trace ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <AppstoreOutlined style={{ fontSize: 32, marginBottom: 12, color: '#334155' }} />
            <Text style={{ display: 'block', color: '#94a3b8', fontSize: 12 }}>
              等待用户发送第一条需求...
            </Text>
            <Text style={{ display: 'block', color: '#64748b', fontSize: 11, marginTop: 4 }}>
              发送需求或点击上方预置场景，可在此实时查看四维解析与中间决策过程。
            </Text>
          </div>
        ) : (
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            size="small"
            style={{ color: '#cbd5e1' }}
          />
        )}
      </div>
    </aside>
  );
};
