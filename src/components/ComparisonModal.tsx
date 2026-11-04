/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HeadphoneItem } from '../types';
import {
  Modal,
  Card,
  Row,
  Col,
  Tag,
  Button,
  Space,
  Typography,
  Alert,
  Empty
} from 'antd';
import {
  SwapOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  PlusOutlined,
  BulbOutlined
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: HeadphoneItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onOpenCatalogToAdd?: () => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearAll,
  onOpenCatalogToAdd
}) => {
  // 计算极值用于高亮差异
  const minPrice = items.length > 0 ? Math.min(...items.map((i) => i.price)) : 0;
  const maxAncDb = items.length > 0 ? Math.max(...items.map((i) => i.ancDepthDb ?? 0)) : 0;
  const maxBattery = items.length > 0 ? Math.max(...items.map((i) => i.batteryHours)) : 0;
  const minWeight = items.length > 0 ? Math.min(...items.map((i) => i.weightG)) : 0;
  const minLatency = items.length > 0 ? Math.min(...items.map((i) => i.latencyMs)) : 0;

  const specRows = [
    {
      key: 'price',
      label: '💰 官方日常售价',
      render: (item: HeadphoneItem) => (
        <Space size={6}>
          <span style={{ fontSize: 16, fontWeight: 700, color: item.price === minPrice && items.length > 1 ? '#34d399' : '#fbbf24' }}>
            ¥{item.price}
          </span>
          {item.price === minPrice && items.length > 1 && (
            <Tag color="success">价格最低</Tag>
          )}
        </Space>
      )
    },
    {
      key: 'form',
      label: '🎧 佩戴形态与品类',
      render: (item: HeadphoneItem) => (
        <Space size={4}>
          <Text strong style={{ color: '#f8fafc' }}>{item.formFactor}</Text>
          <Text style={{ fontSize: 11, color: '#94a3b8' }}>({item.category})</Text>
        </Space>
      )
    },
    {
      key: 'weight',
      label: '⚖️ 重量与轻量化',
      render: (item: HeadphoneItem) => (
        <Space size={6}>
          <span style={{ fontWeight: 600, color: item.weightG === minWeight && items.length > 1 ? '#34d399' : '#e2e8f0' }}>
            {item.weightG}g
          </span>
          {item.weightG === minWeight && items.length > 1 && (
            <Tag color="success">最轻盈</Tag>
          )}
        </Space>
      )
    },
    {
      key: 'anc',
      label: '🔇 降噪深度 (ANC)',
      render: (item: HeadphoneItem) => (
        <div>
          {item.ancDepthDb ? (
            <Space size={6}>
              <span style={{ fontWeight: 700, color: item.ancDepthDb === maxAncDb && items.length > 1 ? '#38bdf8' : '#e2e8f0' }}>
                {item.ancDepthDb} dB
              </span>
              {item.ancDepthDb === maxAncDb && items.length > 1 && (
                <Tag color="cyan">降噪最强</Tag>
              )}
            </Space>
          ) : (
            <Text style={{ color: '#64748b' }}>无主动降噪 (开放式/被动)</Text>
          )}
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{item.ancMode}</div>
        </div>
      )
    },
    {
      key: 'battery',
      label: '🔋 标称播放续航',
      render: (item: HeadphoneItem) => (
        <div>
          <Space size={6}>
            <span style={{ fontWeight: 600, color: item.batteryHours === maxBattery && items.length > 1 ? '#34d399' : '#e2e8f0' }}>
              {item.batteryHours ? `${item.batteryHours}小时` : '有线直连无需充电'}
            </span>
            {item.batteryHours === maxBattery && items.length > 1 && (
              <Tag color="success">续航最长</Tag>
            )}
          </Space>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{item.batteryLife}</div>
        </div>
      )
    },
    {
      key: 'comfort',
      label: '☁️ 舒适度与体征适配',
      render: (item: HeadphoneItem) => (
        <span style={{ fontSize: 11, color: '#cbd5e1' }}>{item.comfortRating}</span>
      )
    },
    {
      key: 'sound',
      label: '🎼 调音风格与单元',
      render: (item: HeadphoneItem) => (
        <span style={{ fontSize: 11, color: '#cbd5e1' }}>{item.soundSignature}</span>
      )
    },
    {
      key: 'mic',
      label: '🎙️ 麦克风与通话',
      render: (item: HeadphoneItem) => (
        <span style={{ fontSize: 11, color: '#cbd5e1' }}>{item.micQuality}</span>
      )
    },
    {
      key: 'latency',
      label: '⚡ 游戏延迟表现',
      render: (item: HeadphoneItem) => (
        <Space size={6}>
          <span style={{ fontWeight: 600, color: item.latencyMs === minLatency && items.length > 1 ? '#a855f7' : '#e2e8f0' }}>
            {item.latencyMs} ms
          </span>
          {item.latencyMs <= 25 && (
            <Tag color="purple">电竞超低延迟</Tag>
          )}
        </Space>
      )
    },
    {
      key: 'waterproof',
      label: '💧 防水防尘等级',
      render: (item: HeadphoneItem) => (
        <Tag color="blue">{item.waterproof}</Tag>
      )
    },
    {
      key: 'scenes',
      label: '🎯 适配核心场景',
      render: (item: HeadphoneItem) => (
        <Space wrap size={4}>
          {item.suitableScenes.map((s, idx) => (
            <Tag key={idx} style={{ margin: 0, fontSize: 10, background: '#0f172a', borderColor: '#334155' }}>
              {s}
            </Tag>
          ))}
        </Space>
      )
    },
    {
      key: 'pros',
      label: '✨ 核心亮点优势',
      render: (item: HeadphoneItem) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 11, color: '#6ee7b7' }}>
          {item.pros.map((p, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircleOutlined /> {p}
            </div>
          ))}
        </div>
      )
    },
    {
      key: 'cons',
      label: '⚠️ 客观选购妥协点',
      render: (item: HeadphoneItem) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 11, color: '#94a3b8' }}>
          {item.cons.map((c, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <WarningOutlined style={{ color: '#fbbf24' }} /> {c}
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1100}
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
              <SwapOutlined />
            </div>
            <div>
              <Space size={8}>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>
                  耳机规格横向对比 (Side-by-Side Comparison)
                </span>
                <Tag color="purple">已选 {items.length}/3 款</Tag>
              </Space>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400 }}>
                差异化高亮核心参数，对比降噪、续航、重量与选购妥协点，助您快速决断
              </div>
            </div>
          </Space>

          {items.length > 0 && (
            <Button
              size="small"
              icon={<DeleteOutlined />}
              onClick={onClearAll}
              danger
            >
              清空对比
            </Button>
          )}
        </div>
      }
      styles={{
        body: { background: '#0f172a' },
        header: { background: '#0f172a', borderBottom: '1px solid #1e293b', paddingBottom: 12 }
      }}
    >
      <div style={{ padding: '12px 0 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {items.length === 0 ? (
          <Empty
            description={
              <span style={{ color: '#64748b', fontSize: 12 }}>
                尚未添加对比耳机。在导购卡片或商品库点击「+加入对比」，至多可同时选择 3 款耳机进行多维参数 PK。
              </span>
            }
            style={{ margin: '40px 0' }}
          >
            {onOpenCatalogToAdd && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  onClose();
                  onOpenCatalogToAdd();
                }}
              >
                前往商品库挑选
              </Button>
            )}
          </Empty>
        ) : (
          <>
            {/* Comparison Table Grid */}
            <div style={{ maxHeight: '58vh', overflowY: 'auto', border: '1px solid #1e293b', borderRadius: 10 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#0b1120', borderBottom: '1px solid #1e293b' }}>
                    <th style={{ padding: '12px 16px', width: 160, color: '#94a3b8', fontWeight: 600 }}>
                      对比维度
                    </th>
                    {items.map((item) => (
                      <th
                        key={item.id}
                        style={{
                          padding: '12px 16px',
                          borderLeft: '1px solid #1e293b',
                          background: '#0f172a',
                          verticalAlign: 'top',
                          minWidth: 240
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Tag color="purple">{item.brand}</Tag>
                          <Button
                            size="small"
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => onRemoveItem(item.id)}
                            title="移出对比"
                          />
                        </div>
                        <Text strong style={{ color: '#f8fafc', fontSize: 13, display: 'block', margin: '4px 0 6px' }}>
                          {item.name}
                        </Text>
                      </th>
                    ))}
                    {items.length < 3 && onOpenCatalogToAdd && (
                      <th style={{ padding: '12px 16px', borderLeft: '1px solid #1e293b', background: '#020617', textAlign: 'center', minWidth: 160 }}>
                        <Button
                          type="dashed"
                          icon={<PlusOutlined />}
                          onClick={() => {
                            onClose();
                            onOpenCatalogToAdd();
                          }}
                        >
                          添加第 {items.length + 1} 款对比
                        </Button>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {specRows.map((row, rIdx) => (
                    <tr
                      key={row.key}
                      style={{
                        background: rIdx % 2 === 0 ? '#0f172a' : '#0b1120',
                        borderBottom: '1px solid #1e293b'
                      }}
                    >
                      <td style={{ padding: '10px 16px', color: '#94a3b8', fontWeight: 500, background: '#090d16' }}>
                        {row.label}
                      </td>
                      {items.map((item) => (
                        <td
                          key={item.id}
                          style={{
                            padding: '10px 16px',
                            borderLeft: '1px solid #1e293b',
                            verticalAlign: 'middle'
                          }}
                        >
                          {row.render(item)}
                        </td>
                      ))}
                      {items.length < 3 && onOpenCatalogToAdd && (
                        <td style={{ borderLeft: '1px solid #1e293b', background: '#090d16' }} />
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* AI Verdict Box */}
            {items.length >= 2 && (
              <Alert
                message={
                  <Space size={6}>
                    <BulbOutlined style={{ color: '#818cf8' }} />
                    <span style={{ fontWeight: 600, color: '#e2e8f0' }}>
                      AI 导购终局决策建议 (How to Choose)：
                    </span>
                  </Space>
                }
                description={
                  <Row gutter={[12, 12]} style={{ marginTop: 8 }}>
                    {items.map((it) => (
                      <Col xs={24} md={items.length === 2 ? 12 : 8} key={it.id}>
                        <Card size="small" style={{ background: '#020617', borderColor: '#1e293b' }}>
                          <Text strong style={{ color: '#f8fafc', fontSize: 12, display: 'block', marginBottom: 2 }}>
                            👉 选 {it.name.split(' ')[0]} {it.brand} 如果您：
                          </Text>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>
                            看重【{it.pros[0]}】，主要用于【{it.suitableScenes[0]}】，且能接受【{it.cons[0]}】。
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                }
                type="info"
                style={{ background: '#1e293b', borderColor: '#334155' }}
              />
            )}
          </>
        )}
      </div>
    </Modal>
  );
};
