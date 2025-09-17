export interface LoginRequest {
  userName: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface UserProfile {
  fullName: string
  initials: string
}

export interface DashboardInfo {
  id: string
  title: string
  icon: string
}

export interface DashboardData {
  tabs: Tab[]
}

export interface Tab {
  id: string
  title: string
  cards: Card[]
}

export interface Card {
  id: string
  title?: string 
  layout: 'singleDevice' | 'horizontalLayout' | 'verticalLayout'
  items: CardItem[]
}

export interface DeviceItem {
  id: string
  type: 'device'
  icon: string
  label: string
  state: boolean
}

export interface SensorItem {
  id: string
  type: 'sensor'
  icon: string
  label: string
  value: {
    amount: number
    unit: string
  }
}

export type CardItem = DeviceItem | SensorItem

export interface ApiError {
  message: string
  statusCode?: number
}

export interface SensorValue {
  amount: number
  unit: string
}

export interface CardItemBase {
  icon: string
  label: string
}

export interface Sensor extends CardItemBase {
  id: string
  type: 'sensor'
  value: SensorValue
}

export interface Device extends CardItemBase {
  id: string
  type: 'device'
  state: boolean
}

export type SensorLegacy = Sensor
export type DeviceLegacy = Device

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

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

export interface ValidationError {
  field: string
  message: string
}
