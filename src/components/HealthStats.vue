<!-- 健康统计卡片组件 -->
<template>
  <view class="health-stats">
    <view class="stat-card">
      <view class="stat-value">{{ BMI }}</view>
      <view class="stat-label">BMI指数</view>
    </view>
    <view class="stat-card">
      <view class="stat-value" :style="{ color: calorieIsStandard ? 'red' : '#4CAF50' }">
        {{ recommendedCalories }}
      </view>
      <view class="stat-label">今日推荐摄入(kcal)</view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  BMI: {
    type: String,
    default: '--'
  },
  recommendedCalories: {
    type: String,
    default: '--'
  },
  calorieIsStandard: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.health-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 15px;
}

.stat-card {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}
</style>
