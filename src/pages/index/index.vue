<!-- Author: qht -->
<!-- Date: 2025-05-07 -->
<script setup>
import { ref } from 'vue';
import { RecognizeFoodApi } from '@/apis/ai';
import { getNextCheckPlanApi, addDietRecordApi, getTodayDietRecordApi, getWaterRecordApi } from '@/apis/user'
import { onLoad } from '@dcloudio/uni-app';
// 用户健康数据
const recommendedCalories = ref(1800);
// 获取下次体检时间
const nextCheckDay = ref('');
const getNextCheckDay = async () => {
  const res = await getNextCheckPlanApi()
  nextCheckDay.value = !res.data.physicalExaminationTime ? '暂无体检计划' :
    Math.ceil((new Date(res.data.physicalExaminationTime).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  // console.log('下次体检时间:', nextCheckDay.value);
}
const BMI = ref('--');
// 获取BMI数据
const getUserBMI = () => {
  const userInfo = uni.getStorageSync('userInfo');
  if (userInfo && userInfo.bmi) {
    BMI.value = userInfo.bmi;
  }
}


// 获取学生今日饮食记录
const getTodayDietRecord = async () => {
  // 调用后端接口
  const res = await getTodayDietRecordApi(uni.getStorageSync('userInfo').studentNumber);
  const records = [];
  const data = res.data;

  // 处理早餐数据
  if (data.breakfast) {
    records.push({
      id: Date.now() + 1,
      mealType: 0, // 早餐
      foodName: data.breakfast.foodList.join(' + '),
      weight: data.breakfast.totalWeight,
      calories: data.breakfast.totalCalories,
      time: new Date(data.breakfast.mealTime).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    });
  }

  // 处理午餐数据
  if (data.lunch) {
    records.push({
      id: Date.now() + 2,
      mealType: 1, // 午餐
      foodName: data.lunch.foodList.join(' + '),
      weight: data.lunch.totalWeight,
      calories: data.lunch.totalCalories,
      time: new Date(data.lunch.mealTime).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    });
  }

  // 处理晚餐数据
  if (data.dinner) {
    records.push({
      id: Date.now() + 3,
      mealType: 2, // 晚餐
      foodName: data.dinner.foodList.join(' + '),
      weight: data.dinner.totalWeight,
      calories: data.dinner.totalCalories,
      time: new Date(data.dinner.mealTime).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    });
  }

  // 处理加餐数据
  if (data.other) {
    records.push({
      id: Date.now() + 4,
      mealType: 3, // 加餐
      foodName: data.other.foodList.join(' + '),
      weight: data.other.totalWeight,
      calories: data.other.totalCalories,
      time: new Date(data.other.mealTime).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    });
  }

  // 更新饮食记录列表
  dietRecords.value = records;

}


// 饮食记录弹窗相关数据
const showDietModal = ref(false);
const dietForm = ref({
  mealType: 0,
  foodName: '',
  calories: '',
  weight: '',
  time: ''
});

// 饮食记录列表
const dietRecords = ref([]);
// 今天的饮水记录列表
const waterRecords = ref([]);
// 获取今天的饮水记录
const getWaterRecord = async () => {
  const res = await getWaterRecordApi(uni.getStorageSync('userInfo').studentNumber, 1);
  waterRecords.valu = res.data
}

// 餐次选项
const mealTypes = ['早餐', '午餐', '晚餐', '加餐'];

// 根据数字获取餐次名称
const getMealTypeName = (mealType) => {
  return mealTypes[mealType] || mealTypes[0];
};

// 添加饮食记录按钮被点击
const addDietRecord = () => {
  // 设置默认时间为当前时间
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  dietForm.value.time = `${hours}:${minutes}`;
  showDietModal.value = true;
}
const addWaterRecord = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  });
};

// 保存饮食记录
const saveDietRecord = async () => {
  if (!dietForm.value.foodName.trim()) {
    uni.showToast({
      title: '请输入食物名称',
      icon: 'none'
    });
    return;
  }
  if (!dietForm.value.weight) {
    uni.showToast({
      title: '请输入食物重量',
      icon: 'none'
    });
    return;
  }
  // 构造完整的日期时间字符串 (ISO 8601格式)
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const fullDateTime = `${year}-${month}-${day}T${dietForm.value.time}:00`;

  // 调用API添加饮食记录
  const res = await addDietRecordApi({
    studentNumber: uni.getStorageSync('userInfo').studentNumber,
    mealType: dietForm.value.mealType,
    foodName: dietForm.value.foodName,
    foodWeight: dietForm.value.weight,
    foodCalorie: dietForm.value.calories,
    createTime: fullDateTime
  });


  // 重置表单
  dietForm.value = {
    mealType: 0,
    foodName: '',
    calories: '',
    weight: '',
    time: ''
  };

  showDietModal.value = false;

  uni.showToast({
    title: '添加成功',
    icon: 'success'
  });

  // 重新获取今日饮食记录
  getTodayDietRecord();
};

