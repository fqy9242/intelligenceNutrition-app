<!-- Author: qht -->
<!-- Date: 2025-05-14 -->
<script setup>
import { onMounted, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getHealthAdviceApi, getNutrientAnalysisApi, getWeeklyNutritionTrendApi } from '@/apis/ai'
import { getHealthScoreApi } from '@/apis/user'
// 健康评分数据
const healthScore = ref(0);
const scoreImprovement = ref(0);

// 营养摄入分析数据
const nutritionAnalysis = ref([]);

// 本周营养趋势数据
const weeklyNutritionTrend = ref([]);

// 营养素类型配置
const nutritionTypes = ref([
  { key: 'protein', name: '蛋白质', color: '#4CAF50', unit: 'g' },
  { key: 'carbs', name: '碳水化合物', color: '#2196F3', unit: 'g' },
  { key: 'fat', name: '脂肪', color: '#FF9800', unit: 'g' },
  { key: 'vitamins', name: '维生素', color: '#9C27B0', unit: 'mg' }
]);

// 获取营养素的百分比高度
const getPercentageHeight = (value) => {
  return Math.min(value, 100) + '%';
};

// 获取营养素状态
const getNutrientStatus = (value) => {
  if (value >= 90) return { text: '优秀', color: '#4CAF50' };
  if (value >= 80) return { text: '良好', color: '#2196F3' };
  if (value >= 70) return { text: '一般', color: '#FF9800' };
  return { text: '不足', color: '#F44336' };
};

// 营养素状态颜色映射
const getStatusColor = (status) => {
  const colorMap = {
    '达标': '#4CAF50',
    '适中': '#2196F3',
    '偏高': '#FF5733',
    '不足': '#FF9800'
  };
  return colorMap[status] || '#666';
};

// 营养素名称映射
const getNutrientName = (key) => {
  const nameMap = {
    'protein': '蛋白质',
    'fat': '脂肪',
    'carbohydrate': '碳水化合物',
    'vitamin': '维生素'
  };
  return nameMap[key] || key;
};

// 获取营养分析数据
const getNutrientAnalysis = async (studentNumber) => {
    const response = await getNutrientAnalysisApi(studentNumber);
    const data = response.data || {};
    // 将后端数据转换为前端需要的格式
    nutritionAnalysis.value = Object.keys(data).map(key => ({
      name: getNutrientName(key),
      status: data[key],
      color: getStatusColor(data[key])
    }));
};

// 健康建议
const healthSuggestions = ref([]);
// 获取健康建议
const getHealthSuggestions = async (studentNumber) => {
    const response = await getHealthAdviceApi(studentNumber);
    healthSuggestions.value = response.data || [];
}
// 获取健康评分
const getHealthScore = async (studentNumber) => {
    const response = await getHealthScoreApi(studentNumber);
    healthScore.value = response.data.nowScore || 0;
    const lastScore = response.data.lastScore || 0;
    scoreImprovement.value = healthScore.value - lastScore;
}

// 获取本周营养趋势数据
const getWeeklyNutritionTrend = async (studentNumber) => {
    const response = await getWeeklyNutritionTrendApi(studentNumber);
    weeklyNutritionTrend.value = response.data || [];
}

onLoad(() => {
  const studentNumber = uni.getStorageSync('userInfo')?.studentNumber;
    getHealthSuggestions(studentNumber);
    getHealthScore(studentNumber);
    getNutrientAnalysis(studentNumber);
    getWeeklyNutritionTrend(studentNumber);
})
</script>

