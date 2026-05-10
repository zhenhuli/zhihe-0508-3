<template>
  <div :class="{ 'app-authed': userStore.isLoggedIn.value }">
    <div v-if="userStore.isLoggedIn.value" class="user-bar">
      <span class="user-info">
        👤 {{ userStore.username.value }}
        <span v-if="userStore.isAdmin.value" class="admin-tag">管理员</span>
      </span>
      <button class="logout-btn" @click="handleLogout">退出</button>
    </div>
    
    <router-view />
    
    <nav v-if="userStore.isLoggedIn.value" class="navbar">
      <div class="navbar-nav">
        <router-link to="/" class="nav-link">
          <span class="nav-icon">🏠</span>
          <span class="nav-text">首页</span>
        </router-link>
        <router-link v-if="userStore.isAdmin.value" to="/admin" class="nav-link">
          <span class="nav-icon">📚</span>
          <span class="nav-text">题库</span>
        </router-link>
        <router-link to="/records" class="nav-link">
          <span class="nav-icon">📋</span>
          <span class="nav-text">记录</span>
        </router-link>
        <router-link to="/stats" class="nav-link">
          <span class="nav-icon">📊</span>
          <span class="nav-text">统计</span>
        </router-link>
        <router-link to="/wrong" class="nav-link">
          <span class="nav-icon">❌</span>
          <span class="nav-text">错题</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import userStore from './store/user.js'
import http from './utils/http.js'

const router = useRouter()

const handleLogout = async () => {
  if (!confirm('确定要退出登录吗？')) return
  
  try {
    await http.post('/api/auth/logout')
  } catch (err) {
    console.error('退出失败', err)
  }
  
  userStore.clearAuth()
  router.push('/login')
}
</script>

<style scoped>
.user-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #ebeef5;
  z-index: 1000;
}

.user-info {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.admin-tag {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 8px;
  background-color: #409eff;
  color: #fff;
  font-size: 11px;
  border-radius: 4px;
}

.logout-btn {
  padding: 6px 14px;
  border: none;
  background-color: #f5f7fa;
  color: #606266;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}

.logout-btn:active {
  background-color: #ebeef5;
}
</style>