// 取消添加
const cancelDietRecord = () => {
  showDietModal.value = false;
  // 重置表单
  dietForm.value = {
    mealType: 0,
    foodName: '',
    calories: '',
    weight: '',
    time: ''
  };
};

// 餐次选择事件
const onMealTypeChange = (e) => {
  dietForm.value.mealType = parseInt(e.detail.value);
};

// 时间选择事件
const onTimeChange = (e) => {
  dietForm.value.time = e.detail.value;
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
        
        // 先显示识别成功提示
        uni.showToast({
          title: '识别成功',
          icon: 'success',
          duration: 1000
        });
        
        // 延迟跳转，确保 toast 显示完成
        setTimeout(() => {
          // 使用 reLaunch 替代 navigateTo，避免页面栈问题
          const imageParam = encodeURIComponent(tempFilePath);
          const resultParam = encodeURIComponent(JSON.stringify(result));
          
          uni.navigateTo({
            url: `/pages/foodRecognition/foodRecognition?image=${imageParam}&result=${resultParam}`,
            success: () => {
              console.log('页面跳转成功');
            },
            fail: (err) => {
              console.error('页面跳转失败:', err);
              // 如果 navigateTo 失败，尝试使用 redirectTo
              uni.redirectTo({
                url: `/pages/foodRecognition/foodRecognition?image=${imageParam}&result=${resultParam}`,
                success: () => {
                  console.log('使用 redirectTo 跳转成功');
                },
                fail: (redirectErr) => {
                  console.error('redirectTo 也失败:', redirectErr);
                  uni.showToast({
                    title: '页面跳转失败',
                    icon: 'error'
                  });
                }
              });
            }
          });
        }, 1200);
        
      }).catch(error => {
        uni.hideLoading();
        console.error('识别失败:', error);
        uni.showToast({
          title: '识别失败，请重试',
          icon: 'error'
        });
      });
    },
    fail: function (err) {
      console.error('选择图片失败:', err);
      uni.showToast({
        title: '选择图片失败',
        icon: 'error'
      });
    }
  });
};
onLoad(() => {
  getNextCheckDay()
  getUserBMI()
  getTodayDietRecord() // 加载今日饮食记录
  getWaterRecord() // 加载今日饮水记录
})
// 下拉刷新状态
const isTriggered = ref(false);
// 下拉刷新被触发
const onRefresherrefresh = async () => {
  // console.log("下拉刷新被触发")
  // 打开下拉刷新动画
  isTriggered.value = true;
  await Promise.all([
    getNextCheckDay(),
    Promise.resolve(getUserBMI()),
    getTodayDietRecord(),
    getWaterRecord()
  ]);
  // 关闭下拉刷新动画
  isTriggered.value = false;
  
}
</script>

<template>
  <view class="page-container">
    <!-- 滚动容器 -->
    <scroll-view scroll-y class="scroll-container" refresher-enabled @refresherrefresh="onRefresherrefresh"
      :refresher-triggered="isTriggered">
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
      </view> <!-- 今日健康打卡 -->
      <uni-card title="今日健康打卡" :padding="false" class="custom-card">
        <view class="card-content">
          <view v-for="record in dietRecords" :key="record.id" class="dish-item">
            <view class="dish-info">
              <view class="dish-title">{{ getMealTypeName(record.mealType) }}</view>
              <view class="dish-desc">{{ record.foodName }}</view>
              <view class="dish-desc">
                {{ record.time }}
                <template v-if="record.weight">| {{ record.weight }}g</template>
                <template v-if="record.calories">| {{ record.calories }}kcal</template>
              </view>
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

      <!-- 今日饮水 -->
      <uni-card title="今日饮水" :padding="false" class="custom-card">
        <view class="card-content">
          <view class="dish-item">
            <view class="dish-info" v-for="(record, index) in waterRecords" :key="index">
              <view class="dish-title">饮水</view>
              <view class="dish-desc">{{ record.capacity }}</view>
              <view class="dish-desc">{{ record.time }}</view>
            </view>
          </view>
          <view class="btn-container">
            <button class="custom-btn" @tap="addWaterRecord">添加饮水记录</button>
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


    </scroll-view>
    <!-- 悬浮拍照按钮 -->
    <view class="float-button" @tap="openCamera">
      <image src="@/static/icon/camera.png" class="camera-icon"></image>
    </view>

    <!-- 添加饮食记录弹窗 -->
    <view v-if="showDietModal" class="modal-overlay" @tap="cancelDietRecord">
      <view class="modal-container" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">添加饮食记录</text>
          <text class="modal-close" @tap="cancelDietRecord">×</text>
        </view>

        <view class="modal-body"> <!-- 餐次选择 -->
          <view class="form-group">
            <text class="form-label">餐次</text>
            <picker :value="dietForm.mealType" :range="mealTypes" @change="onMealTypeChange">
              <view class="picker-item">
                {{ mealTypes[dietForm.mealType] }}
                <text class="picker-arrow">▼</text>
              </view>
            </picker>
          </view>

          <!-- 食物名称 -->
          <view class="form-group">
            <text class="form-label">食物名称</text>
            <input v-model="dietForm.foodName" class="form-input" placeholder="请输入食物名称" maxlength="50" />
          </view>

          <!-- 卡路里 -->
          <view class="form-group">
            <text class="form-label">卡路里</text>
            <input v-model="dietForm.calories" class="form-input" type="number" placeholder="留空则智能分析" />
          </view>
          <!-- 食物重量 -->
          <view class="form-group">
            <text class="form-label">食物重量</text>
            <input v-model="dietForm.weight" class="form-input" type="number" placeholder="请填写食物重量(g)" />
          </view>

          <!-- 时间 -->
          <view class="form-group">
            <text class="form-label">时间</text>
            <picker mode="time" :value="dietForm.time" @change="onTimeChange">
              <view class="picker-item">
                {{ dietForm.time || '选择时间' }}
                <text class="picker-arrow">▼</text>
              </view>
            </picker>
          </view>
        </view>
        <view class="modal-footer">
          <button class="cancel-btn" @tap="cancelDietRecord">取消</button>
          <button class="confirm-btn" @tap="saveDietRecord">保存</button>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.camera-icon {
  max-width: 100%;
  max-height: 100%;
}

