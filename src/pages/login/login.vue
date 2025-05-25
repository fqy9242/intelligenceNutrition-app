<!-- Author: qht -->
<!-- Date: 2025-05-07 -->
<script setup>
import { ref, reactive } from 'vue'
import { loginApi } from '@/apis/user'
// 登录表单数据
const loginForm = reactive({
    studentNumber: '',
    password: ''
});

// 错误信息
const errorMessage = ref('');

// 表单验证
const validateForm = () => {
    if (!loginForm.studentNumber) {
        errorMessage.value = '请输入用户名';
        return false;
    }
    if (!loginForm.password) {
        errorMessage.value = '请输入密码';
        return false;
    }
    return true;
};

// 登录处理函数
const handleLogin = async ()  => {
    errorMessage.value = '';

    if (!validateForm()) {
        return;
    }


    uni.showLoading({
        title: '登录中...'
    });
    const res = await loginApi(loginForm);
    uni.hideLoading();
    if (res.code === 200) {
        // 登录成功， 保存用户信息
        uni.setStorageSync('token', res.data.token);
        uni.setStorageSync('userInfo', {
            id: res.data.id,
            name: res.data.name,
            avatar: res.data.avatar,
            studentNumber: res.data.studentNumber,
            height: res.data.height,
            weight: res.data.weight,
            allergen: res.data.allergen,
            countThisWeekSport: res.data.countThisWeekSport,
            countHealthCheckIn: res.data.countHealthCheckIn,
            bmi: res.data.bmi
        });
        uni.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000
        });

        // 登录成功后跳转到首页
        setTimeout(() => {
            uni.switchTab({
                url: '/pages/index/index'
            });
        }, 1500);
    } else {
        // 登录失败
        errorMessage.value = res.message || '登录失败，请重试';
    }

}
    
</script>

<template>
    <view class="login-container">
        <view class="login-header">
            <image class="logo" src="/static/logo.png" mode="aspectFit"></image>
            <text class="app-name">智能营养助手</text>
            <text class="app-slogan">您的健康膳食伙伴</text>
        </view>

        <view class="login-form">
            <view class="form-item">
                <text class="label">用户名</text>
                <input class="input" type="text" v-model="loginForm.studentNumber" placeholder="请输入用户名" />
            </view>

            <view class="form-item">
                <text class="label">密码</text>
                <input class="input" type="password" v-model="loginForm.password" placeholder="请输入密码" password />
            </view>

            <text v-if="errorMessage" class="error-message">{{ errorMessage }}</text>

            <button class="login-button" @tap="handleLogin">登录</button>

            <view class="other-options">
                <text class="option-link" @tap="goToRegister">注册新账号</text>
                <text class="option-link">忘记密码？</text>
            </view>
        </view>

        <view class="login-footer">
            <text class="copyright">© 2025 智能营养助手 版权所有</text>
        </view>
    </view>
</template>

<style scoped>
.login-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding: 40px 30px;
    background-color: #f9f9f9;
}

.login-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 40px;
    margin-top: 40px;
}

.logo {
    width: 80px;
    height: 80px;
    margin-bottom: 15px;
}

.app-name {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
}

.app-slogan {
    font-size: 14px;
    color: #666;
}

.login-form {
    width: 100%;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.form-item {
    margin-bottom: 20px;
}

.label {
    display: block;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 8px;
    color: #333;
}

.input {
    width: 100%;
    height: 45px;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 0 15px;
    font-size: 14px;
    background-color: #f5f7fa;
}

.error-message {
    display: block;
    color: #ff4d4f;
    font-size: 12px;
    margin-bottom: 15px;
}

.login-button {
    width: 100%;
    height: 45px;
    line-height: 45px;
    background-color: #007aff;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    border-radius: 5px;
    text-align: center;
    margin: 10px 0 20px 0;
}

.other-options {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
}

.option-link {
    font-size: 14px;
    color: #007aff;
}

.login-footer {
    margin-top: auto;
    text-align: center;
}

.copyright {
    font-size: 12px;
    color: #999;
}
</style>