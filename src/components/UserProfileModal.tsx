/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile, RecommendationHistoryItem, FormFactor, PrimaryScene, HeadphoneItem } from '../types';
import { PROFILE_PRESETS } from '../utils/storage';
import {
  Modal,
  Tabs,
  Form,
  Select,
  Switch,
  InputNumber,
  Button,
  Tag,
  Card,
  Row,
  Col,
  Space,
  Typography,
  List,
  Alert,
  message
} from 'antd';
import {
  UserOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  HistoryOutlined,
  DeleteOutlined,
  SlidersOutlined,
  SwapOutlined,
  ArrowRightOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  history: RecommendationHistoryItem[];
  onClearHistory: () => void;
  onSelectQueryFromHistory?: (query: string) => void;
  onAddToCompare?: (item: HeadphoneItem) => void;
  comparedIds?: string[];
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  history,
  onClearHistory,
  onSelectQueryFromHistory,
  onAddToCompare,
  comparedIds = []
}) => {
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [profileForm, setProfileForm] = useState<UserProfile>({ ...userProfile });
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const handleSave = () => {
    onSaveProfile({
      ...profileForm,
      updatedAt: new Date().toISOString()
    });
    setSavedNotice(true);
    message.success('听音画像与体征偏好已保存！');
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const applyPreset = (presetProfile: Partial<UserProfile>) => {
    setProfileForm((prev) => ({
      ...prev,
      ...presetProfile,
      audioPreferences: {
        ...prev.audioPreferences,
        ...(presetProfile.audioPreferences || {})
      },
      comfortFeatures: {
        ...prev.comfortFeatures,
        ...(presetProfile.comfortFeatures || {})
      },
      budgetTier: {
        ...prev.budgetTier,
        ...(presetProfile.budgetTier || {})
      }
    }));
    message.info('已套用画像预设，点击保存即可生效！');
  };

  const toggleFormFactor = (ff: FormFactor) => {
    const existing = profileForm.comfortFeatures.preferredFormFactors;
    if (existing.includes(ff)) {
      setProfileForm({
        ...profileForm,
        comfortFeatures: {
          ...profileForm.comfortFeatures,
          preferredFormFactors: existing.filter((f) => f !== ff)
        }
      });
    } else {
      setProfileForm({
        ...profileForm,
        comfortFeatures: {
          ...profileForm.comfortFeatures,
          preferredFormFactors: [...existing, ff]
        }
      });
    }
  };

  const toggleScenario = (scene: PrimaryScene) => {
    const existing = profileForm.typicalScenarios;
    if (existing.includes(scene)) {
      setProfileForm({
        ...profileForm,
        typicalScenarios: existing.filter((s) => s !== scene)
      });
    } else {
      setProfileForm({
        ...profileForm,
        typicalScenarios: [...existing, scene]
      });
    }
  };

  const allScenes: PrimaryScene[] = [
    '通勤/差旅',
    '沉浸办公',
    '运动/户外',
    'HiFi发烧',
    '电竞游戏',
    '学生高性价比'
  ];

  const availableFormFactors: FormFactor[] = [
    '入耳式',
    '头戴罩耳',
    '半入耳式',
    '开放式/耳挂',
    '耳夹式',
    '骨传导',
    '有线大耳'
  ];

  const tabItems = [
    {
      key: 'profile',
      label: (
        <span>
          <SlidersOutlined /> 听音偏好与体征设置
        </span>
      ),
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Presets */}
          <div>
            <Text strong style={{ color: '#818cf8', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <ThunderboltOutlined style={{ color: '#eab308' }} />
              一键套用典型用户画像模板：
            </Text>
            <Row gutter={[8, 8]}>
              {PROFILE_PRESETS.map((preset, idx) => (
                <Col xs={12} sm={8} lg={4.8 as any} key={idx}>
                  <Card
                    hoverable
                    size="small"
                    onClick={() => applyPreset(preset.profile)}
                    style={{ background: '#1e293b', borderColor: '#334155' }}
                  >
                    <Text strong style={{ color: '#c084fc', fontSize: 11, display: 'block' }}>
                      {preset.name}
                    </Text>
                    <Text ellipsis style={{ color: '#64748b', fontSize: 10, display: 'block', marginTop: 2 }}>
                      {preset.description}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* Section 1: 舒适度与体征 */}
          <Card
            size="small"
            title={<span style={{ color: '#f8fafc', fontSize: 13 }}>1. 佩戴体征与舒适度特征 (Comfort Features)</span>}
            style={{ background: '#1e293b', borderColor: '#334155' }}
          >
            <Row gutter={[16, 16]}>
              {/* Glasses switch */}
              <Col xs={24} sm={12}>
                <Card size="small" style={{ background: '#0f172a', borderColor: '#334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong style={{ color: '#f8fafc', fontSize: 12, display: 'block' }}>
                        日常佩戴近视眼镜
                      </Text>
                      <Text style={{ fontSize: 10, color: '#64748b' }}>
                        头戴耳机将自动优选特制眼镜凹槽，杜绝压迫镜腿
                      </Text>
                    </div>
                    <Switch
                      checked={profileForm.comfortFeatures.wearsGlasses}
                      onChange={(checked) =>
                        setProfileForm({
                          ...profileForm,
                          comfortFeatures: {
                            ...profileForm.comfortFeatures,
                            wearsGlasses: checked
                          }
                        })
                      }
                    />
                  </div>
                </Card>
              </Col>

              {/* Ear canal sensitivity */}
              <Col xs={24} sm={12}>
                <Card size="small" style={{ background: '#0f172a', borderColor: '#334155' }}>
                  <Text strong style={{ color: '#f8fafc', fontSize: 12, display: 'block', marginBottom: 4 }}>
                    耳道生理类型与敏感度
                  </Text>
                  <Select
                    size="small"
                    style={{ width: '100%' }}
                    value={profileForm.comfortFeatures.earCanalSensitivity}
                    onChange={(val: any) =>
                      setProfileForm({
                        ...profileForm,
                        comfortFeatures: {
                          ...profileForm.comfortFeatures,
                          earCanalSensitivity: val
                        }
                      })
                    }
                    options={[
                      { value: 'normal', label: '正常耳道 (适应常规入耳与耳塞)' },
                      { value: 'sensitive', label: '耳道敏感 (久戴容易胀痛发痒，建议极轻或开放)' },
                      { value: 'small_canal', label: '小耳道人群 (常规耳塞易掉落胀痛，倾向小腔体)' },
                      { value: 'oily_ear', label: '油耳体质 (海绵套易脏，倾向开放透气硅胶套)' }
                    ]}
                  />
                </Card>
              </Col>
            </Row>

            {/* Preferred Form Factors */}
            <div style={{ marginTop: 12 }}>
              <Text style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                偏好的佩戴形态 (多选)：
              </Text>
              <Space wrap size={6}>
                {availableFormFactors.map((ff) => {
                  const selected = profileForm.comfortFeatures.preferredFormFactors.includes(ff);
                  return (
                    <Tag.CheckableTag
                      key={ff}
                      checked={selected}
                      onChange={() => toggleFormFactor(ff)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 11,
                        background: selected ? '#6366f1' : '#0f172a',
                        border: '1px solid #334155'
                      }}
                    >
                      {selected ? '✓ ' : ''}{ff}
                    </Tag.CheckableTag>
                  );
                })}
              </Space>
            </div>
          </Card>

          {/* Section 2: 声音品味与调音 */}
          <Card
            size="small"
            title={<span style={{ color: '#f8fafc', fontSize: 13 }}>2. 声音风格与音质品味 (Audio Preferences)</span>}
            style={{ background: '#1e293b', borderColor: '#334155' }}
          >
            <Row gutter={[16, 12]}>
              <Col xs={24} sm={12}>
                <Text style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>
                  偏好的声音调音走向：
                </Text>
                <Select
                  size="small"
                  style={{ width: '100%' }}
                  value={profileForm.audioPreferences.preferredSoundSignature}
                  onChange={(val: any) =>
                    setProfileForm({
                      ...profileForm,
                      audioPreferences: {
                        ...profileForm.audioPreferences,
                        preferredSoundSignature: val
                      }
                    })
                  }
                  options={[
                    { value: '三频均衡', label: '三频均衡杂食 (流行、播客、全能)' },
                    { value: '澎湃低音', label: '动感重低音 (嘻哈、电音、节奏感强)' },
                    { value: '通透人声女毒', label: '通透人声与女毒 (ACGN、民谣、细腻抓耳)' },
                    { value: '高保真中正监听', label: '高保真录音棚中正 (零音染、乐器还原)' },
                    { value: '开阔声场交响', label: '大声场脱箱感 (古典大编制、交响乐)' },
                    { value: 'default', label: '不限 / 随每次需求自适应' }
                  ]}
                />
              </Col>

              <Col xs={24} sm={12}>
                <Text style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>
                  日常降噪强度偏好：
                </Text>
                <Select
                  size="small"
                  style={{ width: '100%' }}
                  value={profileForm.audioPreferences.prefersAncDepth}
                  onChange={(val: any) =>
                    setProfileForm({
                      ...profileForm,
                      audioPreferences: {
                        ...profileForm.audioPreferences,
                        prefersAncDepth: val
                      }
                    })
                  }
                  options={[
                    { value: 'strong', label: '强力深度消噪 (≥38dB，强力压制交通低频)' },
                    { value: 'moderate', label: '舒适自适应 (低耳压感，自然不眩晕)' },
                    { value: 'unnecessary', label: '无需主动降噪 (崇尚开放自然环境音)' },
                    { value: 'default', label: '根据每次对话自适应' }
                  ]}
                />
              </Col>
            </Row>

            <div style={{ marginTop: 12, padding: '8px 12px', background: '#0f172a', borderRadius: 8, border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong style={{ color: '#f8fafc', fontSize: 12, display: 'block' }}>
                  优先要求 Hi-Res 无损高清传输 (LDAC / LHDC)
                </Text>
                <Text style={{ fontSize: 10, color: '#64748b' }}>
                  针对安卓设备或发烧播放器，优先推荐具备小金标认证与无损高码率的单品
                </Text>
              </div>
              <Switch
                checked={profileForm.audioPreferences.requiresHiResCodec}
                onChange={(checked) =>
                  setProfileForm({
                    ...profileForm,
                    audioPreferences: {
                      ...profileForm.audioPreferences,
                      requiresHiResCodec: checked
                    }
                  })
                }
              />
            </div>
          </Card>

          {/* Section 3: 高频场景与预算底色 */}
          <Card
            size="small"
            title={<span style={{ color: '#f8fafc', fontSize: 13 }}>3. 高频使用场景与默认预算 (Scenarios & Budget)</span>}
            style={{ background: '#1e293b', borderColor: '#334155' }}
          >
            <div style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                典型高频使用场景 (多选)：
              </Text>
              <Space wrap size={6}>
                {allScenes.map((sc) => {
                  const selected = profileForm.typicalScenarios.includes(sc);
                  return (
                    <Tag.CheckableTag
                      key={sc}
                      checked={selected}
                      onChange={() => toggleScenario(sc)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 11,
                        background: selected ? '#10b981' : '#0f172a',
                        border: '1px solid #334155'
                      }}
                    >
                      {selected ? '✓ ' : ''}{sc}
                    </Tag.CheckableTag>
                  );
                })}
              </Space>
            </div>

            <Row gutter={[16, 12]}>
              <Col xs={24} sm={12}>
                <Text style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>
                  未显式指定预算时的默认心理预算上限：
                </Text>
                <InputNumber
                  size="small"
                  style={{ width: '100%' }}
                  min={100}
                  max={5000}
                  step={100}
                  addonAfter="元"
                  value={profileForm.budgetTier.defaultMaxBudget}
                  onChange={(val) =>
                    setProfileForm({
                      ...profileForm,
                      budgetTier: {
                        ...profileForm.budgetTier,
                        defaultMaxBudget: val
                      }
                    })
                  }
                />
              </Col>
              <Col xs={24} sm={12}>
                <Text style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>
                  选购倾向优先级：
                </Text>
                <Select
                  size="small"
                  style={{ width: '100%' }}
                  value={profileForm.budgetTier.priority}
                  onChange={(val: any) =>
                    setProfileForm({
                      ...profileForm,
                      budgetTier: {
                        ...profileForm.budgetTier,
                        priority: val
                      }
                    })
                  }
                  options={[
                    { value: 'balanced', label: '均衡水桶 (兼顾音质降噪与价格)' },
                    { value: 'performance_first', label: '极致体验优先 (旗舰标杆，预算可上浮)' },
                    { value: 'cost_effective', label: '极致性价比优先 (少花钱办大事)' }
                  ]}
                />
              </Col>
            </Row>
          </Card>
        </div>
      )
    },
    {
      key: 'history',
      label: (
        <span>
          <HistoryOutlined /> 导购交互与推荐历史 ({history.length})
        </span>
      ),
      children: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#94a3b8' }}>
              记录您与 AI 助手的问答探索足迹与推荐耳机结果
            </Text>
            {history.length > 0 && (
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={onClearHistory}
              >
                清空历史记录
              </Button>
            )}
          </div>

          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
              暂无历史导购推荐记录。在主界面发起对话咨询，推荐单品将自动归档于此。
            </div>
          ) : (
            <div style={{ maxHeight: '55vh', overflowY: 'auto' }}>
              <List
                dataSource={history}
                renderItem={(item) => (
                  <Card
                    size="small"
                    style={{ background: '#1e293b', borderColor: '#334155', marginBottom: 8 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <Space size={6}>
                        <Tag style={{ margin: 0, background: '#020617', borderColor: '#334155', color: '#94a3b8' }}>{item.timestamp}</Tag>
                        <Tag color="purple" style={{ margin: 0 }}>{item.primaryScene}</Tag>
                      </Space>
                      {onSelectQueryFromHistory && (
                        <Button
                          type="link"
                          size="small"
                          icon={<ArrowRightOutlined />}
                          onClick={() => {
                            onSelectQueryFromHistory(item.query);
                            onClose();
                          }}
                          style={{ padding: 0 }}
                        >
                          再次咨询此需求
                        </Button>
                      )}
                    </div>

                    <Text strong style={{ color: '#f8fafc', fontSize: 13, display: 'block', marginBottom: 8 }}>
                      "{item.query}"
                    </Text>

                    {item.recommendedProducts && item.recommendedProducts.length > 0 && (
                      <div style={{ paddingTop: 6, borderTop: '1px solid #334155', display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                        <Text style={{ fontSize: 11, color: '#94a3b8' }}>当时推荐：</Text>
                        {item.recommendedProducts.map((p) => {
                          const isCompared = comparedIds.includes(p.id);
                          return (
                            <Space
                              key={p.id}
                              size={4}
                              style={{
                                background: '#0f172a',
                                padding: '2px 8px',
                                borderRadius: 6,
                                border: '1px solid #334155',
                                fontSize: 11
                              }}
                            >
                              <Text style={{ color: '#f8fafc' }}>{p.name.split(' ')[0]} {p.brand}</Text>
                              <Text strong style={{ color: '#fbbf24' }}>¥{p.price}</Text>
                              {onAddToCompare && (
                                <Button
                                  size="small"
                                  type="text"
                                  onClick={() => onAddToCompare(p)}
                                  style={{
                                    fontSize: 10,
                                    padding: '0 4px',
                                    height: 20,
                                    color: isCompared ? '#34d399' : '#818cf8'
                                  }}
                                >
                                  {isCompared ? '已在对比' : '+对比'}
                                </Button>
                              )}
                            </Space>
                          );
                        })}
                      </div>
                    )}
                  </Card>
                )}
              />
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={900}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 28 }}>
          <Space size={10} align="center">
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(168, 85, 247, 0.2)',
                color: '#c084fc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16
              }}
            >
              <UserOutlined />
            </div>
            <div>
              <Space size={8}>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>
                  用户听音偏好与专属画像中心
                </span>
                <Tag color="purple">User Profile & History</Tag>
              </Space>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 400 }}>
                保存您的体征与声音品味，AI 导购将在后续对话中持续自适应定制，避免重复追问
              </div>
            </div>
          </Space>

          {activeTab === 'profile' && (
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              style={{ background: '#6366f1', borderColor: '#6366f1' }}
            >
              保存画像设置
            </Button>
          )}
        </div>
      }
      styles={{
        body: { background: '#0f172a' },
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
