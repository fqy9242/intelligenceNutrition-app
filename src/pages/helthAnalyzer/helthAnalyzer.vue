<!-- Author: qht -->
<!-- Date: 2025-05-14 -->
<script setup>
import { ref } from 'vue';

// 健康评分数据
const healthScore = ref(85);
const scoreImprovement = ref(5);

// 营养摄入分析数据
const nutritionAnalysis = ref([
  { name: '蛋白质', status: '达标', color: '#4CAF50' },
  { name: '脂肪', status: '偏高', color: '#FF5733' },
  { name: '碳水化合物', status: '适中', color: '#2196F3' },
  { name: '维生素', status: '不足', color: '#FF9800' },
]);

// 健康建议
const healthSuggestions = ref([
  '增加蔬菜摄入量',
  '控制油炸食品摄入',
  '保持适量运动',
]);
</script>

<template>
  <view class="page-container">
    <!-- 本周营养趋势 -->
    <uni-card title="本周营养趋势" :padding="false" class="custom-card">
      <view class="card-content">
        <view class="nutrition-chart">
          <view class="chart-placeholder">
            <text>蛋白质摄入趋势</text>
            <view class="chart-area"></view>
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
          <text class="health-score">{{ healthScore }}</text>
          <text class="score-change">较上周提升{{ scoreImprovement }}分</text>
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
  color: #4CAF50;
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

.icon-check::before {
  content: "\e64f"; /* 这个是示例，实际需要根据你的字体图标库中的编码 */
}
</style>