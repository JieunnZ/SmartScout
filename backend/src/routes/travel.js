import express from "express";
import TravelService from "../services/travelService.js";
import { createStreamResponse } from "../utils/streamUtils.js";
const travelService = new TravelService();

const router = express.Router();
// 推荐路由
router.post("/recommend", async (req, res) => {
  const { city, budget, days } = req.body;
  if (!city || !budget || !days) {
    return res.status(400).json({
      success: false,
      message: "缺少必要参数city、budget、days",
    });
  }
  const result = await travelService.recommend(city, budget, days);
  return res.json(result);
});
// 聊天路由
router.post("/chat", async (req, res) => {
  const { message } = req.body;
  // 验证参数
  if (!message) {
    return res.status(400).json({
      success: false,
      error: "缺少必要参数message",
    });
  }
  // 创建流式响应
  const stream = createStreamResponse(res);
  const result = await travelService.chat(message, (chunk) => {
    stream.send({
      type: "chunk",
      content: chunk,
    });
  });
  stream.send({
    type: "complete",
    data: result,
  });
  stream.end();
});
export default router;
