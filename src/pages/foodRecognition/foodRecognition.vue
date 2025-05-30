<!-- Author: qht -->
<!-- Date: 2025-05-14 -->
<script setup>
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { addDietRecordApi } from '@/apis/user';
// 获取页面传递的参数
const image = ref('');

// 餐次类型
const mealTypes = [
  { label: '早餐', value: 0 },
  { label: '午餐', value: 1 },
  { label: '晚餐', value: 2 },
  { label: '加餐', value: 3 }
];

// 自动获取当前时间对应的餐次类型
const getAutoMealType = () => {
  const now = new Date();
  const hour = now.getHours();
  
  // 根据时间自动判断餐次
  if (hour >= 6 && hour < 11) {
    return 0; // 早餐 (6:00-10:59)
  } else if (hour >= 11 && hour < 15) {
    return 1; // 午餐 (11:00-14:59)
  } else if (hour >= 17 && hour < 21) {
    return 2; // 晚餐 (17:00-20:59)
  } else {
    return 3; // 加餐 (其他时间)
  }
};

// 选中的餐次 - 默认根据当前时间自动选择
const selectedMealType = ref(getAutoMealType());

// 食物重量
const foodWeight = ref(100); // 默认100g

// 识别结果
const recognitionResult = ref({
  name: '',
  calories: '',
  nutrients: [],
  stars: 0,
  suitablePeople: ''
});

// 添加到今日饮食
const addToTodaysDiet = async () => {
    // 获取学生号（从本地存储或用户信息中获取）
    const studentNumber = uni.getStorageSync('studentNumber') || uni.getStorageSync('userInfo')?.studentNumber;
    
    if (!studentNumber) {
      uni.showToast({
        title: '请先登录',
        icon: 'error'
      });
      return;
    }

    // 解析营养成分数据
    const parseNutrientValue = (valueStr) => {
      return parseFloat(valueStr.replace(/[^\d.]/g, '')) || 0;
    };

    // 构建请求数据
    const dietData = {
      studentNumber: studentNumber,
      mealType: selectedMealType.value,
      foodName: recognitionResult.value.name,
      foodWeight: foodWeight.value,
      foodCalorie: parseNutrientValue(recognitionResult.value.calories),
      foodProtein: parseNutrientValue(recognitionResult.value.nutrients.find(n => n.name === '蛋白质')?.value || '0'),
      foodFat: parseNutrientValue(recognitionResult.value.nutrients.find(n => n.name === '脂肪')?.value || '0'),
      foodCarbohydrate: parseNutrientValue(recognitionResult.value.nutrients.find(n => n.name === '碳水化合物')?.value || '0'),
      foodDietaryFiber: parseNutrientValue(recognitionResult.value.nutrients.find(n => n.name === '膳食纤维')?.value || '0')
    };

    uni.showLoading({
      title: '添加中...'
    });

    await addDietRecordApi(dietData);
    
    uni.hideLoading();
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
  // console.log('食物识别页面接收到的参数:', options);
  
  if (options.image) {
    image.value = decodeURIComponent(options.image);
    // console.log('接收到的图片路径:', image.value);
  }
      const resultData = JSON.parse(decodeURIComponent(options.result));
      // console.log('接收到的识别结果:', resultData);
      // 更新识别结果
      recognitionResult.value = formatRecognitionResult(resultData);
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
        
        <!-- 餐次选择 -->
        <view class="meal-selection">
          <text class="section-title">选择餐次:</text>
          <view class="meal-types">
            <text 
              v-for="(meal, index) in mealTypes" 
              :key="index"
              :class="['meal-tag', { active: selectedMealType === meal.value }]"
              @tap="selectedMealType = meal.value"
            >
              {{ meal.label }}
            </text>
          </view>
        </view>
        
        <!-- 重量输入 -->
        <view class="weight-input">
          <text class="section-title">食物重量:</text>
          <view class="input-group">
            <input 
              v-model.number="foodWeight" 
              type="number" 
              placeholder="请输入重量"
              class="weight-input-field"
            />
            <text class="unit">克</text>
          </view>
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
  margin-bottom: 15px;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.meal-selection {
  margin-bottom: 15px;
}

.meal-types {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.meal-tag {
  background-color: #f0f0f0;
  color: #666;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.meal-tag.active {
  background-color: #4CAF50;
  color: white;
}

.weight-input {
  margin-bottom: 10px;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.weight-input-field {
  flex: 1;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
}

.unit {
  font-size: 14px;
  color: #666;
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