.page-container {
  background-color: #f5f5f5;
  height: 100vh;
  overflow: hidden;
}
.scroll-container {
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
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

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
  /* 确保覆盖层在最上层 */
  backdrop-filter: blur(2px);
}

.modal-container {
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  min-height: 400px;
  max-height: calc(100vh - 40px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.modal-close {
  font-size: 24px;
  color: #999;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.modal-close:active {
  background-color: #f0f0f0;
}

.modal-body {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background-color: #fafafa;
  box-sizing: border-box;
  height: 48px;
  line-height: 24px;
  /* 防止iOS缩放 */
  -webkit-appearance: none;
  appearance: none;
  /* 确保输入框有统一的高度 */
  display: flex;
  align-items: center;
}

.form-input:focus {
  border-color: #4CAF50;
  background-color: white;
  outline: none;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

/* 数字输入框特殊处理 */
.form-input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

.form-input[type="number"]::-webkit-outer-spin-button,
.form-input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.picker-item {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fafafa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  height: 48px;
  box-sizing: border-box;
  line-height: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.picker-item:active {
  background-color: #e8f5e8;
  border-color: #4CAF50;
}

.picker-arrow {
  color: #999;
  font-size: 12px;
}

.modal-footer {
  padding: 16px 20px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  border-top: 1px solid #eee;
  display: flex;
  gap: 12px;
  flex-shrink: 0;
  background-color: white;
  position: sticky;
  bottom: 0;
}

.cancel-btn {
  flex: 1;
  padding: 14px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  color: #666;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 重置按钮默认样式 */
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  cursor: pointer;
  user-select: none;
  /* 防止双击缩放 */
  touch-action: manipulation;
}

.cancel-btn:active {
  background-color: #f5f5f5;
  transform: scale(0.98);
}

.confirm-btn {
  flex: 1;
  padding: 14px 0;
  border: none;
  border-radius: 8px;
  background-color: #4CAF50;
  color: white;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 重置按钮默认样式 */
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  cursor: pointer;
  user-select: none;
  /* 防止双击缩放 */
  touch-action: manipulation;
}

.confirm-btn:active {
  background-color: #45a049;
  transform: scale(0.98);
}

/* 响应式设计 - 小屏设备适配 */
@media screen and (max-height: 600px) {
  .modal-container {
    min-height: auto;
    max-height: calc(100vh - 20px);
  }

  .modal-body {
    padding: 15px 20px;
  }

  .form-group {
    margin-bottom: 15px;
  }
}

/* 超小屏设备适配 */
@media screen and (max-height: 500px) {
  .modal-overlay {
    padding: 10px;
  }

  .modal-container {
    max-height: calc(100vh - 20px);
  }

  .modal-header {
    padding: 15px 20px;
  }

  .modal-body {
    padding: 10px 20px;
  }

  .modal-footer {
    padding: 12px 20px;
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
  }
}

/* iPhone SE 等窄屏设备适配 */
@media screen and (max-width: 320px) {
  .modal-overlay {
    padding: 15px;
  }

  .modal-container {
    max-width: 100%;
  }

  .form-input,
  .picker-item {
    font-size: 14px;
    padding: 10px 12px;
    height: 44px;
  }

  .cancel-btn,
  .confirm-btn {
    font-size: 14px;
    min-height: 40px;
  }
}

/* 全局按钮样式重置 - 确保按钮在所有设备上正常显示 */
button {
  border: none;
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: none;
  cursor: pointer;
  touch-action: manipulation;
  user-select: none;
}

/* 防止iOS Safari的按钮样式重置 */
input[type="button"],
input[type="submit"],
input[type="reset"],
button {
  -webkit-appearance: none;
  appearance: none;
  border-radius: 0;
}
</style>