import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "蒲公英菜场 Dandelion Market" });
});

// AI Voice Intent Recognition Endpoint
app.post("/api/ai/intent", async (req, res) => {
  try {
    const { userText, userRole = "resident" } = req.body;
    if (!userText || typeof userText !== "string") {
      res.status(400).json({ error: "Missing userText string" });
      return;
    }

    const prompt = `
你是一个专为杭州大马弄“蒲公英菜场/微空间”打造的智能语音助手，具备高敏敏情绪感知与老龄化友好能力。
用户当前角色为：${userRole}
用户语音内容或文字请求："${userText}"

请分析用户的意图，并输出合法 JSON 数据：
1. "action": 意图标识，可选值: "RENT_STOOL", "NAVIGATE_TEA", "NAVIGATE_MARKET", "CULTURE_STORY", "TOGGLE_SENIOR", "VIEW_HEATMAP", "UNKNOWN"
2. "confidence": 置信度数值 (0.00 至 1.00 之间)。
   - 清楚明确的请求（如"我要租板凳"、"开启长辈模式"）可给 0.85-0.98；
   - 模糊有歧义的请求（如"找个地方"、"休息一下"）给 0.65-0.78；
   - 无法理解或嘈杂语句（如"嘈杂声"、"额……"）给 0.40-0.55。
3. "replyText": 用亲切温和、带有杭州水乡老街烟火气且简明扼要的语音回复语（30-60字）。长辈关心语气。
4. "targetTab": 推荐跳转页面, 可选: "home", "map", "stools", "cockpit", "credit"
5. "candidates": 当 confidence 在 0.60-0.80 之间时，提供 2-3 个澄清推测选项数组，每个项为 {"label": "...", "action": "...", "targetTab": "..."}。
6. "requiresConfirmation": boolean，若涉及资金支付、押金锁扣或敏感操作时为 true，否则 false。
7. "confirmationDetails": 若 requiresConfirmation 为 true，提供 {"title": "...", "deposit": "...", "item": "..."}。

请仅返回合法 JSON，无 Markdown 标签或额外说明。
`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    try {
      const parsed = JSON.parse(text);
      res.json({ success: true, data: parsed });
    } catch {
      res.json({
        success: true,
        data: {
          action: "RENT_STOOL",
          confidence: 0.9,
          replyText: `已收到您的需求：“${userText}”，已为您推荐离您最近的大马弄蒲公英共享板凳！`,
          targetTab: "stools",
          requiresConfirmation: true,
          confirmationDetails: {
            title: "微模块使用确认",
            deposit: "1 元 (信用分满600已免押)",
            item: "大马弄 01号 共享微模块",
          },
        },
      });
    }
  } catch (error: any) {
    console.error("AI Intent Error:", error);
    res.status(500).json({
      error: "AI service temporary error",
      details: error?.message || "Unknown error",
    });
  }
});

// AI Cultural Storytelling Endpoint
app.post("/api/ai/story", async (req, res) => {
  try {
    const { spotName = "大马弄" } = req.body;
    const prompt = `
你是一位熟悉杭州历史文化的“老大爷/老老街导游”，请为杭州著名老街【大马弄 - ${spotName}】撰写一段生动有趣、富有市井烟火气息与宋韵文化背景的语音导览讲解词（约150字）。
要求：
- 语言亲切生动，融合大马弄的传统美食（油炸鱼块、酱鸭、卷鸡、鲜肉爆鱼）与宋代皇城根下太庙文化。
- 解释“蒲公英共享板凳”如何让街区流动摊贩与午后茶客和谐流转。
`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({
      success: true,
      spotName,
      story: response.text || "大马弄坐落于南宋皇城根下，充满浓浓的杭州市井烟火气...",
    });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Failed to generate story" });
  }
});

// Start Express + Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`蒲公英菜场 Dandelion Market server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
