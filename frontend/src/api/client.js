import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  timeout: 10000,
})
  
let refreshPromise = null

function requestPath(config) {
  const u = config?.url ?? ''
  if (u.startsWith('http')) {
    try {
      return new URL(u).pathname + new URL(u).search
    } catch {
      return u
    }
  }
  return u
}

function shouldSkipRefresh(config) {
  const path = requestPath(config)
  return (
    path.includes('/api/users/login') ||
    path.includes('/api/users/add') ||
    path.includes('/api/users/logout') ||
    path.includes('/api/users/refresh')
  )
}

function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = api
      .post('/api/users/refresh')
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    const config = error.config

    if (!config || status == null) {
      return Promise.reject(error)
    }

    if (shouldSkipRefresh(config)) {
      return Promise.reject(error)
    }

    if (status !== 401 && status !== 403) {
      return Promise.reject(error)
    }

    if (config._retryAfterRefresh) {
      return Promise.reject(error)
    }

    config._retryAfterRefresh = true

    try {
      await refreshAccessToken()
      return api(config)
    } catch {
      return Promise.reject(error)
    }
  }
)

export default api
