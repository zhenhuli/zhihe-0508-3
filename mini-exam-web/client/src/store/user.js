import { reactive, computed } from 'vue'

const TOKEN_KEY = 'mini_exam_token'
const USER_KEY = 'mini_exam_user'

const state = reactive({
  token: localStorage.getItem(TOKEN_KEY) || null,
  user: localStorage.getItem(USER_KEY) ? JSON.parse(localStorage.getItem(USER_KEY)) : null
})

const isLoggedIn = computed(() => !!state.token)
const isAdmin = computed(() => state.user?.role === 'admin')
const username = computed(() => state.user?.username || '')

const setAuth = (token, user) => {
  state.token = token
  state.user = user
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

const clearAuth = () => {
  state.token = null
  state.user = null
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export default {
  state,
  isLoggedIn,
  isAdmin,
  username,
  setAuth,
  clearAuth
}
