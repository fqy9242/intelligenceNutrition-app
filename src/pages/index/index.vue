<!-- Author: qht -->
<!-- Date: 2025-05-07 -->
<script setup>
import { computed, ref } from 'vue';
import { RecognizeFoodApi } from '@/apis/ai';
import {
  getNextCheckPlanApi, addDietRecordApi, getDietRecordApi,
  getWaterRecordApi, addWaterRecordApi, getSportRecordApi, addSportRecordApi,
  getTodayRecommendIntakeApi
} from '@/apis/user'
import { onLoad } from '@dcloudio/uni-app';
import HealthStats from '@/components/HealthStats.vue';
import DietRecord from '@/components/DietRecord.vue';
import SportRecord from '@/components/SportRecord.vue';
import WaterRecord from '@/components/WaterRecord.vue';
import HealthReminder from '@/components/HealthReminder.vue';
import RecordModal from '@/components/RecordModal.vue';
import FoodRecognitionModal from '@/components/FoodRecognitionModal.vue';

// 用户健康数据
const recommendedCalories = ref('--');
const BMI = ref('--');
const calorieIsStandard = ref(true);
const nextCheckDay = ref('');

// 记录数据
const dietRecords = ref([]);
const waterRecords = ref([]);
const sportRecords = ref([]);

// 弹窗状态
const showModal = ref(false);
const modalType = ref('diet'); // diet, water, sport
const modalFormData = ref({
  mealType: 0,
  foodName: '',
  calories: '',
  weight: '',
  time: '',
  capacity: '',
  sportName: '',
  duration: '',
  consumeCalorie: ''
});

// 食物识别弹窗
const showFoodModal = ref(false);
const recognizedImage = ref('');
const recognitionResult = ref({
  name: '',
  calories: '',
  nutrients: [],
  stars: 0,
  suitablePeople: ''
});

// 下拉刷新状态
const isTriggered = ref(false);

