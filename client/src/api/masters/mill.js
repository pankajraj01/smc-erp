import API from '../index'

// 🔹 Get all Mills
export const getAllMills = () => API.get('/master/mill')

// 🔹 Get single Mill by ID
export const getMillById = (millId) => API.get(`/master/mill/${millId}`)

// 🔹 Create a new Item
export const createMill = (data) => API.post('/master/mill', data)

// 🔹 Update a Item
export const updateMill = (millId, data) => API.patch(`/master/mill/${millId}`, data)

// 🔹 Delete a Item
export const deleteMill = (millId) => API.delete(`/master/mill/${millId}`)
