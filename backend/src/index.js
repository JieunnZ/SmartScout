import express from "express";
import travelRouter from "./routes/travel.js";

const app = express();
const port = 3300;
app.use("/api/travel", travelRouter);
// 监听端口
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
