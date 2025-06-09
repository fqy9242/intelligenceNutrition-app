<!-- 饮水记录卡片组件 -->
<template>
  <uni-card title="今日饮水" :padding="false" class="custom-card">
    <view class="card-content">
      <view v-for="(record, index) in records" :key="index" class="dish-item">
        <view class="dish-info">
          <view class="dish-title">饮水</view>
          <view class="dish-desc">{{ record.capacity }}</view>
          <view class="dish-desc">{{ formatTimeOnly(record.drinkingTime) }}</view>
        </view>
      </view>
      <view class="btn-container">
        <button class="custom-btn" @tap="$emit('add-record')">添加饮水记录</button>
      </view>
    </view>
  </uni-card>
</template>

<script setup>
defineProps({
  records: {
    type: Array,
    default: () => []
  }
})

defineEmits(['add-record'])

// 格式化时间为 HH:MM 格式的通用函数
const formatTimeOnly = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  if (isNaN(date.getTime())) {
    // 如果是无效日期，返回原字符串
    return dateTimeString;
  }
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};
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

.dish-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.dish-info {
  flex: 1;
}

.dish-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.dish-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 3px;
}

.dish-desc:last-child {
  margin-bottom: 0;
}

.btn-container {
  padding: 15px 10px;
}

.custom-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 0;
  border-radius: 25px;
  border: none;
  font-weight: bold;
  width: 100%;
  font-size: 14px;
}
</style>
