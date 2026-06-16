<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
const router = useRouter()
defineOptions({
  name: 'HomeView',
})
// 表单数据
const formData = ref({
  city: '',
  budget: null,
  days: null,
})
// 城市选择器是否显示
const showCityPicker = ref(false)
// 所有城市
// prettier-ignore
const allCities =[
  '北京', '上海', '广州', '深圳', '成都', '杭州', '西安', '重庆',
  '南京', '武汉', '苏州', '长沙', '天津', '郑州', '济南', '青岛',
  '大连', '沈阳', '哈尔滨', '长春', '福州', '厦门', '南昌', '合肥',
  '昆明', '贵阳', '南宁', '桂林', '海口', '三亚', '丽江', '大理',
  '西安', '兰州', '乌鲁木齐', '拉萨', '呼和浩特', '太原', '石家庄'
]
// 城市选择器数据
const cityColumns = allCities.map((city) => ({
  text: city,
  value: city,
}))
// 城市选择器确认回调
const handleCityConfirm = ({ selectedOptions }) => {
  formData.value.city = selectedOptions[0].value
  showCityPicker.value = false
}
// 加载状态
const isloading = ref(false)
// 提交表单
const handleSubmit = () => {
  isloading.value = true
  if (!formData.value.city) {
    showToast('请选择目的地')
    return
  }
  if (!formData.value.budget || formData.value.budget < 100) {
    showToast('预算不能小于100元')
    return
  }
  if (!formData.value.days || formData.value.days < 1 || formData.value.days > 30) {
    showToast('天数必须在1-30天之间')
    return
  }
  router.push({
    path: '/detail',
    query: {
      city: formData.value.city,
      budget: formData.value.budget,
      days: formData.value.days,
    },
  })
}
// 跳转页面
const goPage = (path) => {
  router.push(path)
}
// 热门目的地
const popularCities = ['北京', '上海', '广州', '深圳', '成都', '杭州', '西安', '重庆']
// 选择热门目的地
const selectedCity = (city) => {
  formData.value.city = city
}
</script>
<template>
  <div class="page-container">
    <div class="page-header">
      <van-nav-bar title="智能旅游助手" />
    </div>
    <div class="page-content">
      <van-notice-bar
        style="margin-bottom: 16px"
        left-icon="info-o"
        text="基于AI的智能景点介绍与行程规划系统"
      />
      <!-- 行程规划 -->
      <div class="card search-card">
        <div class="section-title">规划您的旅程</div>
        <van-field
          is-link
          readonly
          v-model="formData.city"
          @click="showCityPicker = true"
          label="目的地"
          placeholder="请选择城市"
          style="background-color: #f7f8fa; border-radius: 8px; margin-top: 12px"
        />
        <van-field
          type="number"
          v-model="formData.budget"
          label="预算(元)"
          placeholder="请输入预算金额"
          style="background-color: #f7f8fa; border-radius: 8px; margin-top: 12px"
          :border="false"
        />
        <van-field
          type="digit"
          v-model="formData.days"
          label="天数"
          placeholder="请输入天数"
          style="background-color: #f7f8fa; border-radius: 8px; margin-top: 12px"
          :border="false"
        />
        <van-button
          type="primary"
          size="large"
          round
          @click="handleSubmit"
          :loading="isloading"
          style="margin-top: 12px"
          >开始规划</van-button
        >
      </div>
      <!-- 快捷入口 -->
      <div class="card quick-action">
        <div class="section-title">快捷入口</div>
        <van-grid :gutter="12" :column-num="2">
          <van-grid-item icon="chat-o" @click="goPage('/chat')" text="AI对话" />
          <van-grid-item icon="user-o" @click="goPage('/profile')" text="我的" />
        </van-grid>
      </div>
      <!-- 热门目的地 -->
      <div class="card popular-destinations">
        <div class="section-title">热门目的地</div>
        <van-grid :gutter="6" :column-num="4">
          <van-grid-item
            v-for="(city, index) in popularCities"
            :key="index"
            @click="selectedCity(city)"
          >
            <div class="city-tag" :class="{ active: formData.city === city }">{{ city }}</div>
          </van-grid-item>
        </van-grid>
      </div>
    </div>
    <!-- 城市选择器 -->
    <van-popup v-model:show="showCityPicker" position="bottom" round>
      <van-picker
        :columns="cityColumns"
        @confirm="handleCityConfirm"
        @cancel="showCityPicker = false"
        title="请选择目的地"
      />
    </van-popup>
  </div>
</template>
<style scoped>
.search-card {
  margin-top: 16px;
}
.city-tag {
  padding: 8px 12px;
  border-radius: 16px;
  background: #f7f8fa;
  color: #666;
  font-size: 14px;
  transition: all 0.3s;
}
.city-tag.active {
  background: #007aff;
  color: #fff;
}
</style>
