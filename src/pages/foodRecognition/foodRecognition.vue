<!-- Author: qht -->
<!-- Date: 2025-05-14 -->
<script setup>
import { ref, onMounted } from 'vue';

// 获取页面传递的参数
const image = ref('');

// 识别结果
const recognitionResult = ref({
  name: '红烧排骨',
  calories: '350kcal',
  nutrients: [
    { name: '蛋白质', value: '15g' },
    { name: '脂肪', value: '20g' },
    { name: '碳水化合物', value: '10g' }
  ],
  stars: 4,
  suitablePeople: '需要补充蛋白质的学生'
});

// 添加到今日饮食
const addToTodaysDiet = () => {
  uni.showToast({
    title: '已添加到今日饮食',
    icon: 'success'
  });
  
  // 延迟返回首页
  setTimeout(() => {
    uni.switchTab({
      url: '/pages/index/index'
    });
  }, 1500);
};

// 返回首页
const goBack = () => {
  uni.navigateBack();
};

onMounted(() => {
  // 获取页面参数
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = currentPage.options;
  
  if (options && options.image) {
    image.value = decodeURIComponent(options.image);
  }
});
</script>

<template>
  <view class="page-container">
    <!-- 识别结果卡片 -->
    <uni-card class="result-card">
      <view class="food-image">
        <image :src="image" mode="aspectFill" class="image"></image>
      </view>
      
      <view class="food-info">
        <text class="food-name">{{ recognitionResult.name }}</text>
        
        <view class="nutrition-tags">
          <text class="nutrition-tag">卡路里: {{ recognitionResult.calories }}</text>
          <text v-for="(nutrient, index) in recognitionResult.nutrients" :key="index" class="nutrition-tag">
            {{ nutrient.name }}: {{ nutrient.value }}
          </text>
        </view>
        
        <view class="additional-info">
          <text>推荐指数: {{ '⭐'.repeat(recognitionResult.stars) }}</text>
          <text>适合人群: {{ recognitionResult.suitablePeople }}</text>
        </view>
      </view>
    </uni-card>
    
    <!-- 按钮区域 -->
    <view class="button-area">
      <button class="custom-btn" @tap="addToTodaysDiet">添加到今日饮食</button>
      <button class="custom-btn secondary" @tap="goBack">返回</button>
    </view>
  </view>
</template>

<style scoped>
.page-container {
  padding: 15px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.result-card {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 15px;
}

.food-image {
  width: 100%;
  height: 200px;
  background-color: #eee;
  border-radius: 8px;
  margin-bottom: 15px;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
}

.food-info {
  padding: 5px;
}

.food-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.nutrition-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.nutrition-tag {
  background-color: #e8f5e9;
  color: #4CAF50;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.additional-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.button-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.custom-btn {
  background-color: #4CAF50;
  color: white;
  padding: 12px 0;
  border-radius: 25px;
  border: none;
  font-weight: bold;
  width: 100%;
  font-size: 14px;
}

.custom-btn.secondary {
  background-color: #f0f0f0;
  color: #333;
}
</style>
