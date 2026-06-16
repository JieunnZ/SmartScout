<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const active = ref(0)
</script>
<template>
  <div class="app-container">
    <router-view></router-view>
    <van-tabbar v-if="['Home', 'Chat', 'Profile'].includes(route.name)" router v-model="active">
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="chat-o" to="/chat">聊天</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<style scoped></style>
