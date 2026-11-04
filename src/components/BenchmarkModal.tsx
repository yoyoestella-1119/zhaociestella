/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BENCHMARK_TEST_SUITE, evaluateSingleTestCase } from '../engine/benchmarkData';
import { processConversationTurn } from '../engine/orchestrator';
import { BenchmarkTestCase } from '../types';
import {
  Modal,
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Segmented,
  Collapse,
  Tag,
  Button,
  Space,
  Typography,
  Alert
} from 'antd';
import {
  TrophyOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

interface BenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestQueryInChat?: (query: string) => void;
}

export const BenchmarkModal: React.FC<BenchmarkModalProps> = ({
  isOpen,
  onClose,
  onTestQueryInChat
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [evalResults, setEvalResults] = useState<any[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');

  const categories = ['全部', '模糊多义', '预算冲突', '痛点决策', '决策收敛信号', '极端冷门', '多轮探需克制'];

  const handleRunEvaluation = async () => {
    setIsRunning(true);
    setTimeout(() => {
      const results = BENCHMARK_TEST_SUITE.map((testCase) => {
        const turnResult = processConversationTurn({
          userInput: testCase.inputQuery,
          turnCount: testCase.contextTurns ? testCase.contextTurns.length : 0,
          lastTurnWasInquiry: Boolean(testCase.contextTurns && testCase.contextTurns.length > 0)
        });

        const behavior =
          turnResult.thinkingTrace?.step2_strategy.strategyType || 'DIRECT_RECOMMENDATION';
        const isHallucinationFree =
          turnResult.thinkingTrace?.step4_generationAudit.passed ?? true;
        const recommended = (turnResult.recommendedProducts || []).map((p) => ({
          name: p.name,
          price: p.price
        }));

        const evaluation = evaluateSingleTestCase(
          testCase,
          turnResult.content,
          behavior,
          recommended,
          isHallucinationFree
        );

        return {
          testCase,
          reply: turnResult.content,
          thinkingTrace: turnResult.thinkingTrace,
          evaluation
        };
      });

      setEvalResults(results);
      setIsRunning(false);
    }, 400);
  };

  const totalCases = BENCHMARK_TEST_SUITE.length;
  const evaluatedCount = evalResults?.length ?? 0;
  const passCount = evalResults?.filter((r) => r.evaluation.passed).length ?? 0;
  const passRate = evaluatedCount ? ((passCount / evaluatedCount) * 100).toFixed(1) : '--';
  const totalScoreSum = evalResults?.reduce((acc, r) => acc + r.evaluation.score, 0) ?? 0;
  const avgScore = evaluatedCount ? (totalScoreSum / evaluatedCount).toFixed(2) : '--';

  const score3Count = evalResults?.filter((r) => r.evaluation.score === 3).length ?? 0;
  const score2Count = evalResults?.filter((r) => r.evaluation.score === 2).length ?? 0;
  const score1Count = evalResults?.filter((r) => r.evaluation.score === 1).length ?? 0;
  const score0Count = evalResults?.filter((r) => r.evaluation.score === 0).length ?? 0;

  const filteredList = (evalResults || BENCHMARK_TEST_SUITE.map((tc) => ({ testCase: tc }))).filter(
    (item: any) => selectedCategory === '全部' || item.testCase.category === selectedCategory
  );

  const collapseItems = filteredList.map((item: any, idx: number) => {
    const tc: BenchmarkTestCase = item.testCase;
    const res = item.evaluation;
    const reply = item.reply;

    return {
      key: tc.id,
      label: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingRight: 8 }}>
          <Space size={8}>
            <Tag style={{ margin: 0, background: '#020617', borderColor: '#334155', color: '#94a3b8' }}>#{idx + 1}</Tag>
            <Tag color="purple" style={{ margin: 0 }}>{tc.category}</Tag>
            <Text strong style={{ color: '#f8fafc', fontSize: 13 }}>"{tc.inputQuery}"</Text>
          </Space>
          <div>
            {res ? (
              <Tag color={res.score === 3 ? 'success' : res.score === 2 ? 'processing' : 'warning'} style={{ fontWeight: 600 }}>
                {res.score} / 3分 {res.passed ? '✓ 合格' : '✗ 偏离'}
              </Tag>
            ) : (
              <Tag color="default">待跑分</Tag>
            )}
          </div>
        </div>
      ),
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
          <Row gutter={[12, 12]}>
            <Col xs={24} md={12}>
              <Card size="small" style={{ background: '#020617', borderColor: '#1e293b' }}>
                <Text strong style={{ color: '#94a3b8', display: 'block', marginBottom: 4 }}>
                  🎯 黄金评分标尺与期望行为：
                </Text>
                <div style={{ fontSize: 11, color: '#cbd5e1', lineHeight: 1.6 }}>
                  <div>• 切中核心 (1.0分): {tc.scoringRubric.relevance}</div>
                  <div>• 诉求全覆盖 (1.0分): {tc.scoringRubric.completeness}</div>
                  <div>• 可直接行动 (0.5分): {tc.scoringRubric.actionability}</div>
                  <div>• 清晰有温度与无幻觉 (0.5分): {tc.scoringRubric.toneAndGrounding}</div>
                </div>
              </Card>
            </Col>

            {res && (
              <Col xs={24} md={12}>
                <Card size="small" style={{ background: '#020617', borderColor: '#1e293b' }}>
                  <Text strong style={{ color: '#34d399', display: 'block', marginBottom: 4 }}>
                    📊 本次实测四个维度评分明细：
                  </Text>
                  <div style={{ fontSize: 11, color: '#cbd5e1', lineHeight: 1.6 }}>
                    <div>• 切中核心: {res.dimensions.relevance.score} / 1.0 ({res.dimensions.relevance.comment})</div>
                    <div>• 诉求全覆盖: {res.dimensions.completeness.score} / 1.0 ({res.dimensions.completeness.comment})</div>
                    <div>• 可直接行动: {res.dimensions.actionability.score} / 0.5 ({res.dimensions.actionability.comment})</div>
                    <div>• 清晰有温度: {res.dimensions.toneAndGrounding.score} / 0.5 ({res.dimensions.toneAndGrounding.comment})</div>
                  </div>
                </Card>
              </Col>
            )}
          </Row>

          {reply && (
            <Card size="small" style={{ background: '#020617', borderColor: '#1e293b' }}>
              <Text strong style={{ color: '#818cf8', display: 'block', marginBottom: 4 }}>
                💬 实际导购输出回复内容：
              </Text>
              <Paragraph style={{ margin: 0, color: '#e2e8f0', fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {reply}
              </Paragraph>
            </Card>
          )}

          {onTestQueryInChat && (
            <div style={{ textAlign: 'right' }}>
              <Button
                size="small"
                type="primary"
                icon={<ArrowRightOutlined />}
                onClick={() => {
                  onTestQueryInChat(tc.inputQuery);
                  onClose();
                }}
              >
                在主界面中真实测试此 Query
              </Button>
            </div>
          )}
        </div>
      )
    };
  });

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1000}
      title={
        <Space size={10} align="center">
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(234, 179, 8, 0.2)',
              color: '#eab308',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16
            }}
          >
            <TrophyOutlined />
          </div>
          <div>
            <Space size={8}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>
                0-3 分评测体系与 Benchmark 测试集
              </span>
              <Tag color="gold">{totalCases} 条覆盖全场景用例</Tag>
            </Space>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400 }}>
              好回答四标准自动化验收：切中核心(1.0) • 诉求全覆盖(1.0) • 可直接行动(0.5) • 清晰有温度(0.5)
            </div>
          </div>
        </Space>
      }
      styles={{
        body: { background: '#0f172a' },
        header: { background: '#0f172a', borderBottom: '1px solid #1e293b', paddingBottom: 12 }
      }}
    >
      <div style={{ padding: '12px 0 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Statistics Cards Row */}
        <Row gutter={[12, 12]}>
          <Col xs={12} sm={6}>
            <Card size="small" style={{ background: '#1e293b', borderColor: '#334155', textAlign: 'center' }}>
              <Statistic title={<span style={{ color: '#94a3b8', fontSize: 11 }}>测试用例总量</span>} value={totalCases} valueStyle={{ color: '#f8fafc', fontWeight: 700, fontSize: 18 }} suffix="条" />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small" style={{ background: '#1e293b', borderColor: '#334155', textAlign: 'center' }}>
              <Statistic title={<span style={{ color: '#94a3b8', fontSize: 11 }}>平均评测得分</span>} value={avgScore} valueStyle={{ color: '#eab308', fontWeight: 700, fontSize: 18 }} suffix="/ 3.0" />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small" style={{ background: '#1e293b', borderColor: '#334155', textAlign: 'center' }}>
              <Statistic title={<span style={{ color: '#94a3b8', fontSize: 11 }}>合格通过率 (≥2分)</span>} value={passRate} valueStyle={{ color: '#10b981', fontWeight: 700, fontSize: 18 }} suffix="%" />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small" style={{ background: '#1e293b', borderColor: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Button
                type="primary"
                block
                icon={isRunning ? <ReloadOutlined spin /> : <PlayCircleOutlined />}
                onClick={handleRunEvaluation}
                disabled={isRunning}
                style={{ height: 42, background: 'linear-gradient(135deg, #eab308 0%, #6366f1 100%)', borderColor: 'transparent' }}
              >
                {evalResults ? '重新全量跑分' : '一键启动全量跑分'}
              </Button>
            </Card>
          </Col>
        </Row>

        {/* Score Distribution Alert */}
        {evalResults && (
          <Alert
            type="info"
            message={
              <Space size={16} wrap style={{ fontSize: 11 }}>
                <span>得分分布：</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>● 3分优秀: {score3Count}</span>
                <span style={{ color: '#38bdf8', fontWeight: 600 }}>● 2分良好: {score2Count}</span>
                <span style={{ color: '#fbbf24', fontWeight: 600 }}>● 1分及格: {score1Count}</span>
                <span style={{ color: '#f87171', fontWeight: 600 }}>● 0分幻觉: {score0Count}</span>
              </Space>
            }
            style={{ background: '#020617', borderColor: '#1e293b' }}
          />
        )}

        {/* Category Segmented */}
        <div style={{ overflowX: 'auto' }}>
          <Segmented
            options={categories}
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val as string)}
            style={{ background: '#020617' }}
          />
        </div>

        {/* Test Case Collapse List */}
        <div style={{ maxHeight: '55vh', overflowY: 'auto' }}>
          <Collapse
            accordion
            items={collapseItems}
            style={{ background: '#1e293b', borderColor: '#334155' }}
          />
        </div>
      </div>
    </Modal>
  );
};
