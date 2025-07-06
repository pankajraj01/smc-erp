import API from './index'

export const loginUser = (userName, password) => API.post('/auth/login', { userName, password })
