<!-- Author: qht -->
<!-- Date: 2025-05-07 -->
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { loginApi } from '@/apis/user'

// 登录表单数据
const loginForm = reactive({
    studentNumber: '',
    password: ''
});

// 状态管理
const errorMessage = ref('')
const isLoading = ref(false)
const keyboardHeight = ref(0)

// 获取系统信息
const systemInfo = ref({})

onMounted(() => {
    uni.getSystemInfo({
        success: (res) => {
            systemInfo.value = res
        }
    })
})

// 键盘弹起处理
const onKeyboardHeightChange = (e) => {
    keyboardHeight.value = e.height
}

// 表单验证
const validateForm = () => {
    if (!loginForm.studentNumber.trim()) {
        errorMessage.value = '请输入学号/用户名'
        return false
    }
    if (loginForm.studentNumber.trim().length < 3) {
        errorMessage.value = '用户名至少3位字符'
        return false
    }
    if (!loginForm.password) {
        errorMessage.value = '请输入密码'
        return false
    }
    if (loginForm.password.length < 6) {
        errorMessage.value = '密码至少6位字符'
        return false
    }
    return true
};

// 清除错误信息
const clearError = () => {
    if (errorMessage.value) {
        errorMessage.value = ''
    }
}

// 登录处理函数
const handleLogin = async () => {
    clearError()
    if (!validateForm()) {
        return;
    }
    
    isLoading.value = true
    
    try {
        const res = await loginApi({
            studentNumber: loginForm.studentNumber.trim(),
            password: loginForm.password
        })
        
        if (res.code === 200) {
            // 登录成功，保存用户信息
            uni.setStorageSync('token', res.data.token)
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
                duration: 1500
            });

            // 登录成功后跳转到首页
            setTimeout(() => {
                uni.switchTab({
                    url: '/pages/index/index'
                });
            }, 1500);
        } else {
            // 登录失败
            errorMessage.value = res.message || '登录失败，请重试'
        }
    } catch (error) {
        errorMessage.value = '网络错误，请检查网络连接'
        console.error('登录失败:', error)
    } finally {
        isLoading.value = false
    }
}

// 跳转到注册页面
const goToRegister = () => {
    uni.showModal({
        title: '注册新账号',
        content: '请联系管理员进行账号注册',
        showCancel: false
    })
}

// 忘记密码处理
const handleForgetPassword = () => {
    uni.showModal({
        title: '忘记密码',
        content: '请联系管理员重置密码',
        showCancel: false
    })
}
</script>

<template>
    <view class="login-container" :style="{ paddingBottom: keyboardHeight + 'px' }">
        <scroll-view 
            class="scroll-container" 
            scroll-y 
            :keyboard-height="keyboardHeight"
            @keyboardheightchange="onKeyboardHeightChange"
        >
            <view class="login-header">
                <image class="logo" src="/static/logo.png" mode="aspectFit" lazy-load></image>
                <text class="app-name">智能营养助手</text>
                <text class="app-slogan">您的健康膳食伙伴</text>
            </view>

            <view class="login-form">
                <view class="form-item">
                    <text class="label">学号/用户名</text>
                    <input 
                        class="input" 
                        type="text" 
                        v-model="loginForm.studentNumber" 
                        placeholder="请输入学号或用户名" 
                        maxlength="20"
                        adjust-position
                        @input="clearError"
                        @confirm="handleLogin"
                    />
                </view>

                <view class="form-item">
                    <text class="label">密码</text>
                    <input 
                        class="input" 
                        type="password" 
                        v-model="loginForm.password" 
                        placeholder="请输入密码" 
                        password 
                        maxlength="20"
                        adjust-position
                        @input="clearError"
                        @confirm="handleLogin"
                    />
                </view>

                <view v-if="errorMessage" class="error-message">
                    <text class="error-text">{{ errorMessage }}</text>
                </view>

                <button 
                    class="login-button" 
                    :class="{ 'login-button-loading': isLoading }"
                    :disabled="isLoading"
                    @tap="handleLogin"
                >
                    <text v-if="!isLoading">登录</text>
                    <view v-else class="loading-container">
                        <view class="loading-spinner"></view>
                        <text class="loading-text">登录中...</text>
                    </view>
                </button>

                <view class="other-options">
                    <text class="option-link" @tap="goToRegister">注册新账号</text>
                    <text class="option-link" @tap="handleForgetPassword">忘记密码？</text>
                </view>
            </view>
        </scroll-view>
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transition: padding-bottom 0.3s ease;
    box-sizing: border-box;
    width: 100%;
    overflow-x: hidden;
}

