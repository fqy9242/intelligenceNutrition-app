<!-- Author: qht -->
<!-- Date: 2025-05-07 -->
<script setup>
// App全局脚本
</script>

<template>
  <!-- App.vue 通常不需要模板内容 -->
</template>

<style>
/* 全局样式 */
page {
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: #333;
}

/* 定义一些全局变量 */
:root {
  --primary-color: #4CAF50;
  --secondary-color: #2196F3;
  --background-color: #f5f5f5;
  --text-color: #333;
  --border-radius: 12px;
}

/* 通用卡片样式 */
.card {
  background: white;
  border-radius: var(--border-radius);
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 通用按钮样式 */
.btn {
  background: var(--primary-color);
  color: white;
  padding: 10px 15px;
  border-radius: 25px;
  border: none;
  font-weight: bold;
  text-align: center;
}

/* 设置统一的文本样式 */
text {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
</style>