<!-- Author: qht -->
<!-- Date: 2025-05-07 -->
<script setup>
import { ref } from 'vue';

const userInfo = ref({
  name: '张同学',
  studentNumber: "2024001",
  height: 175,
  avatar: "https://ts3.tc.mm.bing.net/th/id/OIP-C.g5M-iZUiocFCi9YAzojtRAAAAA?cb=iwp1&rs=1&pid=ImgDetMain",
  weight: 65,
  BMI: 21.5,
  irritability: null // 是否过敏

})
// 健康记录信息
const healthRecord = ref({
  currentWeekSport: 5,
  healthCheckIn: 28
})
const avatarOnHandle = () => {
  // TODO 添加更换头像的逻辑
  // 放大图片
  uni.previewImage({
    urls: [userInfo.value.avatar],
    current: userInfo.value.avatar
  })
}
</script>

<template>
  <view>
    <uni-card>
      <view class="user-profile">
        <image :src="userInfo.avatar" mode="aspectFill" class="avatar" @tap="avatarOnHandle" />
        <text class="user-name">{{ userInfo.name }}</text>
        <text class="user-id">学号{{ userInfo.studentNumber }}</text>
      </view>
    </uni-card>
    <uni-card title="健康档案">
      <view class="health-info">
        <text class="health-item">身高：{{ userInfo.height }} cm</text>
        <text class="health-item">体重：{{ userInfo.weight }} kg</text>
        <text class="health-item">BMI：{{ userInfo.BMI }}</text>
        <text class="health-item">过敏源：{{ userInfo.irritability ? userInfo.irritability : '无' }}</text>
      </view>
    </uni-card>
    <uni-card title="健康记录">
      <view class="health-info">
        <text class="health-item">本周运动：{{ healthRecord.currentWeekSport }} 次</text>
        <text class="health-item">健康打卡：{{ healthRecord.healthCheckIn }} 天</text>
      </view>
    </uni-card>
    <uni-card title="设置">
      <!-- TODO 添加一些设置ui -->
    </uni-card>
  </view>
</template>

<style scoped>
.user-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #007aff;
  margin-bottom: 15px;
}

.user-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.user-id {
  font-size: 14px;
  color: #666;
}
.health-info {
  display: flex;
  flex-direction: column;
}

.health-item {
  padding: 8px 0;
  font-size: 16px;
}
text {
  font-weight: 600;
  font-family: "微软雅黑";
}
</style>