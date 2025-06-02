<!-- Author: qht -->
<!-- Date: 2025-05-14 -->
<script setup>
import { ref } from 'vue';
import { getHealthHistoryApi } from '@/apis/user'
import { onLoad } from '@dcloudio/uni-app'
import { getDietRecordApi, getSportRecordApi } from '@/apis/user'

// 饮食记录数据
const dietRecords = ref([])

// 餐次选项
const mealTypes = ['早餐', '午餐', '晚餐', '加餐'];

// 根据数字获取餐次名称
const getMealTypeName = (mealType) => {
  return mealTypes[mealType] || mealTypes[0];
};

// 获取饮食记录
const getDietRecord = async () => {
  try {
    const res = await getDietRecordApi(uni.getStorageSync('userInfo').studentNumber, 0);
    const records = [];
    const data = res.data;

    // 检查数据是否为数组
    if (Array.isArray(data)) {
      // 处理新格式的数据：数组形式的食物记录
      data.forEach(item => {
        const record = {
          id: item.id,
          mealType: item.mealType,
          foodName: item.foodName,
          weight: item.foodWeight,
          calories: item.foodCalorie,
          protein: item.foodProtein,
          dietaryFiber: item.foodDietaryFiber,
          fat: item.foodFat,
          carbohydrate: item.foodCarbohydrate,
          time: new Date(item.createTime).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }),
          date: new Date(item.createTime).toLocaleDateString('zh-CN')
        };
        records.push(record);
      });

      // 按时间排序（最新的在前面）
      records.sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));
    } else {
      // 兼容旧格式数据（如果后端还可能返回旧格式）
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
          }),
          date: new Date(data.breakfast.mealTime).toLocaleDateString('zh-CN')
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
          }),
          date: new Date(data.lunch.mealTime).toLocaleDateString('zh-CN')
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
          }),
          date: new Date(data.dinner.mealTime).toLocaleDateString('zh-CN')
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
          }),
          date: new Date(data.other.mealTime).toLocaleDateString('zh-CN')
        });
      }
    }

    // 更新饮食记录列表
    dietRecords.value = records;
    console.log('处理后的饮食记录:', dietRecords.value);
  } catch (error) {
    console.error('获取饮食记录失败:', error);
    dietRecords.value = [];
  }
};

// 运动记录数据
const exerciseRecords = ref([]);

// 获取运动记录
const getSportRecord = async () => {
  try {
    const res = await getSportRecordApi(uni.getStorageSync('userInfo').studentNumber, 0);
    const records = [];
    const data = res.data;

    // 检查数据是否为数组
    if (Array.isArray(data)) {
      // 处理运动记录数据
      data.forEach(item => {
        const record = {
          id: item.id,
          type: item.sportName,
          duration: item.duration,
          calories: item.consumeCalorie,
          exerciseTime: item.exerciseTime,
          time: new Date(item.createTime).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }),
          date: new Date(item.createTime).toLocaleDateString('zh-CN')
        };
        records.push(record);
      });

      // 按时间排序（最新的在前面）
      records.sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));
    }

    // 更新运动记录列表
    exerciseRecords.value = records;
    console.log('处理后的运动记录:', exerciseRecords.value);
  } catch (error) {
    console.error('获取运动记录失败:', error);
    exerciseRecords.value = [];
  }
};

// 健康数据记录
const healthDataRecords = ref([]);

// 获取健康数据记录
const getHealthHistory = async () => {
  try {
    const res = await getHealthHistoryApi(uni.getStorageSync('userInfo').studentNumber);
    
    // 格式化健康数据记录
    if (res.data && Array.isArray(res.data)) {
      healthDataRecords.value = res.data.map(record => {
        let formattedDate = '未知日期';
        
        // 尝试多种日期格式化方式
        try {
          if (record.createTime) {
            const date = new Date(record.createTime);
            // 检查日期是否有效
            if (!isNaN(date.getTime())) {
              formattedDate = date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              });
            } else {
              // 如果直接解析失败，尝试其他方式
              console.warn('日期解析失败，原始值:', record.createTime);
              // 如果是字符串格式的日期，尝试截取前10位
              const dateStr = String(record.createTime);
              if (dateStr.length >= 10) {
                formattedDate = dateStr.substring(0, 10).replace(/-/g, '/');
              } else {
                formattedDate = '未知日期';
              }
            }
          } else {
            formattedDate = '未设置日期';
          }
        } catch (dateError) {
          console.error('日期格式化错误:', dateError);
          formattedDate = '日期格式错误';
        }
        
        return {
          ...record,
          date: formattedDate
        };
      });
    }
    
    console.log('健康数据记录 API 响应:', res.data);
    console.log('格式化后的健康数据记录:', healthDataRecords.value);
  } catch (error) {
    console.error('获取健康数据记录失败:', error);
  }
};
onLoad(() => {
  getHealthHistory()
  getDietRecord()
  getSportRecord()
})
</script>

