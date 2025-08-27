import {
  DashboardData,
  DeviceItem as BaseDeviceItem,
  SensorItem as BaseSensorItem,
  Card as BaseCard,
} from '../../shared/models'

export interface DeviceItem extends BaseDeviceItem {
  id: string
}

export interface SensorItem extends BaseSensorItem {
  id: string
}

export interface Card extends BaseCard {
  title?: string
}

export type CardLayout = 'singleDevice' | 'horizontalLayout' | 'verticalLayout'

export interface CreateDashboardRequest {
  id: string
  title: string
  icon: string
}

export interface DashboardFormData {
  id: string
  title: string
  icon: string
}

export interface TabFormData {
  title: string
}

export type CardItem = DeviceItem | SensorItem

export interface DashboardState {
  selectedDashboard: DashboardData | null

  editMode: {
    isActive: boolean
    originalDashboard: DashboardData | null
  }

  availableDevices: (DeviceItem | SensorItem)[]

  loading: {
    dashboard: boolean
    devices: boolean
    saving: boolean
  }

  error: {
    dashboard: string | null
    devices: string | null
    saving: string | null
  }
}

export const initialDashboardState: DashboardState = {
  selectedDashboard: null,
  editMode: {
    isActive: false,
    originalDashboard: null,
  },
  availableDevices: [],
  loading: {
    dashboard: false,
    devices: false,
    saving: false,
  },
  error: {
    dashboard: null,
    devices: null,
    saving: null,
  },
}
