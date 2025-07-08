import API from './index'

// NEFT APIs
export const getNefts = () => API.get('/nefts')
export const getNeftById = (id) => API.get(`/nefts/${id}`)
export const createNeft = (data) => API.post('/nefts/create', data)
export const updateNeft = (id, data) => API.patch(`/nefts/${id}`, data)
export const deleteNeft = (id) => API.delete(`/nefts/${id}`)
export const updateNeftRemark = (id, neftRemark) =>
  API.patch(`nefts/${id}/neftRemark`, { neftRemark })
export const updateNeftStatus = (id, status) => API.patch(`nefts/${id}/status`, { status })

// Party in NEFT
export const addPartyToNeft = (id, data) => API.post(`/nefts/${id}/add-party`, data)
export const updatePartyNeft = (neftId, partyId, data) =>
  API.patch(`/nefts/${neftId}/party/${partyId}`, data)
export const deletePartyNeft = (neftId, partyId) => API.delete(`/nefts/${neftId}/party/${partyId}`)
export const updatePartyStatus = (neftId, partyId, status) =>
  API.patch(`/nefts/${neftId}/party/${partyId}/status`, { status })
export const getNeftByPartyId = (partyId) => API.get(`/nefts/party/${partyId}`)

// PDF APIs
export const getNeftPdf = (id) => API.get(`/nefts/${id}/pdf`, { responseType: 'blob' })
export const getPartyNeftPdf = (neftId, partyId) =>
  API.get(`/nefts/${neftId}/party/${partyId}/pdf`, { responseType: 'blob' })
