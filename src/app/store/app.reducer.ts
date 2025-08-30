import {ActionReducerMap} from '@ngrx/store'
import {AppState} from './index'
import {dashboardReducer} from './dashboard/dashboard.reducer'

export const appReducers: ActionReducerMap<AppState> = {
  dashboard: dashboardReducer,
}
