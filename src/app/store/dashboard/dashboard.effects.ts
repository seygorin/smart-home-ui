import {Injectable, inject} from '@angular/core'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {Router} from '@angular/router'
import {of} from 'rxjs'
import {map, catchError, switchMap, tap} from 'rxjs/operators'

import {DashboardService} from '../../core/services/dashboard.service'
import * as DashboardActions from './dashboard.actions'

@Injectable()
export class DashboardEffects {
  private actions$ = inject(Actions)
  private dashboardService = inject(DashboardService)
  private router = inject(Router)

  loadDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadDashboard),
      switchMap(({dashboardId}) =>
        this.dashboardService.getDashboardData(dashboardId).pipe(
          map((dashboard) =>
            DashboardActions.loadDashboardSuccess({dashboard})
          ),
          catchError((error) =>
            of(
              DashboardActions.loadDashboardFailure({
                error: error.message || 'Failed to load dashboard',
              })
            )
          )
        )
      )
    )
  )

  saveDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.saveDashboard),
      switchMap(({dashboardId, dashboard}) =>
        this.dashboardService.updateDashboard(dashboardId, dashboard).pipe(
          map((savedDashboard) =>
            DashboardActions.saveDashboardSuccess({dashboard: savedDashboard})
          ),
          catchError((error) =>
            of(
              DashboardActions.saveDashboardFailure({
                error: error.message || 'Failed to save dashboard',
              })
            )
          )
        )
      )
    )
  )

  createDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.createDashboard),
      switchMap(({dashboard}) =>
        this.dashboardService.createDashboard(dashboard).pipe(
          map((createdDashboard) =>
            DashboardActions.createDashboardSuccess({
              dashboard: createdDashboard,
            })
          ),
          catchError((error) =>
            of(
              DashboardActions.createDashboardFailure({
                error: error.message || 'Failed to create dashboard',
              })
            )
          )
        )
      )
    )
  )

  deleteDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.deleteDashboard),
      switchMap(({dashboardId}) =>
        this.dashboardService.deleteDashboard(dashboardId).pipe(
          map(() => DashboardActions.deleteDashboardSuccess({dashboardId})),
          catchError((error) =>
            of(
              DashboardActions.deleteDashboardFailure({
                error: error.message || 'Failed to delete dashboard',
              })
            )
          )
        )
      )
    )
  )

  loadDevices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadDevices),
      switchMap(() =>
        this.dashboardService.getDevices().pipe(
          map((devices) => DashboardActions.loadDevicesSuccess({devices})),
          catchError((error) =>
            of(
              DashboardActions.loadDevicesFailure({
                error: error.message || 'Failed to load devices',
              })
            )
          )
        )
      )
    )
  )

  toggleDeviceState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.toggleDeviceState),
      switchMap(({deviceId, newState}) =>
        this.dashboardService.updateDeviceState(deviceId, newState).pipe(
          map(() =>
            DashboardActions.toggleDeviceStateSuccess({deviceId, newState})
          ),
          catchError((error) =>
            of(
              DashboardActions.toggleDeviceStateFailure({
                deviceId,
                error: error.message || 'Failed to toggle device state',
              })
            )
          )
        )
      )
    )
  )

  createDashboardSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardActions.createDashboardSuccess),
        tap(({dashboard}) => {
          this.dashboardService.refreshDashboards()
          this.router.navigate(['/dashboard', dashboard.id])
        })
      ),
    {dispatch: false}
  )

  deleteDashboardSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardActions.deleteDashboardSuccess),
        tap(() => {
          this.dashboardService.refreshDashboards()
          const firstDashboard =
            this.dashboardService.getFirstAvailableDashboard()
          if (firstDashboard) {
            this.router.navigate(['/dashboard', firstDashboard.id])
          } else {
            this.router.navigate(['/'])
          }
        })
      ),
    {dispatch: false}
  )

  saveDashboardSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardActions.saveDashboardSuccess),
        tap(() => {
          this.dashboardService.clearCache()
        })
      ),
    {dispatch: false}
  )
}
