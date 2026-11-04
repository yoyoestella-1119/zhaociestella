/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ConfigProvider, theme as antdTheme, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { Header } from './components/Header';
import { PainPointsAndPrinciples } from './components/PainPointsAndPrinciples';
import { ChatSection } from './components/ChatSection';
import { VisualizerPanel } from './components/VisualizerPanel';
import { ProductCatalogModal } from './components/ProductCatalogModal';
import { BenchmarkModal } from './components/BenchmarkModal';
import { PrdDocModal } from './components/PrdDocModal';
import { UserProfileModal } from './components/UserProfileModal';
import { ComparisonModal } from './components/ComparisonModal';
import { ComparisonTray } from './components/ComparisonTray';
import {
  ChatMessage,
  RequirementProfile,
  ThinkingProcessTrace,
  InquiryOption,
  HeadphoneItem,
  UserProfile,
  RecommendationHistoryItem
} from './types';
import { processConversationTurn } from './engine/orchestrator';
import {
  getStoredUserProfile,
  saveStoredUserProfile,
  getStoredRecommendationHistory,
  saveRecommendationHistoryItem,
  clearStoredRecommendationHistory
} from './utils/storage';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [accumulatedProfile, setAccumulatedProfile] = useState<RequirementProfile | undefined>(undefined);
  const [turnCount, setTurnCount] = useState<number>(0);
  const [lastTurnWasInquiry, setLastTurnWasInquiry] = useState<boolean>(false);
  const [activeTrace, setActiveTrace] = useState<ThinkingProcessTrace | null>(null);
  const [activeTraceMsgId, setActiveTraceMsgId] = useState<string | undefined>(undefined);
  const [visualizerOpen, setVisualizerOpen] = useState<boolean>(true);
  const [useGeminiLive, setUseGeminiLive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // User Profile & Recommendation History System
  const [userProfile, setUserProfile] = useState<UserProfile>(getStoredUserProfile);
  const [history, setHistory] = useState<RecommendationHistoryItem[]>(getStoredRecommendationHistory);

  // Comparison System (Up to 3 items)
  const [comparisonItems, setComparisonItems] = useState<HeadphoneItem[]>([]);

  // Modals state
  const [isPrdOpen, setIsPrdOpen] = useState<boolean>(false);
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState<boolean>(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);

  // 初始化加载一个真实的开箱即用体验场景：夏天地铁通勤防闷 (千元内)
  useEffect(() => {
    const initialQuery = '夏天挤地铁通勤戴，要轻一点，耳朵容易出汗闷热，预算千元内。';
    const initTurn = processConversationTurn({
      userInput: initialQuery,
      turnCount: 0,
      lastTurnWasInquiry: false,
      userProfile
    });

    const userMsg: ChatMessage = {
      id: 'msg-init-user',
      role: 'user',
      content: initialQuery,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false })
    };

    setMessages([userMsg, initTurn]);
    setAccumulatedProfile(initTurn.thinkingTrace?.step1_parsing.profile);
    setActiveTrace(initTurn.thinkingTrace ?? null);
    setActiveTraceMsgId(initTurn.id);
    setTurnCount(1);
    setLastTurnWasInquiry(initTurn.thinkingTrace?.step2_strategy.strategyType === 'PROACTIVE_INQUIRY');

    // 预置 2 款至对比篮，方便用户一键体验横向对比
    if (initTurn.recommendedProducts && initTurn.recommendedProducts.length >= 2) {
      setComparisonItems(initTurn.recommendedProducts.slice(0, 2));
    }
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsgId = `msg-user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // 优先通过后端服务 /api/chat 处理，若离线则直接使用前端同构 orchestrator
      let assistantMsg: ChatMessage;

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userInput: text,
            turnCount,
            lastTurnWasInquiry,
            accumulatedProfile,
            userProfile,
            useGeminiLive
          })
        });

        if (response.ok) {
          assistantMsg = await response.json();
        } else {
          throw new Error('API server fallback to client engine');
        }
      } catch (networkOrApiErr) {
        // 前端同构内核平滑兜底
        assistantMsg = processConversationTurn({
          userInput: text,
          turnCount,
          lastTurnWasInquiry,
          accumulatedProfile,
          userProfile
        });
      }

      setMessages((prev) => [...prev, assistantMsg]);
      if (assistantMsg.thinkingTrace) {
        setActiveTrace(assistantMsg.thinkingTrace);
        setActiveTraceMsgId(assistantMsg.id);
        setAccumulatedProfile(assistantMsg.thinkingTrace.step1_parsing.profile);
        setTurnCount((prev) => prev + 1);
        setLastTurnWasInquiry(
          assistantMsg.thinkingTrace.step2_strategy.strategyType === 'PROACTIVE_INQUIRY'
        );
      }

      // 如果产生了推荐商品，自动归档至历史记录中
      if (assistantMsg.recommendedProducts && assistantMsg.recommendedProducts.length > 0) {
        const historyItem: RecommendationHistoryItem = {
          id: `hist-${Date.now()}`,
          timestamp: new Date().toLocaleString('zh-CN', { hour12: false }),
          query: text,
          primaryScene: assistantMsg.thinkingTrace?.step1_parsing.profile.scene.primary ?? 'unknown',
          recommendedProducts: assistantMsg.recommendedProducts,
          profileApplied: true
        };
        saveRecommendationHistoryItem(historyItem);
        setHistory((prev) => [historyItem, ...prev.filter((h) => h.id !== historyItem.id)].slice(0, 30));
      }
    } catch (err: any) {
      console.error('Chat handle error:', err);
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: '抱歉，当前处理请求出现异常，请重试或重置会话。',
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
        error: true
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (option: InquiryOption) => {
    handleSendMessage(option.actionValue);
  };

  const handleResetChat = () => {
    setMessages([]);
    setAccumulatedProfile(undefined);
    setTurnCount(0);
    setLastTurnWasInquiry(false);
    setActiveTrace(null);
    setActiveTraceMsgId(undefined);
  };

  const handleSelectTraceMessage = (msg: ChatMessage) => {
    if (msg.thinkingTrace) {
      setActiveTrace(msg.thinkingTrace);
      setActiveTraceMsgId(msg.id);
      setVisualizerOpen(true);
    }
  };

  const handleSelectProductForChat = (product: HeadphoneItem) => {
    handleSendMessage(`我想了解一下【${product.name}】，它主要适合我吗？有哪些核心优缺点？`);
  };

  // 对比篮操作 (至多3款)
  const handleToggleCompare = (product: HeadphoneItem) => {
    setComparisonItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        if (prev.length >= 3) {
          // 超过3款，替换最早的一款并添加新的一款
          return [...prev.slice(1), product];
        }
        return [...prev, product];
      }
    });
  };

  const handleRemoveCompareItem = (id: string) => {
    setComparisonItems((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearCompareAll = () => {
    setComparisonItems([]);
  };

  // 用户画像保存
  const handleSaveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    saveStoredUserProfile(newProfile);
  };

  // 清空历史记录
  const handleClearHistory = () => {
    clearStoredRecommendationHistory();
    setHistory([]);
  };

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: antdTheme.darkAlgorithm,
        token: {
          colorPrimary: '#6366f1',
          colorBgBase: '#020617',
          colorBgContainer: '#0b1120',
          colorBgElevated: '#111827',
          colorBorder: '#1e293b',
          colorBorderSecondary: '#1e293b',
          borderRadius: 8,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }
      }}
    >
      <AntdApp>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased relative">
          {/* Top Main Navigation Header */}
          <Header
            onOpenPrd={() => setIsPrdOpen(true)}
            onOpenBenchmark={() => setIsBenchmarkOpen(true)}
            onOpenCatalog={() => setIsCatalogOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenComparison={() => setIsComparisonOpen(true)}
            comparisonCount={comparisonItems.length}
            onResetChat={handleResetChat}
            visualizerOpen={visualizerOpen}
            onToggleVisualizer={() => setVisualizerOpen(!visualizerOpen)}
            useGeminiLive={useGeminiLive}
            onToggleGeminiLive={() => setUseGeminiLive(!useGeminiLive)}
          />

          {/* Pain Points & Principles Guide Bar */}
          <PainPointsAndPrinciples />

          {/* Main Content Workspace: Chat Section + Visualizer Inspector */}
          <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
            <ChatSection
              messages={messages}
              onSendMessage={handleSendMessage}
              onSelectOption={handleSelectOption}
              isLoading={isLoading}
              onSelectTraceMessage={handleSelectTraceMessage}
              activeTraceMsgId={activeTraceMsgId}
              onToggleCompare={handleToggleCompare}
              comparedProductIds={comparisonItems.map((c) => c.id)}
            />

            <VisualizerPanel
              trace={activeTrace}
              isOpen={visualizerOpen}
              onClose={() => setVisualizerOpen(false)}
            />
          </main>

          {/* Floating Comparison Tray (when items are selected) */}
          <ComparisonTray
            items={comparisonItems}
            onOpenComparison={() => setIsComparisonOpen(true)}
            onRemoveItem={handleRemoveCompareItem}
            onClearAll={handleClearCompareAll}
          />

          {/* Modals */}
          <ProductCatalogModal
            isOpen={isCatalogOpen}
            onClose={() => setIsCatalogOpen(false)}
            onSelectProductForChat={handleSelectProductForChat}
            onToggleCompare={handleToggleCompare}
            comparedProductIds={comparisonItems.map((c) => c.id)}
          />

          <BenchmarkModal
            isOpen={isBenchmarkOpen}
            onClose={() => setIsBenchmarkOpen(false)}
            onTestQueryInChat={(query) => handleSendMessage(query)}
          />

          <PrdDocModal
            isOpen={isPrdOpen}
            onClose={() => setIsPrdOpen(false)}
          />

          <UserProfileModal
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            userProfile={userProfile}
            onSaveProfile={handleSaveProfile}
            history={history}
            onClearHistory={handleClearHistory}
            onSelectQueryFromHistory={(q) => handleSendMessage(q)}
            onAddToCompare={handleToggleCompare}
            comparedIds={comparisonItems.map((c) => c.id)}
          />

          <ComparisonModal
            isOpen={isComparisonOpen}
            onClose={() => setIsComparisonOpen(false)}
            items={comparisonItems}
            onRemoveItem={handleRemoveCompareItem}
            onClearAll={handleClearCompareAll}
            onOpenCatalogToAdd={() => setIsCatalogOpen(true)}
          />
        </div>
      </AntdApp>
    </ConfigProvider>
  );
}
