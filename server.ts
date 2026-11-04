/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { processConversationTurn } from './src/engine/orchestrator';
import { HEADPHONE_CATALOG } from './src/data/headphoneCatalog';
import { BENCHMARK_TEST_SUITE, evaluateSingleTestCase } from './src/engine/benchmarkData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 3000;
const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');

let ai: GoogleGenAI | null = null;
if (hasGeminiKey) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// 1. 获取全量脱敏耳机商品库
app.get('/api/catalog', (_req: Request, res: Response) => {
  res.json({
    total: HEADPHONE_CATALOG.length,
    catalog: HEADPHONE_CATALOG
  });
});

// 2. 智能导购对话接口
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { userInput, turnCount, lastTurnWasInquiry, accumulatedProfile, userProfile, useGeminiLive } = req.body;

    if (!userInput || typeof userInput !== 'string') {
      return res.status(400).json({ error: 'userInput is required' });
    }

    // 运行三层确定性内核
    const localResult = processConversationTurn({
      userInput,
      turnCount: turnCount || 0,
      lastTurnWasInquiry: Boolean(lastTurnWasInquiry),
      accumulatedProfile,
      userProfile
    });

    // 如果开启了 Gemini Live API 且服务器配置了 Key，尝试调用 Gemini 3.8 Flash 进行润色，同时保留严格属性
    if (useGeminiLive && ai) {
      try {
        const prompt = `你是一名专业耳机品类智能导购专家。
商品库真实推荐款: ${JSON.stringify(localResult.recommendedProducts)}
当前用户意图四维画像: ${JSON.stringify(localResult.thinkingTrace?.step1_parsing.profile)}
策略判定: ${JSON.stringify(localResult.thinkingTrace?.step2_strategy)}
【好回答四标准】：
1. 切中核心：结论先行，第一句直出首选单品。
2. 诉求全覆盖：回应用户所有约束。
3. 可直接行动：列出真实客观妥协点(Cons)，给出明确行动。
4. 清晰有温度：真实参数锚定，杜绝虚构未收录属性。
请基于以上真实数据，输出专业亲切的回复（保持 Markdown 格式）：`;

        const geminiRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt
        });

        if (geminiRes.text) {
          localResult.content = geminiRes.text;
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local engine:', err);
      }
    }

    res.json(localResult);
  } catch (err: any) {
    console.error('Chat error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// 3. 运行评测集跑分
app.post('/api/benchmark/run', (_req: Request, res: Response) => {
  try {
    const results = BENCHMARK_TEST_SUITE.map(testCase => {
      const turnResult = processConversationTurn({
        userInput: testCase.inputQuery,
        turnCount: testCase.contextTurns ? testCase.contextTurns.length : 0,
        lastTurnWasInquiry: Boolean(testCase.contextTurns && testCase.contextTurns.length > 0)
      });

      const behavior = turnResult.thinkingTrace?.step2_strategy.strategyType || 'DIRECT_RECOMMENDATION';
      const isHallucinationFree = turnResult.thinkingTrace?.step4_generationAudit.passed ?? true;
      const recommended = (turnResult.recommendedProducts || []).map(p => ({
        name: p.name,
        price: p.price
      }));

      const evalScore = evaluateSingleTestCase(
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
        evaluation: evalScore
      };
    });

    const totalScore = results.reduce((acc, r) => acc + r.evaluation.score, 0);
    const maxPossible = results.length * 3;
    const passCount = results.filter(r => r.evaluation.passed).length;
    const avgScore = (totalScore / results.length).toFixed(2);
    const passRate = ((passCount / results.length) * 100).toFixed(1);

    res.json({
      totalCount: results.length,
      passCount,
      passRate: `${passRate}%`,
      avgScore,
      maxPossible,
      results
    });
  } catch (err: any) {
    console.error('Benchmark error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 4. 服务器健康状态
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey,
    catalogItemsCount: HEADPHONE_CATALOG.length,
    benchmarkItemsCount: BENCHMARK_TEST_SUITE.length
  });
});

// 开发模式挂载 Vite 中间件
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SoundMatch AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
