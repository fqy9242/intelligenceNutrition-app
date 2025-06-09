<!-- 饮食记录卡片组件 -->
<template>
  <uni-card title="今日健康打卡" :padding="false" class="custom-card">
    <view class="card-content">
      <view v-for="record in records" :key="record.id" class="dish-item">
        <view class="dish-info">
          <view class="dish-title">{{ getMealTypeName(record.mealType) }}</view>
          <view class="dish-desc">{{ record.foodName }}</view>
          <view class="dish-desc">
            {{ record.time }}
            <template v-if="record.weight">| {{ record.weight }}g</template>
            <template v-if="record.calories">| {{ record.calories }}kcal</template>
          </view>
        </view>
      </view>
      <view class="btn-container">
        <button class="custom-btn" @tap="$emit('add-record')">添加饮食记录</button>
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

// 餐次选项
const mealTypes = ['早餐', '午餐', '晚餐', '加餐'];

// 根据数字获取餐次名称
const getMealTypeName = (mealType) => {
  return mealTypes[mealType] || mealTypes[0];
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
