<script setup>
import { ref } from 'vue'
import { fetchStream } from '../utils/request'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import ChatBubble from '../components/ChatBubble.vue'
const router = useRouter()
defineOptions({
  name: 'ChatView',
})

// 模拟消息列表
const messages = ref([])
// 快速问题
const quickQuestions = [
  '北京有哪些必去的景点？',
  '上海美食推荐',
  '成都三日游攻略',
  '如何选择旅行保险？',
]
// 返回上一页
const onBack = () => {
  router.back()
}
// 点击标签
const handleClickTag = (q) => {
  console.log(q)
}
// 输入框内容
const inputMessage = ref('')
// 是否正在流式响应
const isStreaming = ref(false)
// 添加用户消息
const addUserMessage = (content) => {
  messages.value.push({
    id: Date.now(),
    role: 'user',
    content,
    timestamp: new Date().toLocaleString(),
  })
}
// 发送消息
const sendMessage = () => {
  const msg = inputMessage.value.trim()
  if (!msg || isStreaming.value) {
    return
  }
  addUserMessage(msg)
  inputMessage.value = ''
  fetchAIResponse(msg)
}
// 获取AI响应
const fetchAIResponse = (userMag) => {
  isStreaming.value = true
  messages.value.push({
    id: Date.now(),
    role: 'ai',
    content: '',
    timestamp: new Date().toLocaleString(),
  })
  let fullResponse = ''
  fetchStream(
    'chat',
    { message: userMag },
    // 流式响应处理
    (chunk) => {
      fullResponse += chunk
      const lastMsg = messages.value[messages.value.length - 1]
      if (lastMsg && lastMsg.role === 'ai') {
        lastMsg.content = fullResponse
      }
    },
    // 流式响应结束
    () => {
      isStreaming.value = false
    },
    (errMsg) => {
      const lastMsg = messages.value[messages.value.length - 1]
      if (lastMsg && lastMsg.role === 'ai') {
        lastMsg.content = `抱歉，AI发送错误：${errMsg}`
      }
      isStreaming.value = false
      showToast('AI回复失败')
    },
  )
}
</script>
<template>
  <div class="page-container chat-page">
    <div class="page-header">
      <van-nav-bar title="AI旅游助手" fixed left-arrow left-text="返回" @click-left="onBack" />
    </div>
    <div class="chat-container">
      <div class="chat-empty" v-if="messages.length === 0">
        <van-empty description="开始和AI助手对话"></van-empty>
        <div class="quick-questions">
          <div class="quick-title">常见问题</div>
          <van-tag
            v-for="q in quickQuestions"
            :key="q"
            class="quick-tag"
            @click="handleClickTag(q)"
            size="large"
            mark
            >{{ q }}</van-tag
          >
        </div>
      </div>
      <div class="message-list" v-else>
        <ChatBubble v-for="msg in messages" :key="msg.id" :message="msg" />
        <div class="streaming-indicator" v-if="isStreaming">
          <van-loading type="spinner" size="20px" />
          <span>AI正在思考中...</span>
        </div>
      </div>
    </div>
    <div class="chat-input-area">
      <van-field
        v-model="inputMessage"
        placeholder="输入您的问题..."
        :disabled="isStreaming"
        @keyup.enter="sendMessage"
      >
        <template #button>
          <van-button
            type="primary"
            size="small"
            :disabled="!inputMessage.trim()"
            @click="sendMessage"
            >发送</van-button
          >
        </template>
      </van-field>
    </div>
  </div>
</template>
<style scoped>
.page-header {
  height: 46px;
}
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-bottom: 0px !important;
}

.chat-container {
  height: 650px;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 60px;
}

.chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.quick-questions {
  margin-top: 32px;
  text-align: center;
}

.quick-title {
  font-size: 14px;
  color: #999;
  margin-bottom: 16px;
}

.quick-tag {
  margin: 8px;
  cursor: pointer;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.streaming-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: #999;
  font-size: 14px;
}

.chat-input-area {
  position: fixed;
  bottom: 50px;
  left: 0;
  right: 0;
  background: #fff;
  padding: 8px 16px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  max-width: 750px;
  margin: 0 auto;
}

.chat-input-area :deep(.van-field) {
  background: #f7f8fa;
  border-radius: 20px;
  padding: 8px 16px;
}
</style>
