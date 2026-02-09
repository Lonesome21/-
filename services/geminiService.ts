
import { GoogleGenAI } from "@google/genai";
import { UserProfile } from "../types";

/**
 * 核心分析逻辑：使用 Gemini 3 Pro 深度思维模型
 */
export const analyzeProfile = async (profile: UserProfile): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  const prompt = `你是一位融合了八字命理、西洋星盘和现代心理学的全维大师。请分析：${JSON.stringify(profile)}。
  要求：返回纯JSON格式，包含scores(得分), bazi(八字细节), astro(星盘), psych(心理), advice(建议)。
  特别要求：八字部分要列出神煞、十神和刑冲合害关系。`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: { 
      // Using responseMimeType for structured output
      responseMimeType: 'application/json', 
      thinkingConfig: { thinkingBudget: 32768 } // 开启深度推理
    }
  });
  // Use .text property directly instead of .text()
  return response.text || "{}";
};

/**
 * 合盘分析：分析两位用户的契合度
 */
export const analyzeCompatibility = async (user1: UserProfile, user2: UserProfile): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  const prompt = `分析这两位用户的契合度：
  用户1: ${JSON.stringify(user1)}
  用户2: ${JSON.stringify(user2)}
  请从八字五行互补、星盘相位互动、MBTI认知功能互补三个维度深入分析。
  返回JSON格式，包含scores(各项得分), crossAnalysis(交叉分析), advice(相处建议)。`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: { 
      responseMimeType: 'application/json',
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  return response.text || "{}";
};

/**
 * 术语详解：点击神煞、十神或刑冲关系时调用
 */
export const explainTermDetail = async (term: string, category: string, context: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  const prompt = `请详细解释命理学术语"${term}"（类别：${category}）。
  背景：这是用户八字中的特征，用户日主为${context}。
  请说明：1.基础含义 2.对性格的影响 3.现实生活中的预示 4.如果是凶煞如何化解。
  字数：200字左右，语气专业且慈悲。`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
  });
  return response.text || "解析加载中...";
};

/**
 * 极速运势：首页组件使用
 */
export const getQuickDaily = async (profile: UserProfile): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  const prompt = `根据这个八字资料：${JSON.stringify(profile)}，给出一句充满智慧的今日运势简评（15字以内）。`;
  const response = await ai.models.generateContent({ 
    model: 'gemini-3-flash-preview', 
    contents: prompt 
  });
  return response.text || "顺应自然，静待花开。";
};

/**
 * 灵性对话：流式返回聊天响应
 */
export const getChatResponseStream = async (history: any[], message: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  const contents = [...history, { role: 'user', parts: [{ text: message }] }];
  
  return await ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: contents,
    config: {
      systemInstruction: '你是一位精通八字、占星与心理学的灵性向导。请为用户提供温暖、专业的咨询服务。',
    }
  });
};

/**
 * 视觉分析：面相或手相图片解读
 */
export const analyzeImage = async (base64Data: string, mode: 'FACE' | 'PALM'): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  const prompt = mode === 'FACE' 
    ? "请分析这张面相图片。结合中国传统面相学，简述其事业运、财运和性格特征。请保持专业且积极的语气。"
    : "请分析这张手相图片。结合中国传统手相学，识别生命线、智慧线、感情线，并给出简要解读。";

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
        { text: prompt }
      ]
    }
  });
  return response.text || "解析失败";
};

/**
 * 社区内容生成：处理话题生成与 AI 回复
 */
export const generateCommunityContent = async (type: 'TOPIC' | 'REPLY', content?: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  const prompt = type === 'TOPIC' 
    ? "请生成一个今日灵性社区讨论话题，关于MBTI、八字或占星的趣谈，20字以内。"
    : `请作为社区的灵性导师，温暖地回复这条帖子：'${content}'。字数50字以内。`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt 
  });
  return response.text || "";
};
