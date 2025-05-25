<!-- Author: qht -->
<!-- Date: 2025-05-14 -->
<script setup>
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
// 获取页面传递的参数
const image = ref('');

// 识别结果
const recognitionResult = ref({
  name: '',
  calories: '',
  nutrients: [],
  stars: 0,
  suitablePeople: ''
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
onLoad((options) => {
  if (options.image) {
    image.value = decodeURIComponent(options.image);
  }
  if (options.result) {
      const resultData = JSON.parse(decodeURIComponent(options.result));
      // console.log('接收到的识别结果:', resultData);
      // 更新识别结果
      recognitionResult.value = formatRecognitionResult(resultData);

  }
});

// 格式化识别结果
const formatRecognitionResult = (rawResult) => {
    return {
      name: rawResult.name || '未知食物',
      calories: rawResult.calories || '0 kcal',
      nutrients: rawResult.nutrients || [
        { name: '蛋白质', value: '0g' },
        { name: '脂肪', value: '0g' },
        { name: '碳水化合物', value: '0g' }
      ],
      stars: rawResult.star || 0, 
      suitablePeople: rawResult.suitablePeople || '一般人群'
    };
};
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
