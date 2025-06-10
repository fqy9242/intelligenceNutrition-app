<!-- 健康提醒卡片组件 -->
<template>
  <uni-card title="健康提醒" :padding="false" class="custom-card">
    <view class="card-content">
      <view class="suggestion-item">
        <text class="iconfont icon-bell" style="color: #4CAF50;"></text>
        <image src="@/static/icon/drinking.png" class="suggestion-icon" />
        <text class="suggestion-text">记得补充水分，今日已饮水{{ totalWaterIntake }}ml</text>
      </view>
      <view class="suggestion-item">
        <text class="iconfont icon-bell" style="color: #4CAF50;"></text>
        <image src="@/static/icon/checkIn.png" class="suggestion-icon" />
        <text class="suggestion-text">距离下次体检还有{{ nextCheckDay }}天</text>
      </view>
    </view>
  </uni-card>
</template>

<script setup>
defineProps({
  totalWaterIntake: {
    type: Number,
    default: 0
  },
  nextCheckDay: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.custom-card {
  margin-bottom: 15px;
  border-radius: 12px;
  overflow: hidden;
}

.card-content {
  padding: 0 10px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-icon {
  width: 24px;
  height: 24px;
  margin: 0 8px;
  flex-shrink: 0;
}

.suggestion-text {
  margin-left: 10px;
  font-size: 14px;
}
</style>
