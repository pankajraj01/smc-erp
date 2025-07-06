import API from '../index'

// 🔹 Get all Agents
export const getAllAgents = () => API.get('/master/agent')

// 🔹 Get single Agent by ID
export const getAgentById = (agentId) => API.get(`/master/agent/${agentId}`)

// 🔹 Create a new Agent
export const createAgent = (data) => API.post('/master/agent', data)

// 🔹 Update a Agent
export const updateAgent = (agentId, data) => API.patch(`/master/agent/${agentId}`, data)

// 🔹 Delete a Agent
export const deleteAgent = (agentId) => API.delete(`/master/agent/${agentId}`)
