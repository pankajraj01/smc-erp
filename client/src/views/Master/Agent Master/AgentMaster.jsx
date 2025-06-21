import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CContainer,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import { useEffect, useState } from 'react'

// ✅ NEW reusable components
import Icon from '../../../components/Icon'
import AgentFormModal from './AgentFormModal'
import AgentTable from './AgentTable'
import AgentDeleteModal from './AgentDeleteModal'
import PaginationControls from '../../../components/PaginationControls'

const ITEMS_PER_PAGE = 5

export default function AgentMaster() {
  // ✅ State Management
  const [typeFilter, setTypeFilter] = useState('ALL') // 'ALL', 'GREY', 'FINISH'
  const [searchTerm, setSearchTerm] = useState('')
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [visible, setVisible] = useState(false)
  const [agentToEdit, setAgentToEdit] = useState(null)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [agentToDelete, setAgentToDelete] = useState(null)

  // ✅ Fetch agents once on component mount
  const fetchAgents = async (goToLastPage = false) => {
    try {
      const res = await fetch('http://localhost:5000/api/master/agent')
      const data = await res.json()
      const allAgents = data.agents || []

      setAgents(allAgents)

      if (goToLastPage) {
        setCurrentPage(Math.ceil(allAgents.length / ITEMS_PER_PAGE))
      }

      setTypeFilter('ALL')
      setSearchTerm('')
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch Agents:', err)
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [])

  // ✅ Create or update agent logic
  const handleSaveAgent = async (agent) => {
    try {
      const isEdit = !!agent._id

      const url = agent._id
        ? `http://localhost:5000/api/master/agent/${agent._id}`
        : 'http://localhost:5000/api/master/agent'
      const method = agent._id ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agent),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Operation failed')

      const updatedAgents = agent._id
        ? agents.map((a) => (a._id === agent._id ? data.agent : a))
        : [...agents, data.agents]

      await fetchAgents(!isEdit) // ✅ refetch full data ⬅ true means go to last page on add
      setVisible(false) // ✅ close modal
      setAgentToEdit(null) // ✅ reset form state
    } catch (err) {
      alert(err.message)
    }
  }

  // ✅ Handle delete confirmation
  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/master/agent/${agentToDelete._id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Delete failed')

      const updated = agents.filter((a) => a._id !== agentToDelete._id)
      setAgents(updated)
      setCurrentPage((prev) => Math.min(prev, Math.ceil(updated.length / ITEMS_PER_PAGE) || 1))
      setDeleteModalVisible(false)
      setAgentToDelete(null)
    } catch (err) {
      alert(err.message)
    }
  }

  // ✅ Pagination logic + Filter + Search Logic
  const filteredAgents = agents.filter((agent) => {
    const term = searchTerm.toLowerCase()
    const matchesType = typeFilter === 'ALL' || agent.type === typeFilter
    const matchesSearch = agent.agentName.toLowerCase().includes(term)
    // agent.type.toLowerCase().includes(term) ||
    // agent.bank?.bankName?.toLowerCase().includes(term) ||
    // agent.bank?.ifsc?.toLowerCase().includes(term)

    return matchesType && matchesSearch
  })

  const paginatedData = filteredAgents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  // ✅ UI Starts
  return (
    <CCard>
      <CCardHeader>Agent Master</CCardHeader>
      <CCardBody>
        {/* Header with search and buttons */}
        <CContainer className="row justify-content-between mb-4">
          <CContainer className="col-md-4 mb-2 mb-md-0">
            <CFormInput
              className="col-md-4 mb-2"
              type="text"
              placeholder="Search Agents..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // reset to first page on search
              }}
            />
          </CContainer>

          <CContainer className="col-md-8 text-md-end ">
            <CFormSelect
              className="form-select d-inline-block w-auto me-2"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value="ALL">All Types</option>
              <option value="GREY">Grey</option>
              <option value="FINISH">Finish</option>
            </CFormSelect>

            <CButton
              onClick={() => {
                setAgentToEdit(null) // 🧼 reset previous selection
                setVisible(true) // 📦 open the modal
              }}
              color="primary"
            >
              <Icon name="Plus" size={22} className="me-2" />
              Add New Agent
            </CButton>
          </CContainer>
        </CContainer>

        {/* Modals */}
        <AgentFormModal
          key={agentToEdit?._id || 'new'} // 🔥 forces React to remount
          isVisible={visible}
          setIsVisible={setVisible}
          onSubmit={handleSaveAgent}
          initialData={agentToEdit}
        />
        <AgentDeleteModal
          visible={deleteModalVisible}
          agent={agentToDelete}
          onCancel={() => setDeleteModalVisible(false)}
          onConfirm={handleDelete}
        />

        {/* Table + Pagination */}
        {loading ? (
          <p>Loading agents...</p>
        ) : (
          <>
            <AgentTable
              agents={paginatedData}
              onEdit={(agent) => {
                setAgentToEdit(agent)
                setVisible(true)
              }}
              onDelete={(agent) => {
                setAgentToDelete(agent)
                setDeleteModalVisible(true)
              }}
            />
            <PaginationControls
              currentPage={currentPage}
              totalPages={Math.ceil(filteredAgents.length / ITEMS_PER_PAGE)}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </CCardBody>
    </CCard>
  )
}
