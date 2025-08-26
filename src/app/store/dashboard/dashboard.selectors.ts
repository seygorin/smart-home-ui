import {createFeatureSelector, createSelector} from '@ngrx/store'
import {DashboardState} from './dashboard.state'

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

export const selectDashboardLoading = createSelector(
  selectDashboardState,
  (state) => state.loading.dashboard
)