<template>  <view class="page-container">    <!-- 本周营养趋势 -->
    <uni-card title="本周营养趋势" :padding="false" class="custom-card">
      <view class="card-content">
        <!-- 营养素概览卡片 -->
        <view class="nutrition-overview">
          <view v-for="type in nutritionTypes" :key="type.key" class="nutrition-card">
            <view class="nutrition-header">
              <view class="nutrition-icon" :style="{ backgroundColor: type.color }">
                <text class="icon-text">{{ type.name.charAt(0) }}</text>
              </view>              <view class="nutrition-info">
                <text class="nutrition-name">{{ type.name }}</text>
                <text class="nutrition-average">
                  平均 {{ Math.round(weeklyNutritionTrend.reduce((sum, day) => sum + (day[type.key] || 0), 0) / 7) }}%
                </text>
              </view>              <view class="nutrition-status" 
                    :style="{ 
                      backgroundColor: getNutrientStatus(Math.round(weeklyNutritionTrend.reduce((sum, day) => sum + (day[type.key] || 0), 0) / 7)).color + '20',
                      color: getNutrientStatus(Math.round(weeklyNutritionTrend.reduce((sum, day) => sum + (day[type.key] || 0), 0) / 7)).color
                    }">
                {{ getNutrientStatus(Math.round(weeklyNutritionTrend.reduce((sum, day) => sum + (day[type.key] || 0), 0) / 7)).text }}
              </view>
            </view>
            
            <!-- 一周趋势进度条 -->
            <view class="week-progress">
              <view v-for="(dayData, index) in weeklyNutritionTrend" :key="index" class="day-progress">                <view class="progress-bar">
                  <view class="progress-fill" 
                        :style="{ 
                          width: getPercentageHeight(dayData[type.key] || 0), 
                          backgroundColor: type.color,
                          opacity: (dayData[type.key] || 0) / 100
                        }">
                  </view>
                </view>
                <text class="progress-day">{{ dayData.day.substring(1) }}</text>
                <text class="progress-value">{{ dayData[type.key] || 0 }}</text>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 今日营养达标情况 -->
        <view class="today-summary">
          <text class="today-title">今日营养达标率</text>          <view class="achievement-ring">
            <view class="ring-progress" :style="{ 
              background: `conic-gradient(#4CAF50 0deg ${((weeklyNutritionTrend[6]?.protein || 0) + (weeklyNutritionTrend[6]?.carbs || 0) + (weeklyNutritionTrend[6]?.fat || 0) + (weeklyNutritionTrend[6]?.vitamins || 0)) / 4 * 3.6}deg, #f0f0f0 ${((weeklyNutritionTrend[6]?.protein || 0) + (weeklyNutritionTrend[6]?.carbs || 0) + (weeklyNutritionTrend[6]?.fat || 0) + (weeklyNutritionTrend[6]?.vitamins || 0)) / 4 * 3.6}deg 360deg)` 
            }">
              <view class="ring-inner">
                <text class="achievement-percent">{{ Math.round(((weeklyNutritionTrend[6]?.protein || 0) + (weeklyNutritionTrend[6]?.carbs || 0) + (weeklyNutritionTrend[6]?.fat || 0) + (weeklyNutritionTrend[6]?.vitamins || 0)) / 4) }}%</text>
                <text class="achievement-label">综合达标</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </uni-card>

    <!-- 营养摄入分析 -->
    <uni-card title="营养摄入分析" :padding="false" class="custom-card">
      <view class="card-content">
        <view class="nutrition-tags">
          <view v-for="(item, index) in nutritionAnalysis" :key="index" class="nutrition-tag" :style="{ backgroundColor: item.color + '20', color: item.color }">
            {{ item.name }}: {{ item.status }}
          </view>
        </view>
      </view>
    </uni-card>

    <!-- 健康建议 -->
    <uni-card title="健康建议" :padding="false" class="custom-card">
      <view class="card-content">
        <view v-for="(suggestion, index) in healthSuggestions" :key="index" class="suggestion-item">
          <text class="iconfont icon-check" style="color: #4CAF50;"></text>
          <text class="suggestion-text">{{ suggestion }}</text>
        </view>
      </view>
    </uni-card>

    <!-- 健康评分 -->
    <uni-card title="健康评分" :padding="false" class="custom-card">
      <view class="card-content">
        <view class="score-container">
          <text class="health-score" :style="{color: healthScore >= 60? '#4CAF50' : '#FF5733'}">{{ healthScore }}</text>
          <text class="score-change">较上周{{ scoreImprovement >= 0 ? '提升' : '下降' }}{{ Math.abs(scoreImprovement) }}分</text>
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
  padding: 10px;
}

.nutrition-chart {
  height: 200px;
  background-color: #f8f9fa;
  border-radius: 12px;
  margin: 5px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  text-align: center;
  padding: 20px;
  width: 100%;
}

.chart-area {
  height: 150px;
  background-color: #f0f0f0;
  margin: 10px 0;
  border-radius: 8px;
}

/* 营养趋势卡片样式 */
.nutrition-overview {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.nutrition-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nutrition-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.nutrition-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-text {
  color: white;
  font-size: 16px;
  font-weight: bold;
}

.nutrition-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nutrition-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.nutrition-average {
  font-size: 12px;
  color: #666;
}

.nutrition-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.week-progress {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.day-progress {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background-color: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-day {
  font-size: 10px;
  color: #666;
}

.progress-value {
  font-size: 8px;
  color: #999;
}

.today-summary {
  margin-top: 20px;
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.today-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.achievement-ring {
  position: relative;
}

.ring-progress {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-inner {
  width: 70px;
  height: 70px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.achievement-percent {
  font-size: 18px;
  font-weight: bold;
  color: #4CAF50;
}

.achievement-label {
  font-size: 10px;
  color: #666;
}

.nutrition-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0;
}

.nutrition-tag {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-text {
  font-size: 14px;
  color: #333;
}

.score-container {
  text-align: center;
  padding: 20px;
}

.health-score {
  font-size: 48px;
  /* color: #4CAF50; */
  font-weight: bold;
}

.score-change {
  display: block;
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

/* 图标样式 */
.iconfont {
  font-size: 24px;
  font-family: "iconfont";
}
</style>