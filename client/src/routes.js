import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
// const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
// const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))

// Grey Manager
const GreyOrders = React.lazy(() => import('./views/Grey Manager/Grey Orders/GreyOrders'))
const GreyReceived = React.lazy(() => import('./views/Grey Manager/Grey Received/GreyReceived'))

// Master
const ItemMaster = React.lazy(() => import('./views/Master/Item Master/ItemMaster'))
const PartyMaster = React.lazy(() => import('./views/Master/Party Master/PartyMaster'))
const MillMaster = React.lazy(() => import('./views/Master/Mill Master/MillMaster'))
const AgentMaster = React.lazy(() => import('./views/Master/Agent Master/AgentMaster'))

// Neft Manager
const NeftManager = React.lazy(() => import('./views/Neft Manager/NeftManager'))
const CreateNewNeft = React.lazy(() => import('./views/Neft Manager/index'))
const NeftPage = React.lazy(() => import('./views/Neft Manager/NeftPage'))
const NeftPartyCenter = React.lazy(() => import('./views/Neft Manager/NeftPartyCenter'))
const PartyNeftList = React.lazy(() => import('./views/Neft Manager/PartyNeftList'))

// const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/login', name: 'Login', element: Login },

  // Grey Manager
  { path: '/api/grey-orders', name: 'Grey Orders', element: GreyOrders },
  { path: '/grey-received', name: 'Grey Received', element: GreyReceived },

  // Master
  { path: '/api/master/item', name: 'Item Master', element: ItemMaster },
  { path: '/api/master/party', name: 'Party Master', element: PartyMaster },
  { path: '/api/master/mill', name: 'Mill Master', element: MillMaster },
  { path: '/api/master/agent', name: 'Agent Master', element: AgentMaster },

  // Neft Manager
  { path: '/api/neft-manager', name: 'Neft Manager', element: NeftManager },
  { path: '/api/neft-manager/create', name: 'Create New Neft', element: CreateNewNeft }, // add new
  { path: '/api/neft-manager/create/:neftId', name: 'Create New Neft', element: CreateNewNeft }, // add party to neft
  {
    path: '/api/neft-manager/create/:neftId/party/:partyId',
    name: 'Create New Neft',
    element: CreateNewNeft,
  }, // edit/update data

  { path: '/api/neft-manager/:neftId', name: 'Neft Page', element: NeftPage }, // view single neft

  {
    path: '/api/neft-manager/neft-party-center',
    name: 'Neft Party Center',
    element: NeftPartyCenter,
  }, // view party wise neft
  {
    path: '/api/neft-manager/neft-party/:partyId',
    name: 'Neft Party Center',
    element: PartyNeftList,
  },

  { path: '/base/accordion', name: 'Accordion', element: Accordion },

  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
