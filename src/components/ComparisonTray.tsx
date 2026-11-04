/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HeadphoneItem } from '../types';
import { Card, Space, Button, Tag, Typography, Tooltip } from 'antd';
import {
  SwapOutlined,
  DeleteOutlined,
  ArrowRightOutlined,
  CloseOutlined
} from '@ant-design/icons';

const { Text } = Typography;

interface ComparisonTrayProps {
  items: HeadphoneItem[];
  onOpenComparison: () => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
}

export const ComparisonTray: React.FC<ComparisonTrayProps> = ({
  items,
  onOpenComparison,
  onRemoveItem,
  onClearAll
}) => {
  if (items.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        width: '92%',
        maxWidth: 680
      }}
    >
      <Card
        size="small"
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          borderColor: '#6366f1',
          boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.6), 0 0 15px rgba(99, 102, 241, 0.3)',
          backdropFilter: 'blur(10px)',
          borderRadius: 16
        }}
        bodyStyle={{ padding: '8px 14px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          {/* Left items chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflowX: 'auto', flex: 1 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(99, 102, 241, 0.25)',
                color: '#818cf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                flexShrink: 0
              }}
            >
              <SwapOutlined />
            </div>

            <Text strong style={{ fontSize: 12, color: '#f8fafc', whiteSpace: 'nowrap' }}>
              对比篮 ({items.length}/3):
            </Text>

            <Space size={6} wrap={false} style={{ overflowX: 'auto' }}>
              {items.map((it) => (
                <div
                  key={it.id}
                  style={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: 8,
                    padding: '3px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 11,
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Text style={{ color: '#f8fafc', maxWidth: 100 }} ellipsis>
                    {it.name.split(' ')[0]} {it.brand}
                  </Text>
                  <Text strong style={{ color: '#fbbf24' }}>
                    ¥{it.price}
                  </Text>
                  <Button
                    type="text"
                    size="small"
                    icon={<CloseOutlined style={{ fontSize: 10 }} />}
                    onClick={() => onRemoveItem(it.id)}
                    style={{ padding: 0, height: 16, width: 16, color: '#94a3b8' }}
                  />
                </div>
              ))}
            </Space>
          </div>

          {/* Right Action buttons */}
          <Space size={8} align="center" style={{ flexShrink: 0 }}>
            <Tooltip title="清空对比篮">
              <Button
                size="small"
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={onClearAll}
              />
            </Tooltip>

            <Button
              type="primary"
              size="middle"
              icon={<ArrowRightOutlined />}
              onClick={onOpenComparison}
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                borderColor: 'transparent',
                fontWeight: 600,
                borderRadius: 10,
                fontSize: 12
              }}
            >
              开始横向对比 ({items.length})
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};
