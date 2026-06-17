import axios from 'axios'
// 创建axios实例
const request = axios.create({
  baseURL: 'http://127.0.0.1:3300/api/travel',
  timeout: 180000,
  headers: {
    'Content-Type': 'application/json',
  },
})
// 请求拦截器
request.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 导出post方法
export function post(url, data) {
  return request.post(url, data)
}
// 导出get方法
export function get(url, params) {
  return request.get(url, { params })
}
// 导出流式响应方法
export async function fetchStream(url, data, onChunk, onComplete, onError) {
  // 创建一个AbortController实例，用于取消请求
  const controller = new AbortController()
  try {
    const response = await fetch(`http://127.0.0.1:3300/api/travel/${url}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    })
    // 创建一个可读流的读取器实例
    const reader = response.body.getReader()
    // 创建一个文本解码器实例，用于将二进制数据解码为文本
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      // 解码二进制数据为字符串
      const chunk = decoder.decode(value, { stream: true })
      // 按换行符和空格分隔字符串，过滤掉空行
      const lines = chunk.split('\n').filter((line) => line.trim())
      for (const line of lines) {
        try {
          //解析JSON字符串
          if (line.startsWith('data:')) {
            // 提取JSON字符串部分
            const jsonStr = line.substring(6)
            const jsonData = JSON.parse(jsonStr)
            if (jsonData.type === 'chunk') {
              onChunk(jsonData.content)
            } else if (jsonData.done) {
              onComplete(jsonData)
            } else if (jsonData.error) {
              onError(jsonData.error)
            }
          }
        } catch (error) {
          onError('流式数据解析异常')
        }
      }
    }
  } catch (error) {
    onError(error.message)
  }
}
