<template>
  <div class="login-container">
    <div class="login-header">
      <h1 class="login-title">📝 迷你自测</h1>
      <p class="login-subtitle">在线练习，自我提升</p>
    </div>
    
    <div class="login-card">
      <div class="login-tabs">
        <button 
          class="login-tab" 
          :class="{ active: isLogin }"
          @click="isLogin = true"
        >登录</button>
        <button 
          class="login-tab" 
          :class="{ active: !isLogin }"
          @click="isLogin = false"
        >注册</button>
      </div>
      
      <div class="login-form">
        <div class="form-group">
          <label class="form-label">用户名</label>
          <input 
            v-model="form.username" 
            type="text" 
            class="form-input" 
            placeholder="请输入用户名"
            @keyup.enter="submit"
          >
        </div>
        
        <div class="form-group">
          <label class="form-label">密码</label>
          <input 
            v-model="form.password" 
            type="password" 
            class="form-input" 
            placeholder="请输入密码"
            @keyup.enter="submit"
          >
        </div>
        
        <div v-if="!isLogin" class="form-group">
          <label class="form-label">确认密码</label>
          <input 
            v-model="form.confirmPassword" 
            type="password" 
            class="form-input" 
            placeholder="请再次输入密码"
            @keyup.enter="submit"
          >
        </div>
        
        <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>
        
        <button 
          class="btn btn-primary" 
          style="width: 100%; height: 48px; font-size: 16px; margin-top: 8px;"
          @click="submit"
          :disabled="loading"
        >
          {{ loading ? '处理中...' : (isLogin ? '登 录' : '注 册') }}
        </button>
      </div>
      
      <div class="login-tip">
        <p>🔐 默认管理员：<strong>admin / admin123</strong></p>
        <p style="margin-top: 4px;">📱 或注册新账号体验</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import http from '../utils/http.js'
import userStore from '../store/user.js'

const router = useRouter()
const isLogin = ref(true)
const loading = ref(false)
const errorMsg = ref('')

const form = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

const submit = async () => {
  errorMsg.value = ''
  
  if (!form.username.trim()) {
    errorMsg.value = '请输入用户名'
    return
  }
  if (!form.password.trim()) {
    errorMsg.value = '请输入密码'
    return
  }
  if (!isLogin.value && form.password !== form.confirmPassword) {
    errorMsg.value = '两次密码不一致'
    return
  }
  
  loading.value = true
  
  try {
    const url = isLogin.value ? '/api/auth/login' : '/api/auth/register'
    const res = await http.post(url, {
      username: form.username.trim(),
      password: form.password
    })
    
    if (res.data.success) {
      userStore.setAuth(res.data.data.token, res.data.data.user)
      router.push('/')
    } else {
      errorMsg.value = res.data.message
    }
  } catch (err) {
    errorMsg.value = err.response?.data?.message || '请求失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  box-sizing: border-box;
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
}

.login-title {
  font-size: 28px;
  color: #fff;
  margin: 0;
  font-weight: 700;
}

.login-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  margin: 8px 0 0 0;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 20px;
  padding: 24px 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.login-tabs {
  display: flex;
  background: #f5f7fa;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 24px;
}

.login-tab {
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #909399;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-tab.active {
  background: #fff;
  color: #409eff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.login-form {
  margin-bottom: 20px;
}

.login-tip {
  background: #f5f7fa;
  border-radius: 12px;
  padding: 12px;
  font-size: 12px;
  color: #606266;
  margin-top: 16px;
}

.login-tip p {
  margin: 0;
}
</style>
