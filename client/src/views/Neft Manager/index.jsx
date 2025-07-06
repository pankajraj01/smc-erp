// File: /pages/CreateNeftPage/index.jsx

import { useEffect, useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import {
  fetchAllParties,
  // fetchAllNefts,
  // fetchNeftById,
  // createNewNeft,
  // addPartyToNeft,
  // updatePartyInNeft,
} from './neftApi'
import NeftForm from './NeftForm'
import ConfirmationModal from './ConfirmationModal'

import {
  getNeftById,
  updatePartyNeft,
  addPartyToNeft,
  createNeft,
  getNefts,
} from '../../api/nefts.api'
import { getAllParties } from '../../api/masters/party'

export default function CreateNeftPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { neftId, partyId } = useParams()
  const [visible, setVisible] = useState(false)

  const isEditParty = !!(neftId && partyId)
  const isAddParty = !!(neftId && !partyId)
  const isNewNeft = !neftId && !partyId

  const [neftNo, setNeftNo] = useState(null)
  const [neftDate, setNeftDate] = useState(new Date().toISOString().split('T')[0])
  const [neftRemark, setNeftRemark] = useState('')
  const [neftStatus, setNeftStatus] = useState('Pending')
  const [parties, setParties] = useState([])
  const [formData, setFormData] = useState({
    partyId: '',
    partyName: '',
    bankName: '',
    accNo: '',
    ifsc: '',
  })
  const [billRows, setBillRows] = useState([
    { billNo: '', billDate: '', billAmount: '', discount: '', rd: '', tds: '', netAmount: '' },
  ])
  const [totalPartyNeftAmount, setTotalPartyNeftAmount] = useState(0)
  const [tdsTotal, setTdsTotal] = useState(0)
  const [partyRemark, setPartyRemark] = useState('')

  const fetchAllParties = async () => {
    try {
      const res = await getAllParties()
      setParties(res.data.parties || [])
      // console.log(res.data.parties)

      // return res.data.parties || []
    } catch (error) {
      console.error('Failed to fetch parties:', error)
      return []
    }
  }

  useEffect(() => {
    fetchAllParties()
  }, [])

  useEffect(() => {
    const initNeftData = async () => {
      if (isNewNeft) {
        const res = await getNefts()
        const data = res.data.nefts || []
        const lastNeftNo =
          data.length > 0 ? Math.max(...data.map((n) => parseInt(n.neftNo) || 0)) : 0
        setNeftNo(lastNeftNo + 1)
      } else {
        const res = await getNeftById(neftId)
        const neft = res.data.neft
        setNeftNo(neft.neftNo)
        setNeftDate(neft.neftDate)
        setNeftRemark(neft.neftRemark)
        setNeftStatus(neft.neftStatus)

        if (isEditParty) {
          const res = await getNeftById(neftId)
          const neft = res.data.neft
          // console.log('neft:', res.data.neft)

          // console.log('entered edit party')
          // console.log('neftId: ', neftId)
          // console.log('partyId: ', partyId)
          // console.log('neft parties in selected neft:', neft.parties)

          const party = neft.parties.find((p) => p.partyId === partyId)

          if (party) {
            setFormData({
              partyId: party.partyId,
              partyName: party.partyName,
              bankName: party.bank.bankName,
              accNo: party.bank.accNo,
              ifsc: party.bank.ifsc,
            })
            setBillRows(party.bills)
            setPartyRemark(party.partyRemark)
            calculateTotals(party.bills)
          }
        }
      }
    }
    initNeftData()
  }, [neftId, partyId])

  const calculateTotals = (rows) => {
    const totalAmount = rows.reduce((sum, row) => sum + (parseFloat(row.netAmount) || 0), 0)
    const totalTds = rows.reduce((sum, row) => sum + (parseFloat(row.tds) || 0), 0)
    setTotalPartyNeftAmount(totalAmount)
    setTdsTotal(totalTds)
  }

  const handleFinalSubmit = async () => {
    const partyPayload = {
      partyId: formData.partyId,
      partyName: formData.partyName,
      partyRemark,
      bank: {
        bankName: formData.bankName,
        accNo: formData.accNo,
        ifsc: formData.ifsc,
      },
      bills: billRows,
      totalPartyNeftAmount,
      tdsTotal,
      neftRemark,
      partyStatus: 'Pending',
    }

    const neftPayload = {
      neftNo,
      neftDate: new Date(neftDate),
      neftAmount: totalPartyNeftAmount,
      tdsTotal,
      neftStatus,
      neftRemark,
      parties: [partyPayload], // single party wrapped
    }

    console.log(isNewNeft, isAddParty, isEditParty)

    try {
      if (isNewNeft) {
        const response = await createNeft(neftPayload)
        console.log(response.data.neft._id)
        navigate(`/neft-manager/${response.data.neft._id}`)
      } else if (isAddParty) {
        const res = await addPartyToNeft(neftId, partyPayload)
        navigate(`/neft-manager/${res.data.neft._id}`)
      } else if (isEditParty) {
        console.log('entered edit party')
        console.log('partyPayload', neftPayload)
        const res = await updatePartyNeft(neftId, partyId, neftPayload)
        navigate(`/neft-manager/${res.data.neft._id}`)
      }
    } catch (error) {
      console.error('Save failed:', error)
      alert('Something went wrong while saving.')
    }
  }

  return (
    <>
      <NeftForm
        formData={formData}
        setFormData={setFormData}
        billRows={billRows}
        setBillRows={setBillRows}
        parties={parties}
        neftNo={neftNo}
        neftDate={neftDate}
        totalPartyNeftAmount={totalPartyNeftAmount}
        tdsTotal={tdsTotal}
        neftStatus={neftStatus}
        partyRemark={partyRemark}
        setPartyRemark={setPartyRemark}
        calculateTotals={calculateTotals}
        onSave={() => setVisible(true)}
        onCancel={() => navigate(-1)}
      />

      {visible && (
        <ConfirmationModal
          isVisible={visible}
          setIsVisible={() => setVisible(false)}
          neftNo={neftNo}
          neftDate={neftDate}
          formData={formData}
          billRows={billRows}
          totalPartyNeftAmount={totalPartyNeftAmount}
          tdsTotal={tdsTotal}
          partyRemark={partyRemark}
          onFinalSave={handleFinalSubmit}
        />
      )}
    </>
  )
}
