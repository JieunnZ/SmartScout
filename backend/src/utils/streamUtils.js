// 创建流式响应
export const createStreamResponse = (res) => {
  // 设置响应头
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  return {
    // 发送数据
    send: (data) => {
      try {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      } catch (error) {
        console.error("流式发送错误:", error);
      }
    },
    // 结束流
    end: () => {
      try {
        res.write(`event: end\ndata:{"data":true}\n\n`);
        res.end();
      } catch (error) {
        console.error("流式发送失败:", error);
      }
    },
    // 发送错误信息
    error: (message) => {
      try {
        res.write(`data: ${JSON.stringify({ message })}\n\n`);
        res.end();
      } catch (error) {
        console.error("流式数据错误:", error);
      }
    },
  };
};
