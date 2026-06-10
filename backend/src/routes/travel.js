import express from "express";
const router = express.Router();
// 推荐接口
router.post("/recommend", (req, res) => {
  res.json({ message: "推荐接口" });
});
// 聊天接口
router.post("/chat", (req, res) => {
  res.json({ message: "聊天接口" });
});
export default router;
