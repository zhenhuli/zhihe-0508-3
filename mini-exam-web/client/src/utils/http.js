import axios from 'axios'
import userStore from '../store/user.js'
import router from '../router/index.js'

const http = axios.create({
  baseURL: '/',
  timeout: 10000
})

http.interceptors.request.use(config => {
  if (userStore.state.token) {
    config.headers.Authorization = `Bearer ${userStore.state.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

http.interceptors.response.use(response => {
  return response
}, error => {
  if (error.response?.status === 401) {
    userStore.clearAuth()
    router.push('/login')
  } else if (error.response?.status === 403) {
    alert('权限不足：只有管理员可以执行此操作')
  }
  return Promise.reject(error)
})

export default http
