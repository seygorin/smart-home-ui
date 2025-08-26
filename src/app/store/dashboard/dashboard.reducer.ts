import {createReducer} from '@ngrx/store'
import {initialDashboardState} from './dashboard.state'

export const dashboardReducer = createReducer(
  initialDashboardState
)
