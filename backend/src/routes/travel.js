import express from "express";
import TravelService from "../services/travelService.js";
const travelService = new TravelService();

const router = express.Router();
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
router.post("/chat", (req, res) => {
  res.json({ message: "聊天接口" });
});
export default router;
