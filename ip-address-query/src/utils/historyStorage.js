const HISTORY_KEY = 'ip_query_history'
const MAX_HISTORY = 50

export function saveToHistory(item) {
  try {
    const history = getHistory()
    const newHistory = [item, ...history.filter(h => h.ip !== item.ip)].slice(0, MAX_HISTORY)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
    return newHistory
  } catch (error) {
    console.error('保存历史记录失败:', error)
    return []
  }
}

export function getHistory() {
  try {
    const history = localStorage.getItem(HISTORY_KEY)
    return history ? JSON.parse(history) : []
  } catch (error) {
    console.error('读取历史记录失败:', error)
    return []
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY)
    return true
  } catch (error) {
    console.error('清空历史记录失败:', error)
    return false
  }
}

export function deleteFromHistory(ip) {
  try {
    const history = getHistory()
    const newHistory = history.filter(h => h.ip !== ip)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
    return newHistory
  } catch (error) {
    console.error('删除历史记录失败:', error)
    return []
  }
}
