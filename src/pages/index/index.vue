<!-- Author: qht -->
<!-- Date: 2025-05-07 -->
<script setup>
import { ref } from 'vue';
import { RecognizeFoodApi } from '@/apis/ai';
// 用户健康数据
const BMI = ref(21.5);
const recommendedCalories = ref(1800);

// 添加饮食记录
const addDietRecord = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  });
};

// 添加运动记录
const addExerciseRecord = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  });
};

// 打开相机
const openCamera = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['camera'],
    success: function (res) {
      const tempFilePath = res.tempFilePaths[0];
      uni.showLoading({
        title: '识别中...'
      });
      
      // 调用AI识别接口
      RecognizeFoodApi(tempFilePath).then(result => {
        uni.hideLoading();
        console.log('识别结果:', result);
        // 识别成功后的处理
        uni.showToast({
          title: '识别成功',
          icon: 'success'
        });
        
        // 跳转到食物识别结果页面
        uni.navigateTo({
          url: '/pages/foodRecognition/foodRecognition?image=' + encodeURIComponent(tempFilePath) + '&result=' + encodeURIComponent(JSON.stringify(result))
        });
      })
    },
  })
};
</script>

<template>
  <view class="page-container">
    <!-- 健康统计卡片 -->
    <view class="health-stats">
      <view class="stat-card">
        <view class="stat-value">{{ BMI }}</view>
        <view class="stat-label">BMI指数</view>
      </view>
      <view class="stat-card">
        <view class="stat-value">{{ recommendedCalories }}</view>
        <view class="stat-label">今日推荐摄入(kcal)</view>
      </view>
    </view>

    <!-- 今日健康打卡 -->
    <uni-card title="今日健康打卡" :padding="false" class="custom-card">
      <view class="card-content">
        <view class="dish-item">
          <view class="dish-info">
            <view class="dish-title">早餐</view>
            <view class="dish-desc">全麦面包 + 牛奶 + 水果</view>
            <view class="dish-desc">08:30 | 450kcal</view>
          </view>
        </view>
        <view class="dish-item">
          <view class="dish-info">
            <view class="dish-title">午餐</view>
            <view class="dish-desc">米饭 + 清蒸鱼 + 青菜</view>
            <view class="dish-desc">12:00 | 750kcal</view>
          </view>
        </view>
        <view class="btn-container">
          <button class="custom-btn" @tap="addDietRecord">添加饮食记录</button>
        </view>
      </view>
    </uni-card>

    <!-- 今日运动 -->
    <uni-card title="今日运动" :padding="false" class="custom-card">
      <view class="card-content">
        <view class="dish-item">
          <view class="dish-info">
            <view class="dish-title">晨跑</view>
            <view class="dish-desc">3公里 | 消耗200kcal</view>
            <view class="dish-desc">07:00</view>
          </view>
        </view>
        <view class="btn-container">
          <button class="custom-btn" @tap="addExerciseRecord">添加运动记录</button>
        </view>
      </view>
    </uni-card>

    <!-- 健康提醒 -->
    <uni-card title="健康提醒" :padding="false" class="custom-card">
      <view class="card-content">
        <view class="suggestion-item">
          <text class="iconfont icon-bell" style="color: #4CAF50;"></text>
          <text class="suggestion-text">记得补充水分，今日已饮水800ml</text>
        </view>
        <view class="suggestion-item">
          <text class="iconfont icon-bell" style="color: #4CAF50;"></text>
          <text class="suggestion-text">距离下次体检还有15天</text>
        </view>
      </view>
    </uni-card>

    <!-- 悬浮拍照按钮 -->
    <view class="float-button" @tap="openCamera">
      <svg t="1748187905893" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="3012" width="200" height="200">
        <path
          d="M799.9 305.1H674.1l-9.2-56.4c-3.4-20.8-21.4-36.1-42.5-36.1H406.7c-21.1 0-39.1 15.3-42.5 36.1l-9.2 56.4H225.1c-31.9 0-57.9 26.1-57.9 57.9v391.5c0 31.9 26.1 57.9 57.9 57.9h574.8c31.9 0 57.9-26.1 57.9-57.9V363.1c0-31.9-26-58-57.9-58z"
          fill="#0EDD92" p-id="3013"></path>
        <path
          d="M793.4 305.1H758h2.1c8.4 0.3 8.1 13-0.3 13h-79.9c-3.3 0-6-2.4-6.5-5.7l-8.4-63.8c-3.4-20.8-21.4-36.1-42.5-36.1h-41.9c21.1 0 39.1 15.3 42.5 36.1l9.1 69c0 0.3 0.1 0.6 0.1 0.9 0 16.5 13.4 29.9 29.9 29.9h139.2c8 0 14.7 6.4 14.7 14.4v391.7c0 31.9-26.1 57.9-57.9 57.9h35.4c35.4 0 64.4-29 64.4-64.4V369.6c-0.2-35.5-29.2-64.5-64.6-64.5z"
          fill="#22C486" p-id="3014"></path>
        <path
          d="M799.9 825.4H225.1c-39.1 0-70.9-31.8-70.9-70.9V363.1c0-39.1 31.8-70.9 70.9-70.9H344l7.4-45.5c4.4-27.3 27.7-47.1 55.3-47.1h215.7c27.6 0 50.9 19.8 55.3 47.1l7.4 45.5h114.7c39.1 0 70.9 31.8 70.9 70.9v391.5c0.1 39-31.7 70.8-70.8 70.8zM225.1 318.1c-24.8 0-44.9 20.2-44.9 44.9v391.5c0 24.8 20.2 44.9 44.9 44.9h574.8c24.8 0 44.9-20.2 44.9-44.9V363.1c0-24.8-20.2-44.9-44.9-44.9H663l-10.9-67.3c-2.4-14.6-14.9-25.2-29.7-25.2H406.7c-14.8 0-27.3 10.6-29.7 25.2l-10.9 67.3h-141z"
          fill="#0B0E54" p-id="3015"></path>
        <path
          d="M857.8 510.2l-690.5-4.8-0.1 26 690.5 4.8zM167.2 601.5l690.5 4.7 0.1-26-690.5-4.7zM167.2 672.7l690.5 4.7 0.1-26-690.5-4.7z"
          fill="#0B0E54" p-id="3016"></path>
        <path d="M512.5 520.8m-153.3 0a153.3 153.3 0 1 0 306.6 0 153.3 153.3 0 1 0-306.6 0Z" fill="#66FC56" p-id="3017">
        </path>
        <path
          d="M511.4 367.5c-5.1 0-10.1 0.3-15 0.7 77.7 7.5 138.4 73 138.4 152.6S574 665.9 496.4 673.4c4.9 0.5 9.9 0.7 15 0.7 84.7 0 153.3-68.7 153.3-153.3s-68.6-153.3-153.3-153.3z"
          fill="#62E04F" p-id="3018"></path>
        <path
          d="M512.5 687.2c-91.7 0-166.3-74.6-166.3-166.3s74.6-166.3 166.3-166.3 166.3 74.6 166.3 166.3-74.6 166.3-166.3 166.3z m0-306.7c-77.4 0-140.3 63-140.3 140.3 0 77.4 63 140.3 140.3 140.3s140.3-63 140.3-140.3c0-77.4-62.9-140.3-140.3-140.3z"
          fill="#0B0E54" p-id="3019"></path>
        <path d="M443.7 442.5m-15.4 0a15.4 15.4 0 1 0 30.8 0 15.4 15.4 0 1 0-30.8 0Z" fill="#FFFFFF" p-id="3020"></path>
        <path
          d="M428.5 469.1c-5.6-3.4-12.9-1.6-16.3 4-1 1.7-24.8 41.8-4.7 102.8 1.6 5 6.3 8.2 11.3 8.2 1.2 0 2.5-0.2 3.7-0.6 6.2-2 9.6-8.8 7.6-15-16.4-50 1.6-81.7 2.5-83.1 3.2-5.6 1.5-12.9-4.1-16.3z"
          fill="#FFFFFF" p-id="3021"></path>
      </svg>
      <!-- <text class="iconfont icon-camera"></text> -->
    </view>
  </view>
</template>

<style scoped>
.page-container {
  padding: 15px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

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
  color: #4CAF50;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

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

.suggestion-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-text {
  margin-left: 10px;
  font-size: 14px;
}

.float-button {
  position: fixed;
  right: 30px;
  bottom: 80px;
  width: 60px;
  height: 60px;
  /* background-color: #4CAF50; */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 999;
}




/* 图标样式，如果引入了字体图标库 */
.iconfont {
  font-size: 24px;
  font-family: "iconfont";
}

.icon-bell::before {
  content: "\e64e"; /* 这个是示例，实际需要根据你的字体图标库中的编码 */
}

.icon-camera::before {
  content: "\e665"; /* 这个是示例，实际需要根据你的字体图标库中的编码 */
}
</style>