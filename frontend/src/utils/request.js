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
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        if (buffer.trim()) {
          processLine(buffer)
        }
        break
      }
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      for (const line of lines) {
        processLine(line)
      }
    }
    controller.abort()
  } catch (error) {
    onError(error.message)
  }

  function processLine(line) {
    try {
      if (line.startsWith('data:')) {
        const jsonStr = line.substring(5).trim()
        const jsonData = JSON.parse(jsonStr)
        if (jsonData.type === 'chunk') {
          const text =
            typeof jsonData.content === 'object'
              ? jsonData.content.content || ''
              : jsonData.content || ''
          onChunk(text)
        } else if (jsonData.type === 'complete') {
          onComplete(jsonData.data)
        } else if (jsonData.error) {
          onError(jsonData.error)
        }
      }
    } catch (error) {
      onError('流式数据解析异常')
    }
  }
}
