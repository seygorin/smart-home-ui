import {Injectable, inject} from '@angular/core'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {Router} from '@angular/router'
import {of} from 'rxjs'
import {map, catchError, switchMap, tap, retry} from 'rxjs/operators'

import {DashboardService} from '../../core/services/dashboard.service'
import {NavigationService} from '../../core/services/navigation.service'
import {DashboardNavigationService} from '../../core/services/dashboard-navigation.service'
import {NotificationService} from '../../shared/services/notification.service'
import {LoadingService} from '../../shared/services/loading.service'
import {ErrorHandlerService} from '../../core/services/error-handler.service'
import * as DashboardActions from './dashboard.actions'

@Injectable()
export class DashboardEffects {
  private actions$ = inject(Actions)
  private dashboardService = inject(DashboardService)
  private navigationService = inject(NavigationService)
  private dashboardNavigationService = inject(DashboardNavigationService)
  private router = inject(Router)
  private notificationService = inject(NotificationService)
  private loadingService = inject(LoadingService)
  private errorHandlerService = inject(ErrorHandlerService)

  loadDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadDashboard),
      tap(() => this.loadingService.setLoading('loadDashboard', true)),
      switchMap(({dashboardId}) =>
        this.dashboardService.getDashboardData(dashboardId).pipe(
          retry({count: 2, delay: 1000}),
          map((dashboard) => {
            this.loadingService.setLoading('loadDashboard', false)
            return DashboardActions.loadDashboardSuccess({dashboard})
          }),
          catchError((error) => {
            this.loadingService.setLoading('loadDashboard', false)
            const handledError = this.errorHandlerService.handleHttpError(error)
            return of(
              DashboardActions.loadDashboardFailure({
                error: handledError.userMessage,
              })
            )
          })
        )
      )
    )
  )

  saveDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.saveDashboard),
      tap(() => this.loadingService.setLoading('saveDashboard', true)),
      switchMap(({dashboardId, dashboard}) =>
        this.dashboardService.updateDashboard(dashboardId, dashboard).pipe(
          map((savedDashboard) => {
            this.loadingService.setLoading('saveDashboard', false)
            return DashboardActions.saveDashboardSuccess({
              dashboard: savedDashboard,
            })
          }),
          catchError((error) => {
            this.loadingService.setLoading('saveDashboard', false)
            const handledError = this.errorHandlerService.handleHttpError(error)
            return of(
              DashboardActions.saveDashboardFailure({
                error: handledError.userMessage,
              })
            )
          })
        )
      )
    )
  )

  createDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.createDashboard),
      tap(() => this.loadingService.setLoading('createDashboard', true)),
      switchMap(({dashboard}) =>
        this.dashboardService.createDashboard(dashboard).pipe(
          map((createdDashboard) => {
            this.loadingService.setLoading('createDashboard', false)
            return DashboardActions.createDashboardSuccess({
              dashboard: createdDashboard,
            })
          }),
          catchError((error) => {
            this.loadingService.setLoading('createDashboard', false)
            const handledError = this.errorHandlerService.handleHttpError(error)
            return of(
              DashboardActions.createDashboardFailure({
                error: handledError.userMessage,
              })
            )
          })
        )
      )
    )
  )

  deleteDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.deleteDashboard),
      tap(() => this.loadingService.setLoading('deleteDashboard', true)),
      switchMap(({dashboardId}) =>
        this.dashboardService.deleteDashboard(dashboardId).pipe(
          map(() => {
            this.loadingService.setLoading('deleteDashboard', false)
            return DashboardActions.deleteDashboardSuccess({dashboardId})
          }),
          catchError((error) => {
            this.loadingService.setLoading('deleteDashboard', false)
            const handledError = this.errorHandlerService.handleHttpError(error)
            return of(
              DashboardActions.deleteDashboardFailure({
                error: handledError.userMessage,
              })
            )
          })
        )
      )
    )
  )

  loadDevices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadDevices),
      tap(() => this.loadingService.setLoading('loadDevices', true)),
      switchMap(() =>
        this.dashboardService.getDevices().pipe(
          retry({count: 2, delay: 1000}),
          map((devices) => {
            this.loadingService.setLoading('loadDevices', false)
            return DashboardActions.loadDevicesSuccess({devices})
          }),
          catchError((error) => {
            this.loadingService.setLoading('loadDevices', false)
            const handledError = this.errorHandlerService.handleHttpError(error)
            return of(
              DashboardActions.loadDevicesFailure({
                error: handledError.userMessage,
              })
            )
          })
        )
      )
    )
  )

  toggleDeviceState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.toggleDeviceState),
      tap(({deviceId}) =>
        this.loadingService.setLoading(`toggleDevice_${deviceId}`, true)
      ),
      switchMap(({deviceId, newState}) =>
        this.dashboardService.updateDeviceState(deviceId, newState).pipe(
          retry({count: 1, delay: 500}),
          map(() => {
            this.loadingService.setLoading(`toggleDevice_${deviceId}`, false)
            return DashboardActions.toggleDeviceStateSuccess({
              deviceId,
              newState,
            })
          }),
          catchError((error) => {
            this.loadingService.setLoading(`toggleDevice_${deviceId}`, false)
            const handledError = this.errorHandlerService.handleHttpError(error)
            return of(
              DashboardActions.toggleDeviceStateFailure({
                deviceId,
                error: handledError.userMessage,
              })
            )
          })
        )
      )
    )
  )

  toggleDeviceStateSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardActions.toggleDeviceStateSuccess),
        tap(({deviceId, newState}) => {
          this.notificationService.info(
            `Device ${newState ? 'turned on' : 'turned off'} successfully`,
            {duration: 2000}
          )
        })
      ),
    {dispatch: false}
  )

  toggleDeviceStateFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardActions.toggleDeviceStateFailure),
        tap(({error}) => {
          this.notificationService.error(`Failed to update device: ${error}`)
        })
      ),
    {dispatch: false}
  )

  createDashboardSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.createDashboardSuccess),
      tap(({dashboard}) => {
        this.notificationService.successWithAction(
          `Dashboard "${dashboard.title}" created successfully!`,
          'View Dashboard'
        )
        this.dashboardService.refreshDashboards().subscribe()
      }),
      switchMap(({dashboard}) => {
        const defaultDashboardData = {
          tabs: [
            {
              id: 'main',
              title: 'Main',
              cards: [],
            },
          ],
        }

        return this.dashboardService
          .updateDashboard(dashboard.id, defaultDashboardData)
          .pipe(
            map(() =>
              DashboardActions.createDashboardWithDefaultTab({
                dashboardId: dashboard.id,
              })
            ),
            catchError((error) => {
              console.error('Failed to create default tab:', error)
              this.navigationService.navigateToNewDashboard(dashboard.id)
              return of(
                DashboardActions.createDashboardWithDefaultTabFailure({
                  error: 'Failed to create default tab',
                })
              )
            })
          )
      })
    )
  )

  deleteDashboardSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardActions.deleteDashboardSuccess),
        tap(() => {
          this.notificationService.success('Dashboard deleted successfully!', {
            duration: 4000,
          })
          this.navigationService.navigateToFirstAvailableDashboard()
        })
      ),
    {dispatch: false}
  )

  saveDashboardSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardActions.saveDashboardSuccess),
        tap(() => {
          this.notificationService.success('Dashboard saved successfully!', {
            duration: 3000,
          })
          this.dashboardService.clearCache()
        })
      ),
    {dispatch: false}
  )

  createDashboardFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardActions.createDashboardFailure),
        tap(({error}) => {
          this.notificationService.error(`Failed to create dashboard: ${error}`)
        })
      ),
    {dispatch: false}
  )

  deleteDashboardFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardActions.deleteDashboardFailure),
        tap(({error}) => {
          this.notificationService.error(`Failed to delete dashboard: ${error}`)
        })
      ),
    {dispatch: false}
  )

  saveDashboardFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardActions.saveDashboardFailure),
        tap(({error}) => {
          this.notificationService.error(`Failed to save dashboard: ${error}`)
        })
      ),
    {dispatch: false}
  )

  loadDashboardFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardActions.loadDashboardFailure),
        tap(({error}) => {
          this.notificationService.error(`Failed to load dashboard: ${error}`)
        })
      ),
    {dispatch: false}
  )

  loadDevicesFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardActions.loadDevicesFailure),
        tap(({error}) => {
          this.notificationService.error(`Failed to load devices: ${error}`)
        })
      ),
    {dispatch: false}
  )

  createDashboardWithDefaultTab$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardActions.createDashboardWithDefaultTab),
        tap(({dashboardId}) => {
          this.navigationService.navigateToNewDashboard(dashboardId)
        })
      ),
    {dispatch: false}
  )

  createDashboardWithDefaultTabFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardActions.createDashboardWithDefaultTabFailure),
        tap(({error}) => {
          this.notificationService.warning(`Dashboard created but ${error}`)
        })
      ),
    {dispatch: false}
  )
}