.scroll-container {
    flex: 1;
    padding: 40rpx 30rpx 20rpx;
    box-sizing: border-box;
    width: 100%;
}

.login-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 60rpx;
    animation: fadeInDown 0.8s ease-out;
    width: 100%;
}

.logo {
    width: 140rpx;
    height: 140rpx;
    margin-bottom: 20rpx;
    border-radius: 20rpx;
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.app-name {
    font-size: 44rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 12rpx;
    text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
}

.app-slogan {
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.8);
    text-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.3);
}

.login-form {
    background-color: #fff;
    border-radius: 20rpx;
    padding: 40rpx 30rpx;
    box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.1);
    animation: fadeInUp 0.8s ease-out 0.2s both;
    width: 100%;
    box-sizing: border-box;
    margin: 0;
}

.form-item {
    margin-bottom: 32rpx;
    width: 100%;
}

.label {
    display: block;
    font-size: 26rpx;
    font-weight: 600;
    margin-bottom: 12rpx;
    color: #333;
}

.input {
    width: 100%;
    height: 80rpx;
    border: 2rpx solid #e5e7eb;
    border-radius: 10rpx;
    padding: 0 20rpx;
    font-size: 26rpx;
    background-color: #f9fafb;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

.input:focus {
    border-color: #667eea;
    background-color: #fff;
    box-shadow: 0 0 0 4rpx rgba(102, 126, 234, 0.1);
}

.error-message {
    margin-bottom: 20rpx;
    padding: 12rpx 16rpx;
    background-color: #fef2f2;
    border-left: 4rpx solid #ef4444;
    border-radius: 6rpx;
    width: 100%;
    box-sizing: border-box;
}

.error-text {
    color: #dc2626;
    font-size: 22rpx;
}

.login-button {
    width: 100%;
    height: 80rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    font-size: 30rpx;
    font-weight: 600;
    border-radius: 10rpx;
    border: none;
    margin: 16rpx 0 32rpx 0;
    transition: all 0.3s ease;
    box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
    box-sizing: border-box;
}

.login-button:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
}

.login-button-loading {
    opacity: 0.7;
    transform: none !important;
}

.loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.loading-spinner {
    width: 28rpx;
    height: 28rpx;
    border: 3rpx solid rgba(255, 255, 255, 0.3);
    border-top: 3rpx solid #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 12rpx;
}

.loading-text {
    color: #fff;
    font-size: 26rpx;
}

.other-options {
    display: flex;
    justify-content: space-between;
    margin-top: 24rpx;
    width: 100%;
}

.option-link {
    font-size: 24rpx;
    color: #667eea;
    text-decoration: none;
    transition: color 0.3s ease;
}

.option-link:active {
    color: #4f46e5;
}

.login-footer {
    padding: 30rpx 20rpx 20rpx;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
}

.copyright {
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.6);
    text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.3);
}

/* 动画效果 */
@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-60rpx);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(60rpx);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* 小程序适配 */
@media (max-width: 750rpx) {
    .scroll-container {
        padding: 30rpx 20rpx 15rpx;
    }
    
    .login-form {
        padding: 30rpx 20rpx;
        margin: 0;
    }
    
    .app-name {
        font-size: 40rpx;
    }
    
    .logo {
        width: 120rpx;
        height: 120rpx;
    }
}

/* 针对更小屏幕的适配 */
@media (max-width: 400px) {
    .scroll-container {
        padding: 20rpx 15rpx 10rpx;
    }
    
    .login-form {
        padding: 25rpx 15rpx;
        border-radius: 15rpx;
    }
    
    .input {
        height: 70rpx;
        font-size: 24rpx;
        padding: 0 15rpx;
    }
    
    .login-button {
        height: 70rpx;
        font-size: 28rpx;
    }
}
</style>