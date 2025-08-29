import {createReducer, on} from '@ngrx/store'
import {initialDashboardState, DashboardState} from './dashboard.state'
import * as DashboardActions from './dashboard.actions'
import {DashboardData, Tab} from '../../shared/models'

function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

function generateId(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

function generateUniqueId(baseId: string, existingIds: string[]): string {
  let id = baseId
  let counter = 1
  while (existingIds.includes(id)) {
    id = `${baseId}-${counter}`
    counter++
  }
  return id
}

export const dashboardReducer = createReducer(
  initialDashboardState,

  on(
    DashboardActions.enterEditMode,
    (state): DashboardState => ({
      ...state,
      editMode: {
        isActive: true,
        originalDashboard: state.selectedDashboard
          ? deepCopy(state.selectedDashboard)
          : null,
      },
    })
  ),

  on(
    DashboardActions.exitEditMode,
    (state): DashboardState => ({
      ...state,
      editMode: {
        isActive: false,
        originalDashboard: null,
      },
    })
  ),

  on(
    DashboardActions.loadDashboard,
    (state): DashboardState => ({
      ...state,
      loading: {...state.loading, dashboard: true},
      error: {...state.error, dashboard: null},
    })
  ),

  on(
    DashboardActions.loadDashboardSuccess,
    (state, {dashboard}): DashboardState => ({
      ...state,
      selectedDashboard: dashboard,
      loading: {...state.loading, dashboard: false},
      error: {...state.error, dashboard: null},
    })
  ),

  on(
    DashboardActions.loadDashboardFailure,
    (state, {error}): DashboardState => ({
      ...state,
      loading: {...state.loading, dashboard: false},
      error: {...state.error, dashboard: error},
    })
  ),

  on(
    DashboardActions.saveDashboard,
    (state): DashboardState => ({
      ...state,
      loading: {...state.loading, saving: true},
      error: {...state.error, saving: null},
    })
  ),

  on(
    DashboardActions.saveDashboardSuccess,
    (state, {dashboard}): DashboardState => ({
      ...state,
      selectedDashboard: dashboard,
      loading: {...state.loading, saving: false},
      error: {...state.error, saving: null},
      editMode: {
        isActive: false,
        originalDashboard: null,
      },
    })
  ),

  on(
    DashboardActions.saveDashboardFailure,
    (state, {error}): DashboardState => ({
      ...state,
      loading: {...state.loading, saving: false},
      error: {...state.error, saving: error},
    })
  ),

  on(
    DashboardActions.discardChanges,
    (state): DashboardState => ({
      ...state,
      selectedDashboard: state.editMode.originalDashboard
        ? deepCopy(state.editMode.originalDashboard)
        : state.selectedDashboard,
      editMode: {
        isActive: false,
        originalDashboard: null,
      },
    })
  ),

  on(DashboardActions.addTab, (state, {title}): DashboardState => {
    if (!state.selectedDashboard) return state

    const existingIds = state.selectedDashboard.tabs.map((tab) => tab.id)
    const baseId = generateId(title)
    const uniqueId = generateUniqueId(baseId, existingIds)

    const newTab: Tab = {
      id: uniqueId,
      title,
      cards: [],
    }

    return {
      ...state,
      selectedDashboard: {
        ...state.selectedDashboard,
        tabs: [...state.selectedDashboard.tabs, newTab],
      },
    }
  }),

  on(DashboardActions.removeTab, (state, {tabId}): DashboardState => {
    if (!state.selectedDashboard) return state

    return {
      ...state,
      selectedDashboard: {
        ...state.selectedDashboard,
        tabs: state.selectedDashboard.tabs.filter((tab) => tab.id !== tabId),
      },
    }
  }),

  on(
    DashboardActions.reorderTab,
    (state, {tabId, direction}): DashboardState => {
      if (!state.selectedDashboard) return state

      const tabs = [...state.selectedDashboard.tabs]
      const currentIndex = tabs.findIndex((tab) => tab.id === tabId)

      if (currentIndex === -1) return state

      const newIndex =
        direction === 'left' ? currentIndex - 1 : currentIndex + 1

      if (newIndex < 0 || newIndex >= tabs.length) return state
      ;[tabs[currentIndex], tabs[newIndex]] = [
        tabs[newIndex],
        tabs[currentIndex],
      ]

      return {
        ...state,
        selectedDashboard: {
          ...state.selectedDashboard,
          tabs,
        },
      }
    }
  ),

  on(
    DashboardActions.updateTabTitle,
    (state, {tabId, title}): DashboardState => {
      if (!state.selectedDashboard) return state

      return {
        ...state,
        selectedDashboard: {
          ...state.selectedDashboard,
          tabs: state.selectedDashboard.tabs.map((tab) =>
            tab.id === tabId ? {...tab, title} : tab
          ),
        },
      }
    }
  ),

  on(DashboardActions.addCard, (state, {tabId, layout}): DashboardState => {
    if (!state.selectedDashboard) return state

    const tab = state.selectedDashboard.tabs.find((t) => t.id === tabId)
    if (!tab) return state

    const existingIds = tab.cards.map((card) => card.id)
    const baseId = `card-${Date.now()}`
    const uniqueId = generateUniqueId(baseId, existingIds)

    const newCard = {
      id: uniqueId,
      layout,
      items: [],
    }

    return {
      ...state,
      selectedDashboard: {
        ...state.selectedDashboard,
        tabs: state.selectedDashboard.tabs.map((t) =>
          t.id === tabId ? {...t, cards: [...t.cards, newCard]} : t
        ),
      },
    }
  }),

  on(DashboardActions.removeCard, (state, {tabId, cardId}): DashboardState => {
    if (!state.selectedDashboard) return state

    return {
      ...state,
      selectedDashboard: {
        ...state.selectedDashboard,
        tabs: state.selectedDashboard.tabs.map((tab) =>
          tab.id === tabId
            ? {...tab, cards: tab.cards.filter((card) => card.id !== cardId)}
            : tab
        ),
      },
    }
  }),

  on(
    DashboardActions.reorderCard,
    (state, {tabId, cardId, newIndex}): DashboardState => {
      if (!state.selectedDashboard) return state

      const tab = state.selectedDashboard.tabs.find((t) => t.id === tabId)
      if (!tab) return state

      const cards = [...tab.cards]
      const currentIndex = cards.findIndex((card) => card.id === cardId)

      if (currentIndex === -1 || newIndex < 0 || newIndex >= cards.length)
        return state

      const [movedCard] = cards.splice(currentIndex, 1)
      cards.splice(newIndex, 0, movedCard)

      return {
        ...state,
        selectedDashboard: {
          ...state.selectedDashboard,
          tabs: state.selectedDashboard.tabs.map((t) =>
            t.id === tabId ? {...t, cards} : t
          ),
        },
      }
    }
  ),

  on(
    DashboardActions.updateCardTitle,
    (state, {tabId, cardId, title}): DashboardState => {
      if (!state.selectedDashboard) return state

      return {
        ...state,
        selectedDashboard: {
          ...state.selectedDashboard,
          tabs: state.selectedDashboard.tabs.map((tab) =>
            tab.id === tabId
              ? {
                  ...tab,
                  cards: tab.cards.map((card) =>
                    card.id === cardId ? {...card, title} : card
                  ),
                }
              : tab
          ),
        },
      }
    }
  ),

  on(
    DashboardActions.addItemToCard,
    (state, {tabId, cardId, item}): DashboardState => {
      if (!state.selectedDashboard) return state

      return {
        ...state,
        selectedDashboard: {
          ...state.selectedDashboard,
          tabs: state.selectedDashboard.tabs.map((tab) =>
            tab.id === tabId
              ? {
                  ...tab,
                  cards: tab.cards.map((card) =>
                    card.id === cardId
                      ? {...card, items: [...card.items, item]}
                      : card
                  ),
                }
              : tab
          ),
        },
      }
    }
  ),

  on(
    DashboardActions.removeItemFromCard,
    (state, {tabId, cardId, itemId}): DashboardState => {
      if (!state.selectedDashboard) return state

      return {
        ...state,
        selectedDashboard: {
          ...state.selectedDashboard,
          tabs: state.selectedDashboard.tabs.map((tab) =>
            tab.id === tabId
              ? {
                  ...tab,
                  cards: tab.cards.map((card) =>
                    card.id === cardId
                      ? {
                          ...card,
                          items: card.items.filter(
                            (item) => (item as any).id !== itemId
                          ),
                        }
                      : card
                  ),
                }
              : tab
          ),
        },
      }
    }
  ),

  on(
    DashboardActions.replaceCardItems,
    (state, {tabId, cardId, items}): DashboardState => {
      if (!state.selectedDashboard) return state

      return {
        ...state,
        selectedDashboard: {
          ...state.selectedDashboard,
          tabs: state.selectedDashboard.tabs.map((tab) =>
            tab.id === tabId
              ? {
                  ...tab,
                  cards: tab.cards.map((card) =>
                    card.id === cardId ? {...card, items} : card
                  ),
                }
              : tab
          ),
        },
      }
    }
  ),

  on(
    DashboardActions.loadDevices,
    (state): DashboardState => ({
      ...state,
      loading: {...state.loading, devices: true},
      error: {...state.error, devices: null},
    })
  ),

  on(
    DashboardActions.loadDevicesSuccess,
    (state, {devices}): DashboardState => ({
      ...state,
      availableDevices: devices,
      loading: {...state.loading, devices: false},
      error: {...state.error, devices: null},
    })
  ),

  on(
    DashboardActions.loadDevicesFailure,
    (state, {error}): DashboardState => ({
      ...state,
      loading: {...state.loading, devices: false},
      error: {...state.error, devices: error},
    })
  ),

  on(
    DashboardActions.toggleDeviceState,
    (state, {deviceId, newState}): DashboardState => {
      const updatedAvailableDevices = state.availableDevices.map((device) =>
        device.id === deviceId && device.type === 'device'
          ? {...device, state: newState}
          : device
      )

      let updatedDashboard = state.selectedDashboard
      if (updatedDashboard) {
        updatedDashboard = {
          ...updatedDashboard,
          tabs: updatedDashboard.tabs.map((tab) => ({
            ...tab,
            cards: tab.cards.map((card) => ({
              ...card,
              items: card.items.map((item) =>
                (item as any).id === deviceId && item.type === 'device'
                  ? {...item, state: newState}
                  : item
              ),
            })),
          })),
        }
      }

      return {
        ...state,
        availableDevices: updatedAvailableDevices,
        selectedDashboard: updatedDashboard,
        loading: {
          ...state.loading,
          deviceToggling: {
            ...state.loading.deviceToggling,
            [deviceId]: true,
          },
        },
      }
    }
  ),

  on(
    DashboardActions.toggleDeviceStateSuccess,
    (state, {deviceId}): DashboardState => {
      return {
        ...state,
        loading: {
          ...state.loading,
          deviceToggling: {
            ...state.loading.deviceToggling,
            [deviceId]: false,
          },
        },
        error: {
          ...state.error,
          devices: null,
        },
      }
    }
  ),

  on(
    DashboardActions.toggleDeviceStateFailure,
    (state, {deviceId, error}): DashboardState => {
      const originalDevice = state.availableDevices.find(
        (device) => device.id === deviceId
      )
      if (!originalDevice || originalDevice.type !== 'device') return state

      const revertedState = !originalDevice.state

      const revertedAvailableDevices = state.availableDevices.map((device) =>
        device.id === deviceId && device.type === 'device'
          ? {...device, state: revertedState}
          : device
      )

      let revertedDashboard = state.selectedDashboard
      if (revertedDashboard) {
        revertedDashboard = {
          ...revertedDashboard,
          tabs: revertedDashboard.tabs.map((tab) => ({
            ...tab,
            cards: tab.cards.map((card) => ({
              ...card,
              items: card.items.map((item) =>
                (item as any).id === deviceId && item.type === 'device'
                  ? {...item, state: revertedState}
                  : item
              ),
            })),
          })),
        }
      }

      return {
        ...state,
        availableDevices: revertedAvailableDevices,
        selectedDashboard: revertedDashboard,
        loading: {
          ...state.loading,
          deviceToggling: {
            ...state.loading.deviceToggling,
            [deviceId]: false,
          },
        },
        error: {...state.error, devices: error},
      }
    }
  ),

  on(
    DashboardActions.createDashboard,
    (state): DashboardState => ({
      ...state,
      loading: {...state.loading, saving: true},
      error: {...state.error, saving: null},
    })
  ),

  on(
    DashboardActions.createDashboardSuccess,
    (state): DashboardState => ({
      ...state,
      loading: {...state.loading, saving: false},
      error: {...state.error, saving: null},
    })
  ),

  on(
    DashboardActions.createDashboardFailure,
    (state, {error}): DashboardState => ({
      ...state,
      loading: {...state.loading, saving: false},
      error: {...state.error, saving: error},
    })
  ),

  on(
    DashboardActions.deleteDashboard,
    (state): DashboardState => ({
      ...state,
      loading: {...state.loading, saving: true},
      error: {...state.error, saving: null},
    })
  ),

  on(
    DashboardActions.deleteDashboardSuccess,
    (state): DashboardState => ({
      ...state,
      selectedDashboard: null,
      loading: {...state.loading, saving: false},
      error: {...state.error, saving: null},
      editMode: {
        isActive: false,
        originalDashboard: null,
      },
    })
  ),

  on(
    DashboardActions.deleteDashboardFailure,
    (state, {error}): DashboardState => ({
      ...state,
      loading: {...state.loading, saving: false},
      error: {...state.error, saving: error},
    })
  )
)
