/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HEADPHONE_CATALOG } from '../data/headphoneCatalog';
import { HeadphoneItem } from '../types';
import {
  Modal,
  Input,
  Slider,
  Segmented,
  Card,
  Row,
  Col,
  Tag,
  Button,
  Space,
  Typography,
  Empty
} from 'antd';
import {
  SearchOutlined,
  DatabaseOutlined,
  SwapOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CarOutlined,
  SoundOutlined
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

interface ProductCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProductForChat?: (product: HeadphoneItem) => void;
  onToggleCompare?: (product: HeadphoneItem) => void;
  comparedProductIds?: string[];
}

export const ProductCatalogModal: React.FC<ProductCatalogModalProps> = ({
  isOpen,
  onClose,
  onSelectProductForChat,
  onToggleCompare,
  comparedProductIds = []
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [maxPrice, setMaxPrice] = useState<number>(4000);

  const categories = ['全部', '真无线入耳式', '头戴式降噪', '开放式/骨传导', '电竞游戏耳机', 'HiFi有线监听', '高性价比TWS'];

  const filtered = HEADPHONE_CATALOG.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.suitableScenes.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === '全部' || item.category === selectedCategory;
    const matchesPrice = item.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1100}
      title={
        <Space size={10} align="center">
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(56, 189, 248, 0.2)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16
            }}
          >
            <DatabaseOutlined />
          </div>
          <div>
            <Space size={8}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>
                脱敏耳机真实商品知识库
              </span>
              <Tag color="cyan">共 {HEADPHONE_CATALOG.length} 款真实SKU</Tag>
            </Space>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400 }}>
              所有推荐结论严密挂载此库，参数价格逐字溯源，杜绝编造不存在的虚假耳机与属性
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
        {/* Controls Bar: Search & Price Slider */}
        <Row gutter={[16, 12]} align="middle">
          <Col xs={24} md={12}>
            <Input
              prefix={<SearchOutlined style={{ color: '#64748b' }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索耳机名称、品牌或场景..."
              allowClear
              style={{ background: '#020617', borderColor: '#1e293b', color: '#f8fafc' }}
            />
          </Col>
          <Col xs={24} md={12}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-end' }}>
              <Text style={{ fontSize: 12, color: '#94a3b8', flexShrink: 0 }}>价格上限:</Text>
              <Slider
                min={100}
                max={4000}
                step={100}
                value={maxPrice}
                onChange={setMaxPrice}
                style={{ width: 180 }}
              />
              <Tag color="gold" style={{ fontSize: 12, fontWeight: 600 }}>
                ≤ ¥{maxPrice}
              </Tag>
            </div>
          </Col>
        </Row>

        {/* Category Segmented */}
        <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
          <Segmented
            options={categories}
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val as string)}
            style={{ background: '#020617' }}
          />
        </div>

        {/* Catalog Grid */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: 4 }}>
          <Row gutter={[12, 12]}>
            {filtered.map((item) => {
              const isCompared = comparedProductIds.includes(item.id);
              return (
                <Col xs={24} sm={12} lg={8} key={item.id}>
                  <Card
                    hoverable
                    size="small"
                    style={{ background: '#1e293b', borderColor: '#334155' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <Space size={4} wrap>
                        <Tag color="purple" style={{ margin: 0 }}>{item.brand}</Tag>
                        <Tag style={{ margin: 0, background: '#0f172a', borderColor: '#334155', color: '#94a3b8' }}>{item.formFactor}</Tag>
                        {item.deliveryTag && (
                          <Tag color="gold" style={{ margin: 0 }}>
                            <CarOutlined /> {item.deliveryTag}
                          </Tag>
                        )}
                      </Space>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#fbbf24' }}>
                        ¥{item.price}
                      </span>
                    </div>

                    <Paragraph strong style={{ color: '#f8fafc', fontSize: 13, marginBottom: 4, minHeight: 38 }} ellipsis={{ rows: 2 }}>
                      {item.name}
                    </Paragraph>

                    {/* Mini Spec Strip */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 4,
                        margin: '8px 0',
                        padding: '6px',
                        borderRadius: 6,
                        background: '#0f172a',
                        fontSize: 10,
                        color: '#cbd5e1'
                      }}
                    >
                      <div>降噪: <span style={{ color: '#38bdf8' }}>{item.ancDepthDb ? `${item.ancDepthDb}dB` : '无ANC'}</span></div>
                      <div>续航: <span style={{ color: '#34d399' }}>{item.batteryHours ? `${item.batteryHours}h` : '有线'}</span></div>
                      <div>重量: <span style={{ color: '#c084fc' }}>{item.weightG}g</span></div>
                    </div>

                    <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 10 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <Text strong style={{ color: '#cbd5e1' }}>声学：</Text>{item.soundSignature}
                      </div>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#6ee7b7' }}>
                        <CheckCircleOutlined /> {item.pros[0]}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8 }}>
                      {onToggleCompare && (
                        <Button
                          size="small"
                          type={isCompared ? 'primary' : 'default'}
                          icon={<SwapOutlined />}
                          onClick={() => onToggleCompare(item)}
                          style={
                            isCompared
                              ? { background: '#059669', borderColor: '#059669' }
                              : { background: '#0f172a', borderColor: '#334155', color: '#cbd5e1' }
                          }
                        >
                          {isCompared ? '已在对比' : '+对比'}
                        </Button>
                      )}

                      {onSelectProductForChat && (
                        <Button
                          size="small"
                          block
                          onClick={() => {
                            onSelectProductForChat(item);
                            onClose();
                          }}
                          style={{ background: '#0f172a', borderColor: '#334155', color: '#818cf8' }}
                        >
                          在导购中咨询
                        </Button>
                      )}
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {filtered.length === 0 && (
            <Empty description={<span style={{ color: '#64748b' }}>未找到匹配条件的耳机</span>} style={{ margin: '40px 0' }} />
          )}
        </div>
      </div>
    </Modal>
  );
};
