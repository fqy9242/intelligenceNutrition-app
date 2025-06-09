<!-- 添加记录弹窗组件 -->
<template>
  <!-- 添加饮食记录弹窗 -->
  <view v-if="show && type === 'diet'" class="modal-overlay" @tap="$emit('cancel')">
    <view class="modal-container" @tap.stop>
      <view class="modal-header">
        <text class="modal-title">添加饮食记录</text>
        <text class="modal-close" @tap="$emit('cancel')">×</text>
      </view>

      <view class="modal-body">
        <!-- 餐次选择 -->
        <view class="form-group">
          <text class="form-label">餐次</text>
          <picker :value="formData.mealType" :range="mealTypes" @change="onMealTypeChange">
            <view class="picker-item">
              {{ mealTypes[formData.mealType] }}
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>

        <!-- 食物名称 -->
        <view class="form-group">
          <text class="form-label">食物名称</text>
          <input v-model="formData.foodName" class="form-input" placeholder="请输入食物名称" maxlength="50" />
        </view>

        <!-- 卡路里 -->
        <view class="form-group">
          <text class="form-label">卡路里</text>
          <input v-model="formData.calories" class="form-input" type="number" placeholder="留空则智能分析" />
        </view>

        <!-- 食物重量 -->
        <view class="form-group">
          <text class="form-label">食物重量</text>
          <input v-model="formData.weight" class="form-input" type="number" placeholder="请填写食物重量(g)" />
        </view>

        <!-- 时间 -->
        <view class="form-group">
          <text class="form-label">时间</text>
          <picker mode="time" :value="formData.time" @change="onTimeChange">
            <view class="picker-item">
              {{ formData.time || '选择时间' }}
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>
      </view>

      <view class="modal-footer">
        <button class="cancel-btn" @tap="$emit('cancel')">取消</button>
        <button class="confirm-btn" @tap="$emit('confirm', formData)">保存</button>
      </view>
    </view>
  </view>

  <!-- 添加饮水记录弹窗 -->
  <view v-if="show && type === 'water'" class="modal-overlay" @tap="$emit('cancel')">
    <view class="modal-container" @tap.stop>
      <view class="modal-header">
        <text class="modal-title">添加饮水记录</text>
        <text class="modal-close" @tap="$emit('cancel')">×</text>
      </view>

      <view class="modal-body">
        <!-- 饮水容量 -->
        <view class="form-group">
          <text class="form-label">饮水容量</text>
          <input v-model="formData.capacity" class="form-input" type="number" placeholder="请输入饮水容量(ml)" />
        </view>

        <!-- 时间 -->
        <view class="form-group">
          <text class="form-label">时间</text>
          <picker mode="time" :value="formData.time" @change="onTimeChange">
            <view class="picker-item">
              {{ formData.time || '选择时间' }}
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>
      </view>

      <view class="modal-footer">
        <button class="cancel-btn" @tap="$emit('cancel')">取消</button>
        <button class="confirm-btn" @tap="$emit('confirm', formData)">保存</button>
      </view>
    </view>
  </view>

  <!-- 添加运动记录弹窗 -->
  <view v-if="show && type === 'sport'" class="modal-overlay" @tap="$emit('cancel')">
    <view class="modal-container" @tap.stop>
      <view class="modal-header">
        <text class="modal-title">添加运动记录</text>
        <text class="modal-close" @tap="$emit('cancel')">×</text>
      </view>

      <view class="modal-body">
        <!-- 运动名称 -->
        <view class="form-group">
          <text class="form-label">运动名称</text>
          <picker mode="selector" :range="sportTypes" @change="onSportNameChange">
            <view class="picker-item">
              {{ showCustomSportName ? '其他' : (formData.sportName || '选择运动类型') }}
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>

        <!-- 自定义运动名称输入框 -->
        <view v-if="showCustomSportName" class="form-group">
          <text class="form-label">请输入运动名称</text>
          <input v-model="formData.sportName" class="form-input" placeholder="请输入具体的运动名称" maxlength="20" />
        </view>

        <!-- 运动时长 -->
        <view class="form-group">
          <text class="form-label">运动时长</text>
          <input v-model="formData.duration" class="form-input" type="number" placeholder="请输入运动时长(分钟)" />
        </view>

        <!-- 消耗卡路里 -->
        <view class="form-group">
          <text class="form-label">消耗卡路里</text>
          <input v-model="formData.consumeCalorie" class="form-input" type="number" placeholder="选填，可留空" />
        </view>

        <!-- 时间 -->
        <view class="form-group">
          <text class="form-label">运动时间</text>
          <picker mode="time" :value="formData.time" @change="onTimeChange">
            <view class="picker-item">
              {{ formData.time || '选择时间' }}
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>
      </view>

      <view class="modal-footer">
        <button class="cancel-btn" @tap="$emit('cancel')">取消</button>
        <button class="confirm-btn" @tap="$emit('confirm', formData)">保存</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'diet' // diet, water, sport
  },
  formData: {
    type: Object,
    default: () => ({})
  }
})

defineEmits(['cancel', 'confirm'])

// 餐次选项
const mealTypes = ['早餐', '午餐', '晚餐', '加餐']

// 运动类型选项
const sportTypes = [
  '跑步', '快走', '慢跑', '游泳', '骑自行车', 
  '健身房训练', '瑜伽', '普拉提', '跳舞', '篮球',
  '足球', '羽毛球', '乒乓球', '网球', '爬山',
  '登山', '徒步', '跳绳', '仰卧起坐', '俯卧撑',
  '举重', '拳击', '武术', '太极', '广场舞',
  '健美操', '椭圆机', '跑步机', '动感单车', '其他'
]

// 是否显示自定义运动名称输入框
const showCustomSportName = ref(false)

// 餐次选择事件
const onMealTypeChange = (e) => {
  props.formData.mealType = parseInt(e.detail.value)
}

// 时间选择事件
const onTimeChange = (e) => {
  props.formData.time = e.detail.value
}

// 运动名称选择事件
const onSportNameChange = (e) => {
  const selectedIndex = e.detail.value
  const selectedSport = sportTypes[selectedIndex]
  
  if (selectedSport === '其他') {
    showCustomSportName.value = true
    props.formData.sportName = '' // 清空运动名称，让用户自己输入
  } else {
    showCustomSportName.value = false
    props.formData.sportName = selectedSport
  }
}

// 监听弹窗关闭，重置自定义输入状态
watch(() => props.show, (newVal) => {
  if (!newVal) {
    showCustomSportName.value = false
  }
})
</script>

<style scoped>
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
