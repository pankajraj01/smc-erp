import API from '../index'

// 🔹 Get all parties
export const getAllParties = () => API.get('/master/party')

// 🔹 Get single party by ID
export const getPartyById = (partyId) => API.get(`/master/party/${partyId}`)

// 🔹 Create a new party
export const createParty = (data) => API.post('/master/party', data)

// 🔹 Update a party
export const updateParty = (partyId, data) => API.patch(`/master/party/${partyId}`, data)

// 🔹 Delete a party
export const deleteParty = (partyId) => API.delete(`/master/party/${partyId}`)
