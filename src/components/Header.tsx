/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layout, Button, Space, Badge, Tag, Tooltip } from 'antd';
import {
  CustomerServiceOutlined,
  BookOutlined,
  TrophyOutlined,
  DatabaseOutlined,
  UserOutlined,
  SwapOutlined,
  ReloadOutlined,
  AppstoreOutlined,
  ThunderboltOutlined,
  ApiOutlined,
  FundOutlined
} from '@ant-design/icons';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  onOpenPrd: () => void;
  onOpenBenchmark: () => void;
  onOpenCatalog: () => void;
  onOpenProfile: () => void;
  onOpenComparison: () => void;
  comparisonCount: number;
  onOpenInvest?: () => void;
  onResetChat: () => void;
  visualizerOpen: boolean;
  onToggleVisualizer: () => void;
  useGeminiLive: boolean;
  onToggleGeminiLive: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPrd,
  onOpenBenchmark,
  onOpenCatalog,
  onOpenProfile,
  onOpenComparison,
  comparisonCount,
  onOpenInvest,
  onResetChat,
  visualizerOpen,
  onToggleVisualizer,
  useGeminiLive,
  onToggleGeminiLive
}) => {
  return (
    <AntHeader
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        height: 64,
        background: '#0f172a',
        borderBottom: '1px solid #1e293b',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      {/* Brand */}
      <Space size={12} align="center">
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 20
          }}
        >
          <CustomerServiceOutlined />
        </div>
        <div>
          <Space size={8} align="center">
            <span style={{ fontWeight: 700, fontSize: 17, color: '#f8fafc', letterSpacing: '-0.3px' }}>
              SoundMatch AI
            </span>
            <Tag color="purple" bordered={false} style={{ margin: 0, borderRadius: 12, fontSize: 11 }}>
              耳机品类智能导购
            </Tag>
          </Space>
          <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.2 }}>
            口语意图解析 • 克制探需 • 确定性商品库召回 • 0-3分评测体系
          </div>
        </div>
      </Space>

      {/* Action Buttons using Antd Button & Space */}
      <Space size={8} wrap>
        {/* Engine Switch */}
        <Tooltip title={useGeminiLive ? '已启用 Gemini 3.8 Flash 增强润色' : '使用内置确定性规则与打分引擎 (零延迟)'}>
          <Button
            size="middle"
            type={useGeminiLive ? 'primary' : 'default'}
            icon={useGeminiLive ? <ThunderboltOutlined /> : <ApiOutlined />}
            onClick={onToggleGeminiLive}
            style={
              useGeminiLive
                ? { background: '#7c3aed', borderColor: '#7c3aed' }
                : { background: '#1e293b', borderColor: '#334155', color: '#cbd5e1' }
            }
          >
            {useGeminiLive ? 'Gemini 3.8 Flash' : '内置确定性引擎'}
          </Button>
        </Tooltip>

        {/* Toggle Visualizer Inspector */}
        <Button
          size="middle"
          type={visualizerOpen ? 'primary' : 'default'}
          icon={<AppstoreOutlined />}
          onClick={onToggleVisualizer}
          style={
            visualizerOpen
              ? { background: '#4f46e5', borderColor: '#4f46e5' }
              : { background: '#1e293b', borderColor: '#334155', color: '#cbd5e1' }
          }
        >
          思考过程面板
        </Button>

        {/* User Profile */}
        <Button
          size="middle"
          icon={<UserOutlined />}
          onClick={onOpenProfile}
          style={{ background: '#1e293b', borderColor: '#334155', color: '#cbd5e1' }}
        >
          听音偏好画像
        </Button>

        {/* Side-by-Side Comparison */}
        <Badge count={comparisonCount} offset={[-4, 4]} color="#6366f1">
          <Button
            size="middle"
            icon={<SwapOutlined />}
            onClick={onOpenComparison}
            style={{ background: '#1e293b', borderColor: '#334155', color: '#cbd5e1' }}
          >
            耳机对比
          </Button>
        </Badge>

        {/* Catalog */}
        <Button
          size="middle"
          icon={<DatabaseOutlined />}
          onClick={onOpenCatalog}
          style={{ background: '#1e293b', borderColor: '#334155', color: '#cbd5e1' }}
        >
          商品库 (36款)
        </Button>

        {/* Benchmark */}
        <Button
          size="middle"
          icon={<TrophyOutlined style={{ color: '#eab308' }} />}
          onClick={onOpenBenchmark}
          style={{ background: '#1e293b', borderColor: '#334155', color: '#cbd5e1' }}
        >
          评测体系 (25+用例)
        </Button>

        {/* PRD Spec */}
        <Button
          size="middle"
          type="primary"
          icon={<BookOutlined />}
          onClick={onOpenPrd}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            borderColor: 'transparent',
            fontWeight: 500
          }}
        >
          产品说明 PRD
        </Button>

        {/* Invest Review (#invest) */}
        {onOpenInvest && (
          <Tooltip title="小红书协作/投资评审视角：商业化模式、单位经济学与动态 ROI 测算">
            <Button
              size="middle"
              icon={<FundOutlined style={{ color: '#34d399' }} />}
              onClick={onOpenInvest}
              style={{
                background: '#064e3b',
                borderColor: '#059669',
                color: '#ecfdf5',
                fontWeight: 600
              }}
            >
              投资评审 (#invest)
            </Button>
          </Tooltip>
        )}

        {/* Reset */}
        <Tooltip title="清空对话并重置画像">
          <Button
            size="middle"
            icon={<ReloadOutlined />}
            onClick={onResetChat}
            danger
            style={{ background: '#1e293b', borderColor: '#334155' }}
          />
        </Tooltip>
      </Space>
    </AntHeader>
  );
};
