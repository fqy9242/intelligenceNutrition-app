<!-- Author: qht -->
<!-- Date: 2025-05-07 -->
<script setup>
import { ref } from 'vue';
import { RecognizeFoodApi } from '@/apis/ai';
import { getNextCheckPlanApi } from '@/apis/user.js'
import { onLoad } from '@dcloudio/uni-app';
// 用户健康数据
const recommendedCalories = ref(1800);
// 获取下次体检时间
const nextCheckDay = ref('');
const getNextCheckDay = async () => {
  const res = await getNextCheckPlanApi()
  nextCheckDay.value = !res.data.physicalExaminationTime ? '暂无体检计划':
   Math.ceil((new Date(res.data.physicalExaminationTime).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) 
  // console.log('下次体检时间:', nextCheckDay.value);
}
const BMI = uni.getStorageSync('userInfo').bmi
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
onLoad(() => {
  getNextCheckDay()
})
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
          <text class="suggestion-text">距离下次体检还有{{ nextCheckDay }}天</text>
        </view>
      </view>
    </uni-card>

    <!-- 悬浮拍照按钮 -->
    <view class="float-button" @tap="openCamera">
      <image src="@/static/icon/camera.png" class="camera-icon"></image>
    </view>
  </view>
</template>

<style scoped>
.camera-icon {
  max-width: 100%;
  max-height: 100%;
}
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
  background-color: #4CAF50;
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