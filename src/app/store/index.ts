import {DashboardState} from './dashboard/dashboard.state'

export interface AppState {
  dashboard: DashboardState
}

export * from './dashboard/dashboard.state'
export * from './dashboard/dashboard.selectors'
export * from './dashboard/dashboard.reducer'
export * from './dashboard/dashboard.effects'
