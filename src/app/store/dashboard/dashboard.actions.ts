import {createAction, props} from '@ngrx/store'
import {DashboardData, DashboardInfo} from '../../shared/models'
import {
  DeviceItem,
  SensorItem,
  CreateDashboardRequest,
  CardLayout,
  CardItem,
} from './dashboard.state'

export const enterEditMode = createAction('[Dashboard] Enter Edit Mode')

export const exitEditMode = createAction('[Dashboard] Exit Edit Mode')

export const loadDashboard = createAction(
  '[Dashboard] Load Dashboard',
  props<{dashboardId: string}>()
)

export const loadDashboardSuccess = createAction(
  '[Dashboard] Load Dashboard Success',
  props<{dashboard: DashboardData}>()
)

export const loadDashboardFailure = createAction(
  '[Dashboard] Load Dashboard Failure',
  props<{error: string}>()
)

export const saveDashboard = createAction(
  '[Dashboard] Save Dashboard',
  props<{dashboardId: string; dashboard: DashboardData}>()
)

export const saveDashboardSuccess = createAction(
  '[Dashboard] Save Dashboard Success',
  props<{dashboard: DashboardData}>()
)

export const saveDashboardFailure = createAction(
  '[Dashboard] Save Dashboard Failure',
  props<{error: string}>()
)

export const discardChanges = createAction('[Dashboard] Discard Changes')

export const addTab = createAction(
  '[Dashboard] Add Tab',
  props<{title: string}>()
)

export const removeTab = createAction(
  '[Dashboard] Remove Tab',
  props<{tabId: string}>()
)

export const reorderTab = createAction(
  '[Dashboard] Reorder Tab',
  props<{tabId: string; direction: 'left' | 'right'}>()
)

export const updateTabTitle = createAction(
  '[Dashboard] Update Tab Title',
  props<{tabId: string; title: string}>()
)

export const addCard = createAction(
  '[Dashboard] Add Card',
  props<{tabId: string; layout: CardLayout}>()
)

export const removeCard = createAction(
  '[Dashboard] Remove Card',
  props<{tabId: string; cardId: string}>()
)

export const reorderCard = createAction(
  '[Dashboard] Reorder Card',
  props<{tabId: string; cardId: string; newIndex: number}>()
)

export const updateCardTitle = createAction(
  '[Dashboard] Update Card Title',
  props<{tabId: string; cardId: string; title: string}>()
)

export const addItemToCard = createAction(
  '[Dashboard] Add Item To Card',
  props<{tabId: string; cardId: string; item: CardItem}>()
)

export const removeItemFromCard = createAction(
  '[Dashboard] Remove Item From Card',
  props<{tabId: string; cardId: string; itemId: string}>()
)

export const loadDevices = createAction('[Dashboard] Load Devices')

export const loadDevicesSuccess = createAction(
  '[Dashboard] Load Devices Success',
  props<{devices: (DeviceItem | SensorItem)[]}>()
)

export const loadDevicesFailure = createAction(
  '[Dashboard] Load Devices Failure',
  props<{error: string}>()
)

export const toggleDeviceState = createAction(
  '[Dashboard] Toggle Device State',
  props<{deviceId: string; newState: boolean}>()
)

export const toggleDeviceStateSuccess = createAction(
  '[Dashboard] Toggle Device State Success',
  props<{deviceId: string; newState: boolean}>()
)

export const toggleDeviceStateFailure = createAction(
  '[Dashboard] Toggle Device State Failure',
  props<{deviceId: string; error: string}>()
)

export const createDashboard = createAction(
  '[Dashboard] Create Dashboard',
  props<{dashboard: CreateDashboardRequest}>()
)

export const createDashboardSuccess = createAction(
  '[Dashboard] Create Dashboard Success',
  props<{dashboard: DashboardInfo}>()
)

export const createDashboardFailure = createAction(
  '[Dashboard] Create Dashboard Failure',
  props<{error: string}>()
)

export const deleteDashboard = createAction(
  '[Dashboard] Delete Dashboard',
  props<{dashboardId: string}>()
)

export const deleteDashboardSuccess = createAction(
  '[Dashboard] Delete Dashboard Success',
  props<{dashboardId: string}>()
)

export const deleteDashboardFailure = createAction(
  '[Dashboard] Delete Dashboard Failure',
  props<{error: string}>()
)
