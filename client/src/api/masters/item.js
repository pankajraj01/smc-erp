import API from '../index'

// 🔹 Get all Items
export const getAllItems = () => API.get('/master/item')

// 🔹 Get single Item by ID
export const getItemById = (itemId) => API.get(`/master/item/${itemId}`)

// 🔹 Create a new Item
export const createItem = (data) => API.post('/master/item', data)

// 🔹 Update a Item
export const updateItem = (itemId, data) => API.patch(`/master/item/${itemId}`, data)

// 🔹 Delete a Item
export const deleteItem = (itemId) => API.delete(`/master/item/${itemId}`)
