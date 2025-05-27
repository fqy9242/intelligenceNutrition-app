<!-- Author: qht -->
<!-- Date: 2025-05-14 -->
<script setup>
import { ref } from 'vue';
import { getHealthHistoryApi } from '@/apis/user';
import { onLoad } from '@dcloudio/uni-app';
// 饮食记录数据
const dietRecords = ref([
  {
    date: '2024-03-15',
    records: [
      { meal: '早餐', content: '全麦面包 + 牛奶' },
      { meal: '午餐', content: '米饭 + 清蒸鱼' },
      { meal: '晚餐', content: '杂粮粥 + 鸡胸肉' }
    ]
  },
  {
    date: '2024-03-14',
    records: [
      { meal: '早餐', content: '燕麦片 + 水果' },
      { meal: '午餐', content: '米饭 + 青菜' },
      { meal: '晚餐', content: '面条 + 蔬菜' }
    ]
  }
]);

// 运动记录数据
const exerciseRecords = ref([
  {
    date: '2024-03-15',
    type: '晨跑',
    distance: '3公里',
    calories: '200kcal'
  },
  {
    date: '2024-03-14',
    type: '游泳',
    duration: '1小时',
    calories: '300kcal'
  }
]);

// 健康数据记录
const healthDataRecords = ref([]);

// 获取健康数据记录
const getHealthHistory = async () => {
  const res = await getHealthHistoryApi(uni.getStorageSync('userInfo').studentNumber)
  healthDataRecords.value = res.data
  console.log('健康数据记录:', healthDataRecords.value);
  
}
onLoad(() => {
  getHealthHistory()
})
</script>

<template>
  <view class="page-container">
    <!-- 饮食记录 -->
    <uni-card title="饮食记录" :padding="false" class="custom-card">
      <view class="card-content">
        <view v-for="(record, index) in dietRecords" :key="index" class="record-item">
          <view class="dish-info">
            <view class="dish-title">{{ record.date }}</view>
            <view v-for="(meal, mealIndex) in record.records" :key="mealIndex" class="dish-desc">
              {{ meal.meal }}：{{ meal.content }}
            </view>
          </view>
        </view>
      </view>
    </uni-card>

    <!-- 运动记录 -->
    <uni-card title="运动记录" :padding="false" class="custom-card">
      <view class="card-content">
        <view v-for="(record, index) in exerciseRecords" :key="index" class="record-item">
          <view class="dish-info">
            <view class="dish-title">{{ record.date }}</view>
            <view class="dish-desc">{{ record.type }} {{ record.distance || record.duration }}</view>
            <view class="dish-desc">消耗 {{ record.calories }}</view>
          </view>
        </view>
      </view>
    </uni-card>

    <!-- 健康数据记录 -->
    <uni-card title="健康数据记录" :padding="false" class="custom-card">
      <view class="card-content">
        <view v-for="(record, index) in healthDataRecords" :key="index" class="record-item">
          <view class="dish-info">
            <view class="dish-title">{{ record.date }}</view>
            <view class="dish-desc">体重：{{ record.weight }}kg</view>
            <view class="dish-desc">身高：{{ record.height }}cm</view>
            <view class="dish-desc">BMI：{{ record.bmi }}</view>
          </view>
        </view>
      </view>
    </uni-card>
  </view>
</template>

<style scoped>
.page-container {
  padding: 15px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.custom-card {
  margin-bottom: 15px;
  border-radius: 12px;
  overflow: hidden;
}

.card-content {
  padding: 0 10px;
}

.record-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.record-item:last-child {
  border-bottom: none;
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
</style>