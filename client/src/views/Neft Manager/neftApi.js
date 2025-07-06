import axios from 'axios'

const BASE_URL = 'http://localhost:5000/api/nefts'

// 🔹 Fetch all NEFTs
export const fetchAllNefts = async () => {
  const res = await axios.get(`${BASE_URL}`)
  return res.data.nefts
}

// 🔹 Fetch a specific NEFT by ID
export const fetchNeftById = async (neftId) => {
  const res = await axios.get(`${BASE_URL}/${neftId}`)
  return res.data.neft
}

// 🔹 Fetch all parties
export const fetchAllParties = async () => {
  const res = await axios.get(`http://localhost:5000/api/master/party`)
  return res.data.parties
}

// 🔹 Create a brand new NEFT (mode: new)
export const createNewNeft = async (payload) => {
  const res = await axios.post(`${BASE_URL}/create`, payload)
  return res.data
}

// 🔹 Add new party to existing NEFT (mode: add-party)
export const addPartyToNeft = async (neftId, partyData) => {
  const res = await axios.post(`${BASE_URL}/${neftId}/add-party`, partyData)
  return res.data
}

// 🔹 Update existing party data in NEFT (mode: edit-party)
export const updatePartyInNeft = async (neftId, partyId, updatedData) => {
  const res = await axios.put(`${BASE_URL}/${neftId}/party/${partyId}`, updatedData)
  return res.data
}

// 🔹 Delete a party from NEFT
export const deletePartyFromNeft = async (neftId, partyId) => {
  const res = await axios.delete(`${BASE_URL}/${neftId}/party/${partyId}`)
  return res.data
}
