<!-- 食物识别弹窗组件 -->
<template>
  <view v-if="show" class="modal-overlay" @tap="$emit('close')">
    <view class="modal-container" @tap.stop>
      <view class="modal-header">
        <text class="modal-title">食物识别结果</text>
        <text class="modal-close" @tap="$emit('close')">×</text>
      </view>

      <view class="modal-body">
        <!-- 识别的食物图片 -->
        <view class="image-preview">
          <image :src="recognizedImage" mode="aspect-fill" class="food-image"></image>
        </view>

        <!-- 识别的食物信息 -->
        <view class="food-info">
          <view class="info-item">
            <text class="info-label">食物名称:</text>
            <text class="info-value">{{ recognitionResult.name }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">卡路里:</text>
            <text class="info-value">{{ recognitionResult.calories }}</text>
          </view>
          <view class="info-item" v-for="(nutrient, index) in recognitionResult.nutrients" :key="index">
            <text class="info-label">{{ nutrient.name }}:</text>
            <text class="info-value">{{ nutrient.value }}</text>
          </view>
          <view class="info-item" v-if="recognitionResult.stars > 0">
            <text class="info-label">推荐指数:</text>
            <text class="info-value">{{ '⭐'.repeat(recognitionResult.stars) }}</text>
          </view>
          <view class="info-item" v-if="recognitionResult.suitablePeople">
            <text class="info-label">适合人群:</text>
            <text class="info-value">{{ recognitionResult.suitablePeople }}</text>
          </view>
        </view>

        <!-- 餐次选择 -->
        <view class="form-group">
          <text class="form-label">餐次</text>
          <picker :value="selectedMealType" :range="mealTypes2" range-key="label" @change="onMealTypeChange">
            <view class="picker-item">
              {{ mealTypes2[selectedMealType].label }}
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>

        <!-- 食物重量 -->
        <view class="form-group">
          <text class="form-label">食物重量</text>
          <input v-model="foodWeight" class="form-input" type="number" placeholder="请填写食物重量(g)" />
        </view>
      </view>

      <view class="modal-footer">
        <button class="cancel-btn" @tap="$emit('close')">关闭</button>
        <button class="confirm-btn" @tap="addToDiet">添加到今日饮食</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  recognizedImage: {
    type: String,
    default: ''
  },
  recognitionResult: {
    type: Object,
    default: () => ({
      name: '',
      calories: '',
      nutrients: [],
      stars: 0,
      suitablePeople: ''
    })
  }
})

const emit = defineEmits(['close', 'add-to-diet'])

// 餐次类型
const mealTypes2 = [
  { label: '早餐', value: 0 },
  { label: '午餐', value: 1 },
  { label: '晚餐', value: 2 },
  { label: '加餐', value: 3 }
]

// 自动获取当前时间对应的餐次类型
const getAutoMealType = () => {
  const now = new Date()
  const hour = now.getHours()

  // 根据时间自动判断餐次
  if (hour >= 6 && hour < 11) {
    return 0 // 早餐 (6:00-10:59)
  } else if (hour >= 11 && hour < 15) {
    return 1 // 午餐 (11:00-14:59)
  } else if (hour >= 17 && hour < 21) {
    return 2 // 晚餐 (17:00-20:59)
  } else {
    return 3 // 加餐 (其他时间)
  }
}

// 选中的餐次 - 默认根据当前时间自动选择
const selectedMealType = ref(getAutoMealType())

// 食物重量
const foodWeight = ref(100) // 默认100g

// 餐次选择事件
const onMealTypeChange = (e) => {
  selectedMealType.value = e.detail.value
}

// 添加到饮食记录
const addToDiet = () => {
  emit('add-to-diet', {
    mealType: mealTypes2[selectedMealType.value].value,
    foodWeight: foodWeight.value,
    recognitionResult: props.recognitionResult
  })
}
</script>

<style scoped>
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

.image-preview {
  width: 100%;
  height: 150px;
  background-color: #eee;
  border-radius: 8px;
  margin-bottom: 15px;
  overflow: hidden;
}

.food-image {
  width: 100%;
  height: 100%;
}

.food-info {
  margin-bottom: 15px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: bold;
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
  -webkit-appearance: none;
  appearance: none;
  display: flex;
  align-items: center;
}

.form-input:focus {
  border-color: #4CAF50;
  background-color: white;
  outline: none;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
}

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
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  cursor: pointer;
  user-select: none;
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
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  cursor: pointer;
  user-select: none;
  touch-action: manipulation;
}

.confirm-btn:active {
  background-color: #45a049;
  transform: scale(0.98);
}

/* 响应式适配 */
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

input[type="button"],
input[type="submit"],
input[type="reset"],
button {
  -webkit-appearance: none;
  appearance: none;
  border-radius: 0;
}
</style>
