import { createRouter, createWebHistory } from 'vue-router'
import userStore from '../store/user.js'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { guest: true }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/exam',
    name: 'Exam',
    component: () => import('../views/Exam.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/result/:examId',
    name: 'Result',
    component: () => import('../views/Result.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/records',
    name: 'Records',
    component: () => import('../views/Records.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/stats',
    name: 'Stats',
    component: () => import('../views/Stats.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/wrong',
    name: 'WrongQuestions',
    component: () => import('../views/WrongQuestions.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.guest && userStore.isLoggedIn.value) {
    return next('/')
  }
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn.value) {
    return next('/login')
  }
  
  if (to.meta.requiresAdmin && !userStore.isAdmin.value) {
    return next('/')
  }
  
  next()
})

export default router