// 获取下次体检时间
const getNextCheckDay = async () => {
  const res = await getNextCheckPlanApi()
  nextCheckDay.value = !res.data.physicalExaminationTime ? '暂无体检计划' :
    Math.ceil((new Date(res.data.physicalExaminationTime).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
}

// 获取BMI数据
const getUserBMI = () => {
  const userInfo = uni.getStorageSync('userInfo');
  if (userInfo && userInfo.bmi) {
    BMI.value = userInfo.bmi;
  }
}

// 获取今日推荐摄入量
const getTodayRecommendIntake = async () => {
  const res = await getTodayRecommendIntakeApi(uni.getStorageSync('userInfo').studentNumber)
  recommendedCalories.value = res.data.recommendValue || '--'
  calorieIsStandard.value = res.data.recommendValue < res.data.todayCalorie
}

// 格式化时间为 HH:MM 格式的通用函数
const formatTimeOnly = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  if (isNaN(date.getTime())) {
    return dateTimeString;
  }
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

// 获取学生饮食记录
const getDietRecord = async () => {
  const res = await getDietRecordApi(uni.getStorageSync('userInfo').studentNumber, 1);
  const records = [];
  const data = res.data;

  // 处理早餐数据
  if (data.breakfast) {
    records.push({
      id: Date.now() + 1,
      mealType: 0,
      foodName: data.breakfast.foodList.join(' + '),
      weight: data.breakfast.totalWeight,
      calories: data.breakfast.totalCalories,
      time: formatTimeOnly(data.breakfast.mealTime)
    });
  }

  // 处理午餐数据
  if (data.lunch) {
    records.push({
      id: Date.now() + 2,
      mealType: 1,
      foodName: data.lunch.foodList.join(' + '),
      weight: data.lunch.totalWeight,
      calories: data.lunch.totalCalories,
      time: formatTimeOnly(data.lunch.mealTime)
    });
  }

  // 处理晚餐数据
  if (data.dinner) {
    records.push({
      id: Date.now() + 3,
      mealType: 2,
      foodName: data.dinner.foodList.join(' + '),
      weight: data.dinner.totalWeight,
      calories: data.dinner.totalCalories,
      time: formatTimeOnly(data.dinner.mealTime)
    });
  }

  // 处理加餐数据
  if (data.other) {
    records.push({
      id: Date.now() + 4,
      mealType: 3,
      foodName: data.other.foodList.join(' + '),
      weight: data.other.totalWeight,
      calories: data.other.totalCalories,
      time: formatTimeOnly(data.other.mealTime)
    });
  }

  dietRecords.value = records;
}

// 获取今天的饮水记录
const getWaterRecord = async () => {
  const res = await getWaterRecordApi(uni.getStorageSync('userInfo').studentNumber, 1);
  waterRecords.value = res.data
}

// 获取今天的运动记录
const getSportRecord = async () => {
  const res = await getSportRecordApi(uni.getStorageSync('userInfo').studentNumber, 1);
  sportRecords.value = res.data
}

// 计算今日总饮水量
const totalWaterIntake = computed(() => {
  return waterRecords.value.reduce((total, record) => {
    const capacity = parseInt(record.capacity);
    return total + (isNaN(capacity) ? 0 : capacity);
  }, 0);
});

// 设置默认时间
const setDefaultTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// 重置表单数据
const resetFormData = () => {
  modalFormData.value = {
    mealType: 0,
    foodName: '',
    calories: '',
    weight: '',
    time: '',
    capacity: '',
    sportName: '',
    duration: '',
    consumeCalorie: ''
  };
}

// 添加记录事件处理
const handleAddDietRecord = () => {
  resetFormData();
  modalFormData.value.time = setDefaultTime();
  modalType.value = 'diet';
  showModal.value = true;
}

const handleAddWaterRecord = () => {
  resetFormData();
  modalFormData.value.time = setDefaultTime();
  modalType.value = 'water';
  showModal.value = true;
}

const handleAddSportRecord = () => {
  resetFormData();
  modalFormData.value.time = setDefaultTime();
  modalType.value = 'sport';
  showModal.value = true;
}

// 取消弹窗
const handleModalCancel = () => {
  showModal.value = false;
  resetFormData();
}

// 构造完整的日期时间字符串
const buildDateTime = (timeStr) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}T${timeStr}:00`;
}

// 保存记录
const handleModalConfirm = async (formData) => {
  if (modalType.value === 'diet') {
    if (!formData.foodName.trim()) {
      uni.showToast({ title: '请输入食物名称', icon: 'none' });
      return;
    }
    if (!formData.weight) {
      uni.showToast({ title: '请输入食物重量', icon: 'none' });
      return;
    }

    await addDietRecordApi({
      studentNumber: uni.getStorageSync('userInfo').studentNumber,
      mealType: formData.mealType,
      foodName: formData.foodName,
      foodWeight: formData.weight,
      foodCalorie: formData.calories,
      createTime: buildDateTime(formData.time)
    });

    getDietRecord();
  }
  else if (modalType.value === 'water') {
    if (!formData.capacity) {
      uni.showToast({ title: '请输入饮水容量', icon: 'none' });
      return;
    }

    await addWaterRecordApi({
      studentNumber: uni.getStorageSync('userInfo').studentNumber,
      capacity: `${formData.capacity}ml`,
      drinkingTime: buildDateTime(formData.time)
    });

    getWaterRecord();
  }
  else if (modalType.value === 'sport') {
    if (!formData.sportName.trim()) {
      uni.showToast({ title: '请选择运动类型', icon: 'none' });
      return;
    }
    if (!formData.duration) {
      uni.showToast({ title: '请输入运动时长', icon: 'none' });
      return;
    }

    await addSportRecordApi({
      studentNumber: uni.getStorageSync('userInfo').studentNumber,
      sportName: formData.sportName,
      duration: formData.duration,
      consumeCalorie: formData.consumeCalorie || null,
      exerciseTime: buildDateTime(formData.time)
    });

    getSportRecord();
  }

  showModal.value = false;
  resetFormData();
  uni.showToast({ title: '添加成功', icon: 'success' });

}


// 格式化识别结果
const formatRecognitionResult = (rawResult) => {
  return {
    name: rawResult?.name || '未知食物',
    calories: rawResult?.calories || '0 kcal',
    nutrients: rawResult?.nutrients || [
      { name: '蛋白质', value: '0g' },
      { name: '脂肪', value: '0g' },
      { name: '碳水化合物', value: '0g' }
    ],
    stars: rawResult?.star || rawResult?.stars || 0,
    suitablePeople: rawResult?.suitablePeople || '一般人群'
  }
}

// 打开相机
const openCamera = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['camera'],
    success: function (res) {
      const tempFilePath = res.tempFilePaths[0];
      uni.showLoading({ title: '识别中...' });

      RecognizeFoodApi(tempFilePath).then(result => {
        uni.hideLoading();

        if (!result || !result.name) {
          uni.showToast({ title: '识别失败，请重试', icon: 'error' });
          return;
        }

        recognizedImage.value = tempFilePath;
        recognitionResult.value = formatRecognitionResult(result);
        showFoodModal.value = true;

        uni.showToast({ title: '识别成功', icon: 'success', duration: 1000 });
      })
    }
  });
};

// 关闭食物识别弹窗
const handleFoodModalClose = () => {
  showFoodModal.value = false;
  recognizedImage.value = '';
  recognitionResult.value = {
    name: '',
    calories: '',
    nutrients: [],
    stars: 0,
    suitablePeople: ''
  };
}

// 添加识别食物到今日饮食
const handleAddRecognizedFood = async (data) => {
  const studentNumber = uni.getStorageSync('studentNumber') || uni.getStorageSync('userInfo')?.studentNumber;

  if (!studentNumber) {
    uni.showToast({ title: '请先登录', icon: 'error' });
    return;
  }

  // 解析营养成分数据
  const parseNutrientValue = (valueStr) => {
    return parseFloat(valueStr.replace(/[^\d.]/g, '')) || 0;
  };

  const dietData = {
    studentNumber: studentNumber,
    mealType: data.mealType,
    foodName: data.recognitionResult.name,
    foodWeight: data.foodWeight,
    foodCalorie: parseNutrientValue(data.recognitionResult.calories),
    foodProtein: parseNutrientValue(data.recognitionResult.nutrients.find(n => n.name === '蛋白质')?.value || '0'),
    foodFat: parseNutrientValue(data.recognitionResult.nutrients.find(n => n.name === '脂肪')?.value || '0'),
    foodCarbohydrate: parseNutrientValue(data.recognitionResult.nutrients.find(n => n.name === '碳水化合物')?.value || '0'),
    foodDietaryFiber: parseNutrientValue(data.recognitionResult.nutrients.find(n => n.name === '膳食纤维')?.value || '0')
  };

  uni.showLoading({ title: '添加中...' });

  await addDietRecordApi(dietData);
  uni.hideLoading();
  uni.showToast({ title: '已添加到今日饮食', icon: 'success' });
  handleFoodModalClose();
  getDietRecord();

}

// 下拉刷新
const onRefresherrefresh = async () => {
  isTriggered.value = true;
  await Promise.all([
    getNextCheckDay(),
    Promise.resolve(getUserBMI()),
    getDietRecord(),
    getWaterRecord(),
    getSportRecord(),
    getTodayRecommendIntake(),
  ]);
  isTriggered.value = false;
}

// 页面加载
onLoad(() => {
  Promise.all([
    getNextCheckDay(),
    Promise.resolve(getUserBMI()),
    getDietRecord(),
    getWaterRecord(),
    getSportRecord(),
    getTodayRecommendIntake(),
  ])
})
</script>

<template>
  <view class="page-container">
    <!-- 滚动容器 -->
    <scroll-view scroll-y class="scroll-container" refresher-enabled @refresherrefresh="onRefresherrefresh"
      :refresher-triggered="isTriggered">

      <!-- 健康统计卡片 -->
      <HealthStats :BMI="BMI" :recommendedCalories="recommendedCalories" :calorieIsStandard="calorieIsStandard" />

      <!-- 今日健康打卡 -->
      <DietRecord :records="dietRecords" @add-record="handleAddDietRecord" />

      <!-- 今日运动 -->
      <SportRecord :records="sportRecords" @add-record="handleAddSportRecord" />

      <!-- 今日饮水 -->
      <WaterRecord :records="waterRecords" @add-record="handleAddWaterRecord" />

      <!-- 健康提醒 -->
      <HealthReminder :totalWaterIntake="totalWaterIntake" :nextCheckDay="nextCheckDay" />

    </scroll-view>

    <!-- 悬浮拍照按钮 -->
    <view class="float-button" @tap="openCamera">
      <image src="@/static/icon/camera.png" class="camera-icon"></image>
    </view>

    <!-- 添加记录弹窗 -->
    <RecordModal :show="showModal" :type="modalType" :formData="modalFormData" @cancel="handleModalCancel"
      @confirm="handleModalConfirm" />

    <!-- 食物识别弹窗 -->
    <FoodRecognitionModal :show="showFoodModal" :recognizedImage="recognizedImage"
      :recognitionResult="recognitionResult" @close="handleFoodModalClose" @add-to-diet="handleAddRecognizedFood" />
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
</style>
