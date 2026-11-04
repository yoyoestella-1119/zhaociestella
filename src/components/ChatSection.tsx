/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  ChatMessage,
  HeadphoneItem,
  InquiryOption
} from '../types';
import {
  Card,
  Input,
  Button,
  Tag,
  Badge,
  Space,
  Typography,
  Row,
  Col,
  Spin,
  Empty,
  Tooltip
} from 'antd';
import {
  SendOutlined,
  CustomerServiceOutlined,
  UserOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  SwapOutlined,
  CarOutlined,
  EyeOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

interface ChatSectionProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onSelectOption: (option: InquiryOption) => void;
  isLoading: boolean;
  onSelectTraceMessage: (msg: ChatMessage) => void;
  activeTraceMsgId?: string;
  onToggleCompare?: (product: HeadphoneItem) => void;
  comparedProductIds?: string[];
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  messages,
  onSendMessage,
  onSelectOption,
  isLoading,
  onSelectTraceMessage,
  activeTraceMsgId,
  onToggleCompare,
  comparedProductIds = []
}) => {
  const [inputText, setInputText] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presetQueries = [
    { label: '🚇 夏天通勤防闷 (千元内)', query: '夏天挤地铁通勤戴，要轻一点，耳朵容易出汗闷热，预算千元内。' },
    { label: '💰 300元想要苹果降噪 (冲突引导)', query: '预算300块，想要苹果AirPods Pro那样的降噪和通透效果。' },
    { label: '👂 耳道小易发炎 (痛点决策)', query: '耳道很小容易发炎，以前戴入耳式半小时就胀痛头疼，求推荐通勤听播客的。' },
    { label: '⚡ 别问了直接推 (决策期信号)', query: '别问那么多了，1500以内直接给我一个闭眼买的降噪耳机，现在就下单。' },
    { label: '🏊 泳池游泳耳机 (极端防水IP68)', query: '有能戴着在泳池游泳的耳机吗？必须真能下水2米，还能存歌不带手机。' },
    { label: '🎮 CS2低延迟电竞 (硬核延迟)', query: '专门打CS2和瓦罗兰特，必须延迟在20ms以内，麦克风报点要超级清晰。' }
  ];

  const handleSend = () => {
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)',
        background: '#020617',
        overflow: 'hidden'
      }}
    >
      {/* Preset Quick Chips using Antd Space & Button */}
      <div
        style={{
          padding: '8px 16px',
          background: '#0b1120',
          borderBottom: '1px solid #1e293b',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}
      >
        <Space size={8} align="center">
          <Text style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
            <ThunderboltOutlined style={{ color: '#eab308' }} />
            六大预置场景直测:
          </Text>
          {presetQueries.map((item, idx) => (
            <Button
              key={idx}
              size="small"
              shape="round"
              onClick={() => onSendMessage(item.query)}
              disabled={isLoading}
              style={{
                fontSize: 11,
                background: '#1e293b',
                borderColor: '#334155',
                color: '#cbd5e1'
              }}
            >
              {item.label}
            </Button>
          ))}
        </Space>
      </div>

      {/* Messages Scroll Feed */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20
        }}
      >
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', margin: 'auto', maxWidth: 520, padding: '40px 0' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#fff',
                fontSize: 28,
                boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)'
              }}
            >
              <CustomerServiceOutlined />
            </div>
            <Typography.Title level={4} style={{ color: '#f8fafc', marginBottom: 8 }}>
              欢迎体验 SoundMatch AI 耳机导购助手
            </Typography.Title>
            <Paragraph style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7 }}>
              把口语化模糊需求精准转化为「四维结构化画像」；
              执行克制探需规则（最多追问 2 轮，带明确选项）；
              严选 36 款脱敏真实耳机，结论先行，拒绝造假与虚假参数！
            </Paragraph>

            <Row gutter={[10, 10]} style={{ marginTop: 24, textAlign: 'left' }}>
              {presetQueries.slice(0, 4).map((p, i) => (
                <Col span={12} key={i}>
                  <Card
                    hoverable
                    size="small"
                    onClick={() => onSendMessage(p.query)}
                    style={{ background: '#0f172a', borderColor: '#1e293b' }}
                  >
                    <Text strong style={{ color: '#818cf8', display: 'block', fontSize: 12 }}>
                      {p.label}
                    </Text>
                    <Text ellipsis style={{ color: '#64748b', fontSize: 11, display: 'block', marginTop: 4 }}>
                      "{p.query}"
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: isUser ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    gap: 12,
                    maxWidth: isUser ? '80%' : '88%'
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      flexShrink: 0,
                      background: isUser ? '#4f46e5' : 'rgba(168, 85, 247, 0.2)',
                      color: isUser ? '#fff' : '#c084fc',
                      border: isUser ? 'none' : '1px solid rgba(168, 85, 247, 0.3)'
                    }}
                  >
                    {isUser ? <UserOutlined /> : <CustomerServiceOutlined />}
                  </div>

                  {/* Bubble Content */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
                    <Card
                      size="small"
                      bordered={!isUser}
                      style={{
                        background: isUser ? '#4f46e5' : '#0f172a',
                        borderColor: isUser ? 'transparent' : '#1e293b',
                        color: isUser ? '#fff' : '#e2e8f0',
                        borderRadius: 14,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }}
                    >
                      <Paragraph
                        style={{
                          margin: 0,
                          fontSize: 13,
                          lineHeight: 1.7,
                          color: isUser ? '#fff' : '#e2e8f0',
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {msg.content}
                      </Paragraph>

                      {/* Guided Options (if inquiry turn) */}
                      {msg.options && msg.options.length > 0 && (
                        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #1e293b' }}>
                          <Text style={{ fontSize: 11, color: '#a5b4fc', display: 'block', marginBottom: 8 }}>
                            请选择最符合您偏好的选项（或直接文字回复）：
                          </Text>
                          <Row gutter={[8, 8]}>
                            {msg.options.map((opt) => (
                              <Col xs={24} sm={12} key={opt.id}>
                                <Button
                                  block
                                  onClick={() => onSelectOption(opt)}
                                  disabled={isLoading}
                                  style={{
                                    textAlign: 'left',
                                    fontSize: 12,
                                    background: '#1e293b',
                                    borderColor: '#334155',
                                    color: '#f8fafc',
                                    height: 'auto',
                                    padding: '6px 12px'
                                  }}
                                >
                                  {opt.label}
                                </Button>
                              </Col>
                            ))}
                          </Row>
                        </div>
                      )}
                    </Card>

                    {/* Recommended Product Cards Grid (using Ant Design Cards & Tags) */}
                    {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                      <div style={{ marginTop: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <Text strong style={{ fontSize: 12, color: '#818cf8' }}>
                            🎯 确定性商品库精准推荐 ({msg.recommendedProducts.length}款)
                          </Text>
                          <Tag color="success" style={{ margin: 0, fontSize: 10 }}>
                            100% 真实参数无虚构
                          </Tag>
                        </div>

                        <Row gutter={[12, 12]}>
                          {msg.recommendedProducts.map((prod, pIdx) => {
                            const isFirst = pIdx === 0;
                            const isCompared = comparedProductIds.includes(prod.id);
                            return (
                              <Col xs={24} lg={12} key={prod.id}>
                                <Card
                                  size="small"
                                  style={{
                                    background: '#0f172a',
                                    borderColor: isFirst ? '#6366f1' : '#1e293b',
                                    boxShadow: isFirst ? '0 0 15px rgba(99, 102, 241, 0.15)' : 'none'
                                  }}
                                >
                                  {/* Card Header */}
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                                    <div>
                                      <Space size={6} wrap>
                                        <Tag color={isFirst ? 'blue' : 'default'} style={{ margin: 0, fontWeight: 600 }}>
                                          {isFirst ? '首选推荐' : '备选对比'}
                                        </Tag>
                                        <Tag style={{ margin: 0, background: '#1e293b', borderColor: '#334155', color: '#94a3b8' }}>
                                          {prod.category}
                                        </Tag>
                                        {prod.deliveryTag && (
                                          <Tag color="gold" style={{ margin: 0 }}>
                                            <CarOutlined /> {prod.deliveryTag}
                                          </Tag>
                                        )}
                                      </Space>
                                      <Text strong style={{ display: 'block', color: '#f8fafc', fontSize: 13, marginTop: 4 }}>
                                        {prod.name}
                                      </Text>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                      <span style={{ fontSize: 16, fontWeight: 700, color: '#fbbf24' }}>
                                        ¥{prod.price}
                                      </span>
                                      <div style={{ fontSize: 10, color: '#64748b' }}>
                                        {prod.positiveRate} 好评
                                      </div>
                                    </div>
                                  </div>

                                  {/* Mini Specs Pill Grid */}
                                  <div
                                    style={{
                                      display: 'grid',
                                      gridTemplateColumns: 'repeat(3, 1fr)',
                                      gap: 6,
                                      margin: '10px 0',
                                      padding: '8px',
                                      borderRadius: 8,
                                      background: '#020617',
                                      fontSize: 11,
                                      color: '#cbd5e1'
                                    }}
                                  >
                                    <div>
                                      降噪: <span style={{ color: '#38bdf8', fontWeight: 600 }}>{prod.ancDepthDb ? `${prod.ancDepthDb}dB` : '开放音'}</span>
                                    </div>
                                    <div>
                                      续航: <span style={{ color: '#34d399', fontWeight: 600 }}>{prod.batteryHours ? `${prod.batteryHours}h` : '有线'}</span>
                                    </div>
                                    <div>
                                      重量: <span style={{ color: '#c084fc', fontWeight: 600 }}>{prod.weightG}g</span>
                                    </div>
                                  </div>

                                  {/* Pros & Cons */}
                                  <div style={{ fontSize: 11, display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <div style={{ color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: 4 }}>
                                      <CheckCircleOutlined />
                                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {prod.pros[0]}
                                      </span>
                                    </div>
                                    {prod.cons.length > 0 && (
                                      <div style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <WarningOutlined style={{ color: '#fbbf24' }} />
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                          妥协点：{prod.cons[0]}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Action Bar */}
                                  <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 10, color: '#64748b' }}>
                                      {prod.salesVolume}
                                    </span>
                                    {onToggleCompare && (
                                      <Button
                                        size="small"
                                        type={isCompared ? 'primary' : 'default'}
                                        icon={<SwapOutlined />}
                                        onClick={() => onToggleCompare(prod)}
                                        style={
                                          isCompared
                                            ? { background: '#059669', borderColor: '#059669' }
                                            : { background: '#1e293b', borderColor: '#334155', color: '#cbd5e1' }
                                        }
                                      >
                                        {isCompared ? '已在对比中' : '+加入对比'}
                                      </Button>
                                    )}
                                  </div>
                                </Card>
                              </Col>
                            );
                          })}
                        </Row>
                      </div>
                    )}

                    {/* Inspector Action Link Button */}
                    {msg.thinkingTrace && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Button
                          size="small"
                          type={activeTraceMsgId === msg.id ? 'primary' : 'dashed'}
                          icon={<EyeOutlined />}
                          onClick={() => onSelectTraceMessage(msg)}
                          style={{
                            fontSize: 11,
                            background: activeTraceMsgId === msg.id ? '#4f46e5' : '#0f172a',
                            borderColor: activeTraceMsgId === msg.id ? '#4f46e5' : '#334155',
                            color: activeTraceMsgId === msg.id ? '#fff' : '#94a3b8'
                          }}
                        >
                          查看该轮 AI 思考与结构化 JSON
                        </Button>
                        <span style={{ fontSize: 10, color: '#64748b' }}>
                          {msg.timestamp}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
            <Spin size="small" />
            <Text style={{ fontSize: 12, color: '#94a3b8' }}>
              正在解析四维画像并检索商品库...
            </Text>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar using Ant Design TextArea & Button */}
      <div
        style={{
          padding: '12px 16px',
          background: '#0b1120',
          borderTop: '1px solid #1e293b'
        }}
      >
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <TextArea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="请输入您的模糊耳机需求（例如：平时挤地铁听播客，耳朵容易出汗闷热，预算千元内...）"
              autoSize={{ minRows: 2, maxRows: 4 }}
              style={{
                background: '#020617',
                borderColor: '#1e293b',
                color: '#f8fafc',
                borderRadius: 10,
                fontSize: 13
              }}
            />
          </div>

          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            style={{
              height: 52,
              padding: '0 20px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderColor: 'transparent',
              fontWeight: 500
            }}
          >
            发送需求
          </Button>
        </div>
      </div>
    </div>
  );
};