<template>
  <view class="page-container">
    <!-- 饮食记录 -->
    <uni-card title="饮食记录" :padding="false" class="custom-card">
      <view class="card-content">
        <view v-if="dietRecords.length === 0" class="empty-message">
          <text>暂无饮食记录</text>
        </view>
        <scroll-view v-else scroll-y="true" class="diet-scroll-view">
          <view v-for="record in dietRecords" :key="record.id" class="record-item">
            <view class="dish-info">
              <view class="dish-title">{{ getMealTypeName(record.mealType) }}</view>
              <view class="dish-desc">{{ record.foodName }}</view>
              <view class="dish-desc">
                {{ record.time }}
                <template v-if="record.weight"> | {{ record.weight }}g</template>
                <template v-if="record.calories"> | {{ record.calories }}kcal</template>
              </view>
              <view v-if="record.protein || record.fat || record.carbohydrate || record.dietaryFiber" class="dish-desc">
                <template v-if="record.protein">蛋白质：{{ record.protein }}g</template>
                <template v-if="record.protein && record.fat"> | </template>
                <template v-if="record.fat">脂肪：{{ record.fat }}g</template>
                <template v-if="(record.protein || record.fat) && record.carbohydrate"> | </template>
                <template v-if="record.carbohydrate">碳水：{{ record.carbohydrate }}g</template>
                <template v-if="(record.protein || record.fat || record.carbohydrate) && record.dietaryFiber"> | </template>
                <template v-if="record.dietaryFiber">膳食纤维：{{ record.dietaryFiber }}g</template>
              </view>
              <view class="dish-desc date-info">{{ record.date }}</view>
            </view>
          </view>
        </scroll-view>
      </view>
    </uni-card>

    <!-- 运动记录 -->
    <uni-card title="运动记录" :padding="false" class="custom-card">
      <view class="card-content">
        <view v-if="exerciseRecords.length === 0" class="empty-message">
          <text>暂无运动记录</text>
        </view>
        <scroll-view v-else scroll-y="true" class="sport-scroll-view">
          <view v-for="(record, index) in exerciseRecords" :key="record.id || index" class="record-item">
            <view class="dish-info">
              <view class="dish-title">{{ record.type }}</view>
              <view class="dish-desc">
                {{ record.time }}
                <template v-if="record.duration"> | 时长：{{ record.duration }}分钟</template>
                <template v-if="record.calories"> | 消耗：{{ record.calories }}kcal</template>
              </view>
              <view class="dish-desc date-info">{{ record.date }}</view>
            </view>
          </view>
        </scroll-view>
      </view>
    </uni-card>

    <!-- 健康数据记录 -->
    <uni-card title="健康数据记录" :padding="false" class="custom-card">
      <view class="card-content">
        <view v-if="healthDataRecords.length === 0" class="empty-message">
          <text>暂无健康数据记录</text>
        </view>
        <view v-for="(record, index) in healthDataRecords" :key="index" class="record-item">
          <view class="dish-info">
            <view class="dish-title">健康体检记录</view>
            <view class="dish-desc">
              <template v-if="record.weight">体重：{{ record.weight }}kg</template>
              <template v-if="record.weight && record.height"> | </template>
              <template v-if="record.height">身高：{{ record.height }}cm</template>
              <template v-if="(record.weight || record.height) && record.bmi"> | </template>
              <template v-if="record.bmi">BMI：{{ record.bmi }}</template>
            </view>
            <view v-if="record.bloodPressure || record.heartRate" class="dish-desc">
              <template v-if="record.bloodPressure">血压：{{ record.bloodPressure }}</template>
              <template v-if="record.bloodPressure && record.heartRate"> | </template>
              <template v-if="record.heartRate">心率：{{ record.heartRate }}bpm</template>
            </view>
            <view class="dish-desc date-info">{{ record.date }}</view>
          </view>
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

.diet-scroll-view {
  max-height: 400px;
  height: auto;
}

.sport-scroll-view {
  max-height: 300px;
  height: auto;
}

.card-content {
  padding: 0 10px;
}

.record-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.record-item:last-child {
  border-bottom: none;
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

.date-info {
  color: #999;
  font-size: 12px;
  font-style: italic;
}

.empty-message {
  text-align: center;
  padding: 30px 15px;
  color: #999;
  font-size: 14px;
}
</style>