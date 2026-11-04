/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Collapse, Tabs, Card, Tag, Row, Col, Alert, Typography, Space } from 'antd';
import {
  ExclamationCircleOutlined,
  CompassOutlined,
  ApartmentOutlined,
  CheckCircleOutlined,
  BulbOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

export const PainPointsAndPrinciples: React.FC = () => {
  const tabItems = [
    {
      key: 'pain',
      label: (
        <span>
          <ExclamationCircleOutlined /> ① 传统搜索 vs AI导购痛点对比
        </span>
      ),
      children: (
        <Row gutter={[12, 12]}>
          <Col xs={24} md={12}>
            <Card
              size="small"
              bordered
              style={{ background: 'rgba(244, 63, 94, 0.08)', borderColor: 'rgba(244, 63, 94, 0.25)' }}
            >
              <Text strong style={{ color: '#fb7185', display: 'block', marginBottom: 6 }}>
                ❌ 传统电商搜索 / 过滤筛选器的痛点
              </Text>
              <ul style={{ margin: 0, paddingLeft: 18, color: '#cbd5e1', fontSize: 12, lineHeight: 1.8 }}>
                <li>口语化场景隐喻（“夏天不闷”、“小耳道戴久了头疼”）无法转为“动圈/LHDC/分贝数”筛选条件</li>
                <li>多维条件过滤往往直接返回“0条结果”，或机械堆积上千款无关杂乱 SKU</li>
                <li>商品详情页无客观妥协点披露，消费者被迫刷评论区猜测是否压眼镜、是否夹头</li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card
              size="small"
              bordered
              style={{ background: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.25)' }}
            >
              <Text strong style={{ color: '#34d399', display: 'block', marginBottom: 6 }}>
                ✅ SoundMatch AI 导购破局能力
              </Text>
              <ul style={{ margin: 0, paddingLeft: 18, color: '#cbd5e1', fontSize: 12, lineHeight: 1.8 }}>
                <li>口语自动映射四维结构化画像（场景、属性、履约、预算），缺失槽位标为 unknown</li>
                <li>探需极度克制：最多追问 2 轮、必须带选项问、决策期信号直接下定论</li>
                <li>防幻觉确定性知识库：只推真实在库款，参数逐字溯源，坦诚告知选购妥协点</li>
              </ul>
            </Card>
          </Col>
        </Row>
      )
    },
    {
      key: 'scenes',
      label: (
        <span>
          <CompassOutlined /> ② 耳机核心六大场景
        </span>
      ),
      children: (
        <Row gutter={[10, 10]}>
          <Col xs={12} sm={8} lg={4}>
            <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
              <Text strong style={{ color: '#818cf8', display: 'block', fontSize: 12 }}>
                🚇 通勤 / 差旅
              </Text>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                ≥38dB深度降噪、抗风噪、环境声通透报站、轻便收纳
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={8} lg={4}>
            <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
              <Text strong style={{ color: '#818cf8', display: 'block', fontSize: 12 }}>
                💼 沉浸办公 / 会议
              </Text>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                多麦通话降噪、双设备无缝流转、长戴无压迫耳压
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={8} lg={4}>
            <Card size="small" style={{ color: '#818cf8', background: '#1e293b', borderColor: '#334155' }}>
              <Text strong style={{ color: '#818cf8', display: 'block', fontSize: 12 }}>
                🏃 运动 / 户外
              </Text>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                开放式/骨传导不塞耳、夜跑安全环境音、IPX4~IP68抗汗
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={8} lg={4}>
            <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
              <Text strong style={{ color: '#818cf8', display: 'block', fontSize: 12 }}>
                🎼 HiFi 发烧 / 监听
              </Text>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                无损高解析、宽阔自然大声场、中正调音零音染
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={8} lg={4}>
            <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
              <Text strong style={{ color: '#818cf8', display: 'block', fontSize: 12 }}>
                🎮 电竞低延迟
              </Text>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                2.4G无线&lt;20ms超低延迟、听声辨位、广播级降噪麦
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={8} lg={4}>
            <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
              <Text strong style={{ color: '#818cf8', display: 'block', fontSize: 12 }}>
                🎓 学生高性价比
              </Text>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                300元内越级双金标、超长续航50小时、丢失不心疼
              </div>
            </Card>
          </Col>
        </Row>
      )
    },
    {
      key: 'pipeline',
      label: (
        <span>
          <ApartmentOutlined /> ③ 三层架构与四步原理
        </span>
      ),
      children: (
        <Row gutter={[10, 10]}>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
              <Tag color="blue" style={{ marginBottom: 4 }}>Step 1: 需求解析</Tag>
              <div style={{ fontSize: 11, color: '#cbd5e1' }}>
                口语输入转译为四维画像 (场景、属性、履约、预算)，缺失项明确标 unknown
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
              <Tag color="purple" style={{ marginBottom: 4 }}>Step 2: 澄清决策</Tag>
              <div style={{ fontSize: 11, color: '#cbd5e1' }}>
                Master Agent + 双 Skill 并行；最多追问 2 轮、带选项、决策期信号直接停止
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
              <Tag color="cyan" style={{ marginBottom: 4 }}>Step 3: 召回打分</Tag>
              <div style={{ fontSize: 11, color: '#cbd5e1' }}>
                36款脱敏商品库硬过滤 + 软打分矩阵 (场景35分+预算25分+属性25分+履约15分)
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
              <Tag color="green" style={{ marginBottom: 4 }}>Step 4: 防幻觉生成</Tag>
              <div style={{ fontSize: 11, color: '#cbd5e1' }}>
                结论先行 1~2 款推荐，理由逐字锚定库内参数，坦诚告知选购妥协点
              </div>
            </Card>
          </Col>
        </Row>
      )
    },
    {
      key: 'criteria',
      label: (
        <span>
          <CheckCircleOutlined /> ④ 好回答四标准与0-3分标尺
        </span>
      ),
      children: (
        <Row gutter={[10, 10]}>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
              <Text strong style={{ color: '#34d399', display: 'block', fontSize: 12 }}>
                1. 切中核心 (1.0分)
              </Text>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                第一句结论先行，直接定性首选款与核心痛点化解能力，杜绝弯弯绕绕。
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
              <Text strong style={{ color: '#34d399', display: 'block', fontSize: 12 }}>
                2. 诉求全覆盖 (1.0分)
              </Text>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                回应四维画像中的预算、形态、降噪、重量与时效，发生冲突时给出平衡取舍建议。
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
              <Text strong style={{ color: '#34d399', display: 'block', fontSize: 12 }}>
                3. 可直接行动 (0.5分)
              </Text>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                客观告知选购妥协点 (Cons)，并给出明确决策动作建议与备选差异说明。
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small" style={{ background: '#1e293b', borderColor: '#334155' }}>
              <Text strong style={{ color: '#34d399', display: 'block', fontSize: 12 }}>
                4. 清晰有温度 (0.5分)
              </Text>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                结构化排版，参数逐字来自真实商品库，绝不捏造未收录特性，思考透明可信。
              </div>
            </Card>
          </Col>
        </Row>
      )
    }
  ];

  const collapseItems = [
    {
      key: 'methodology',
      label: (
        <Space size={8} align="center">
          <BulbOutlined style={{ color: '#818cf8' }} />
          <span style={{ fontWeight: 600, color: '#e2e8f0', fontSize: 12 }}>
            智能导购设计方法论：
          </span>
          <Tag color="gold" style={{ margin: 0 }}>① 痛点对比</Tag>
          <ArrowRightOutlined style={{ fontSize: 10, color: '#64748b' }} />
          <Tag color="blue" style={{ margin: 0 }}>② 六大场景</Tag>
          <ArrowRightOutlined style={{ fontSize: 10, color: '#64748b' }} />
          <Tag color="purple" style={{ margin: 0 }}>③ 四步原理</Tag>
          <ArrowRightOutlined style={{ fontSize: 10, color: '#64748b' }} />
          <Tag color="green" style={{ margin: 0 }}>④ 好回答四标准</Tag>
        </Space>
      ),
      children: <Tabs defaultActiveKey="pain" items={tabItems} size="small" />
    }
  ];

  return (
    <div style={{ background: '#090d16', borderBottom: '1px solid #1e293b' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '4px 16px' }}>
        <Collapse
          ghost
          defaultActiveKey={['methodology']}
          items={collapseItems}
          style={{ background: 'transparent' }}
        />
      </div>
    </div>
  );
};
