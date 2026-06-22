import axios from 'axios'

const request = axios.create({
     baseURL: import.meta.env.VITE_API_BASE_URL,
     withCredentials:true,
})

request.interceptors.response.use(
     (response) => response.data.data,
     (error) => {
          if (error.response ?.status === 401) {
               window.location.href = '/login'
          }
          return Promise.reject(error)
     },
)

export default request