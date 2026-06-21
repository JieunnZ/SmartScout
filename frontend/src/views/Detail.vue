<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { post } from '../utils/request'
import SpotItem from '../components/SpotItem.vue'
import BudgetTable from '../components/BudgetTable.vue'
const route = useRoute()
const router = useRouter()
defineOptions({
  name: 'DetailView',
})
// 表单数据
const formData = ref({
  city: '',
  budget: null,
  days: null,
})
// 返回
const onBack = () => {
  router.back()
}
// 加载状态
const isLoading = ref(true)
// 行程数据
const tripData = ref(null)
// 错误信息
const errorMsg = ref('')
// 活动天数
const activeDays = ref([])
// 调用后端接口获取行程数据
const fetchTripData = async () => {
  const res = await post('recommend', {
    city: formData.value.city,
    budget: formData.value.budget,
    days: formData.value.days,
  })
  isLoading.value = false
  // 处理响应数据
  if (res && res.success != false) {
    tripData.value = res
  } else {
    errorMsg.value = res.error
  }
}
// 咨询AI助手
const goToChat = () => {
  router.push({
    path: '/chat',
    query: {
      scene: 'detail',
      city: formData.value.city,
    },
  })
}
onMounted(() => {
  formData.value.city = route.query.city
  formData.value.budget = route.query.budget
  formData.value.days = route.query.days
  // 调用后端接口获取行程数据
  if (formData.value.city && formData.value.budget && formData.value.days) {
    fetchTripData()
  }
})
</script>
<template>
  <div class="page-container">
    <div class="page-header">
      <van-nav-bar
        left-arrow
        left-text="返回"
        @click-left="onBack"
        :title="formData.city + '行程规划'"
        fixed
      />
    </div>
    <div class="page-content">
      <div class="loading-container" v-if="isLoading">
        <van-loading size="48px" type="spinner">正在生成旅游规划...</van-loading>
      </div>
      <div v-else-if="errorMsg">
        <van-empty :description="errorMsg">
          <van-button type="primary" @click="fetchTripData">重试</van-button>
        </van-empty>
      </div>
      <template v-else-if="tripData && tripData.success !== false">
        <div class="card overview-card">
          <div class="trip-header">
            <h2>{{ tripData.city }} • {{ tripData.days }} 天行程</h2>
            <div class="trip-budget">预算：{{ tripData.totalBudget }}元</div>
          </div>
        </div>
        <!-- 行程计划 -->
        <van-collapse v-model="activeDays" class="trip-collapse">
          <van-collapse-item
            v-for="day in tripData.dailyItinerary"
            :key="day.day"
            :name="day.day"
            :title="'第' + day.day + '天'"
          >
            <div class="day-schedule">
              <div class="schedule-section">
                <div class="section-label morning">上午</div>
                <SpotItem :data="day.morning" />
              </div>
              <div class="schedule-section">
                <div class="section-label afternoon">下午</div>
                <SpotItem :data="day.afternoon" />
              </div>
              <div class="schedule-section">
                <div class="section-label evening">晚上</div>
                <SpotItem :data="day.evening" />
              </div>
            </div>
          </van-collapse-item>
        </van-collapse>
        <!-- 预算明细 -->
        <div class="card budget-card" v-if="tripData.budgetBreakdown">
          <div class="section-title">预算明细</div>
          <BudgetTable :data="tripData.budgetBreakdown" :total="tripData.totalBudget" />
        </div>
        <!-- 温馨提示 -->
        <div class="card tips-card" v-if="tripData.tips && tripData.tips.length">
          <div class="section-title">温馨提示</div>
          <ul class="tips-list">
            <li v-for="(tip, index) in tripData.tips" :key="index">{{ tip }}</li>
          </ul>
        </div>
        <!-- 注意事项 -->
        <div class="card warnings-card" v-if="tripData.warnings && tripData.warnings.length">
          <div class="section-title">注意事项</div>
          <ul class="warnings-list">
            <li v-for="(warning, index) in tripData.warnings" :key="index">{{ warning }}</li>
          </ul>
        </div>
      </template>
    </div>
    <div class="detail-footer" v-if="tripData && tripData.success !== false">
      <van-button type="primary" size="large" round class="primary-button" @click="goToChat"
        >咨询AI助手</van-button
      >
    </div>
  </div>
</template>
<style scoped>
.page-header {
  height: 46px;
}
.overview-card {
  margin-bottom: 16px;
}

.trip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trip-header h2 {
  font-size: 20px;
  color: #323233;
  margin: 0;
}

.trip-budget {
  font-size: 16px;
  color: #ee0a24;
  font-weight: 600;
}

.trip-collapse {
  margin-bottom: 16px;
}

.day-schedule {
  padding: 8px 0;
}

.schedule-section {
  margin-bottom: 16px;
}

.schedule-section:last-child {
  margin-bottom: 0;
}

.section-label {
  font-size: 14px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 8px;
}

.section-label.morning {
  background: #fff7e6;
  color: #fa8c16;
}

.section-label.afternoon {
  background: #e6f7ff;
  color: #1890ff;
}

.section-label.evening {
  background: #f6ffed;
  color: #52c41a;
}

.budget-card,
.tips-card,
.warnings-card {
  margin-bottom: 16px;
}

.tips-list,
.warnings-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li,
.warnings-list li {
  padding: 8px 0;
  color: #666;
  font-size: 14px;
  border-bottom: 1px solid #f5f5f5;
}

.tips-list li:last-child,
.warnings-list li:last-child {
  border-bottom: none;
}

.detail-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  max-width: 750px;
  margin: 0 auto;
}

.error-card {
  text-align: center;
  padding: 40px 16px;
}
</style>
