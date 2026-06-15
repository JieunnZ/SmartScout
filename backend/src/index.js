import express from "express";
import travelRouter from "./routes/travel.js";
import "dotenv/config.js";

const app = express();
const port = process.env.PORT;
// 解析请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/travel", travelRouter);
// 监听端口
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
