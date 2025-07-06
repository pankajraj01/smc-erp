import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true, // optional: if using cookies or login
})

export default API
