import {createFeatureSelector, createSelector} from '@ngrx/store'
import {DashboardState} from './dashboard.state'
import {Tab, Card} from '../../shared/models'
import {DeviceItem, SensorItem} from './dashboard.state'

export const selectDashboardState =
  createFeatureSelector<DashboardState>('dashboard')

export const selectSelectedDashboard = createSelector(
  selectDashboardState,
  (state) => state.selectedDashboard
)

export const selectEditMode = createSelector(
  selectDashboardState,
  (state) => state.editMode.isActive
)

export const selectOriginalDashboard = createSelector(
  selectDashboardState,
  (state) => state.editMode.originalDashboard
)

export const selectAvailableDevices = createSelector(
  selectDashboardState,
  (state) => state.availableDevices
)

export const selectDashboardLoading = createSelector(
  selectDashboardState,
  (state) => state.loading.dashboard
)

export const selectDevicesLoading = createSelector(
  selectDashboardState,
  (state) => state.loading.devices
)

export const selectSavingLoading = createSelector(
  selectDashboardState,
  (state) => state.loading.saving
)

export const selectDeviceToggling = createSelector(
  selectDashboardState,
  (state) => state.loading.deviceToggling
)

export const selectIsDeviceToggling = createSelector(
  selectDeviceToggling,
  (deviceToggling: Record<string, boolean>, props: {deviceId: string}) =>
    deviceToggling[props.deviceId] || false
)

export const selectAnyLoading = createSelector(
  selectDashboardState,
  (state) =>
    state.loading.dashboard ||
    state.loading.devices ||
    state.loading.saving ||
    Object.values(state.loading.deviceToggling).some(Boolean)
)

export const selectDashboardError = createSelector(
  selectDashboardState,
  (state) => state.error.dashboard
)

export const selectDevicesError = createSelector(
  selectDashboardState,
  (state) => state.error.devices
)

export const selectSavingError = createSelector(
  selectDashboardState,
  (state) => state.error.saving
)

export const selectAnyError = createSelector(
  selectDashboardState,
  (state) => state.error.dashboard || state.error.devices || state.error.saving
)

export const selectDashboardTabs = createSelector(
  selectSelectedDashboard,
  (dashboard) => dashboard?.tabs || []
)

export const selectCurrentTab = createSelector(
  selectDashboardTabs,
  (tabs: Tab[], props: {tabId: string}) =>
    tabs.find((tab: Tab) => tab.id === props.tabId)
)

export const selectCurrentTabCards = createSelector(
  selectCurrentTab,
  (tab) => tab?.cards || []
)

export const selectTabById = createSelector(
  selectDashboardTabs,
  (tabs: Tab[], props: {tabId: string}) =>
    tabs.find((tab: Tab) => tab.id === props.tabId)
)

export const selectCardById = createSelector(
  selectDashboardTabs,
  (tabs: Tab[], props: {tabId: string; cardId: string}) => {
    const tab = tabs.find((t: Tab) => t.id === props.tabId)
    return tab?.cards.find((card: Card) => card.id === props.cardId)
  }
)

export const selectExistingDashboardIds = createSelector(
  selectDashboardState,
  () => [] as string[]
)

export const selectExistingTabTitles = createSelector(
  selectDashboardTabs,
  (tabs) => tabs.map((tab) => tab.title)
)

export const selectTabTitlesForValidation = createSelector(
  selectDashboardTabs,
  (tabs: Tab[], props: {excludeTabId?: string}) =>
    tabs
      .filter((tab: Tab) => tab.id !== props.excludeTabId)
      .map((tab: Tab) => tab.title)
)

export const selectDeviceById = createSelector(
  selectAvailableDevices,
  (devices: (DeviceItem | SensorItem)[], props: {deviceId: string}) =>
    devices.find(
      (device: DeviceItem | SensorItem) => device.id === props.deviceId
    )
)

export const selectDevicesOnly = createSelector(
  selectAvailableDevices,
  (devices) => devices.filter((device) => device.type === 'device')
)

export const selectSensorsOnly = createSelector(
  selectAvailableDevices,
  (devices) => devices.filter((device) => device.type === 'sensor')
)

export const selectDashboardHasTabs = createSelector(
  selectDashboardTabs,
  (tabs) => tabs.length > 0
)

export const selectTabHasCards = createSelector(
  selectCurrentTab,
  (tab) => (tab?.cards.length || 0) > 0
)

export const selectCardHasItems = createSelector(
  selectCardById,
  (card) => (card?.items.length || 0) > 0
)

export const selectCanSave = createSelector(
  selectEditMode,
  selectSelectedDashboard,
  selectSavingLoading,
  (isEditMode, dashboard, isSaving) => isEditMode && !!dashboard && !isSaving
)

export const selectCanDiscard = createSelector(
  selectEditMode,
  selectOriginalDashboard,
  (isEditMode, originalDashboard) => isEditMode && !!originalDashboard
)

export const selectHasUnsavedChanges = createSelector(
  selectEditMode,
  selectSelectedDashboard,
  selectOriginalDashboard,
  (isEditMode, currentDashboard, originalDashboard) => {
    if (!isEditMode || !currentDashboard || !originalDashboard) return false
    return (
      JSON.stringify(currentDashboard) !== JSON.stringify(originalDashboard)
    )
  }
)
