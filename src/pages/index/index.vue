<!-- Author: qht -->
<!-- Date: 2025-05-07 -->
<script setup>
import { ref } from 'vue';

const BMI = ref(21.5);
const recommendedCalories = ref(1800);
</script>

<template>
  <view>
    <view class="card-container">
      <uni-card :title="BMI" class="half-width-card">
        <text class="index-name">BMI指数</text>
      </uni-card>
      <uni-card :title="recommendedCalories" class="half-width-card">
        <text class="index-name">今日推荐摄入(kcal)</text>
      </uni-card>
    </view>
  </view>
</template>

<style scoped>
.index-name {
  
}
</style>