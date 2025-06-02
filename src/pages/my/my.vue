<!-- Author: qht -->
<!-- Date: 2025-05-07 -->
<script setup>
import { onLoad } from '@dcloudio/uni-app';
import { computed, onMounted, ref } from 'vue';
import { getStudentSportCountApi } from '@/apis/user';
const userInfo = ref(null)
// 健康记录信息
const healthRecord = ref({
  currentWeekSport: 0,
  healthCheckIn: 28
});

// 获取本周运动次数
const getStudentSportCount = async () => {
  const res = await getStudentSportCountApi(uni.getStorageSync('userInfo').studentNumber);
  healthRecord.value.currentWeekSport = res.data || 0;
};

// 处理头像点击
const avatarOnHandle = () => {
  // 放大图片预览
  uni.previewImage({
    urls: [userInfo.value.avatar],
    current: 0
  });
};

// 修改个人信息
const editProfile = () => {
  uni.showToast({
    title: '暂未开放此功能',
    icon: 'none'
  });
};

// 修改密码
const changePassword = () => {
  uni.showToast({
    title: '暂未开放此功能',
    icon: 'none'
  });
};

// 隐私设置
const privacySettings = () => {
  uni.showToast({
    title: '暂未开放此功能',
    icon: 'none'
  });
};

// 关于我们
const aboutUs = () => {
  uni.showToast({
    title: 'by 覃惠通 github.com/fqy9242',
    icon: 'none',
    duration: 2000
  });
};

// 退出登录
const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: function (res) {
      if (res.confirm) {
        // 清除用户信息和token
        uni.removeStorageSync('token');
        uni.removeStorageSync('userInfo');
        
        uni.showToast({
          title: '已退出登录',
          icon: 'success',
          duration: 2000
        });
        
        // 延迟跳转到登录页
        setTimeout(() => {
          uni.reLaunch({
            url: '/pages/login/login'
          });
        }, 1500);
      }
    }
  });
};

onMounted(() => {
  // 获取本周运动次数
  getStudentSportCount()
});

const getAllergen = computed(() => {
   if (!userInfo.value || !userInfo.value.allergen) {
    return '无';
   }
  return '[ ' + userInfo.value.allergen.join(', ') + ' ]';
});
onLoad(() => {
  userInfo.value = uni.getStorageSync('userInfo')
  if (!userInfo.value) {
    uni.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 2000
    });
    setTimeout(() => {
      uni.reLaunch({
        url: '/pages/login/login'
      });
    }, 1500);
  }
})
</script>

<template>
  <view class="page-container">
    <!-- 用户信息卡片 -->
    <uni-card class="card">
      <view class="user-profile">
        <image :src="userInfo.avatar" mode="aspectFill" class="avatar" @tap="avatarOnHandle" />
        <text class="user-name">{{ userInfo.name }}</text>
        <text class="user-id">学号{{ userInfo.studentNumber }}</text>
      </view>
    </uni-card>
    
    <!-- 健康档案 -->
    <uni-card title="健康档案" class="card">
      <view class="health-info">
        <text class="health-item">身高：{{ userInfo.height }} cm</text>
        <text class="health-item">体重：{{ userInfo.weight }} kg</text>
        <text class="health-item">BMI：{{ userInfo.bmi }}</text>
        <text class="health-item">过敏源：{{ getAllergen }}</text>
      </view>
    </uni-card>
    
    <!-- 健康记录 -->
    <uni-card title="健康记录" class="card">
      <view class="health-info">
        <text class="health-item">本周运动：{{ healthRecord.currentWeekSport }} 次</text>
        <text class="health-item">健康打卡：{{ healthRecord.healthCheckIn }} 天</text>
      </view>
    </uni-card>
    
    <!-- 设置选项 -->
    <uni-card title="设置" class="card">
      <view class="settings-list">
        <view class="setting-item" @tap="editProfile">
          <text class="setting-text">修改个人信息</text>
          <text class="setting-arrow">></text>
        </view>
        <view class="setting-item" @tap="changePassword">
          <text class="setting-text">修改密码</text>
          <text class="setting-arrow">></text>
        </view>
        <view class="setting-item" @tap="privacySettings">
          <text class="setting-text">隐私设置</text>
          <text class="setting-arrow">></text>
        </view>
        <view class="setting-item" @tap="aboutUs">
          <text class="setting-text">关于我们</text>
          <text class="setting-arrow">></text>
        </view>
        <view class="setting-item logout-item" @tap="logout">
          <text class="setting-text logout-text">退出登录</text>
        </view>
      </view>
    </uni-card>
    
    <!-- 底部版权信息 -->
    <view class="footer">
      <text class="copyright">© 2025 智能营养助手 版权所有</text>
    </view>
  </view>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 10px;
  padding-bottom: 30px;
}

.card {
  margin-bottom: 15px;
  border-radius: 10px;
  overflow: hidden;
}

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
  border-bottom: 1px solid #eee;
}

.health-item:last-child {
  border-bottom: none;
}

.settings-list {
  width: 100%;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-text {
  font-size: 16px;
  color: #333;
}

.setting-arrow {
  font-size: 16px;
  color: #999;
}

.logout-item {
  margin-top: 15px;
  justify-content: center;
}

.logout-text {
  color: #ff4d4f;
  font-weight: bold;
}

.footer {
  text-align: center;
  margin-top: 20px;
}

.copyright {
  font-size: 12px;
  color: #999;
}

/* 全局样式调整 */
text {
  font-family: "微软雅黑";
}
</style>