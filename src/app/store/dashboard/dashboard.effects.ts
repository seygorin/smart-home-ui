import {Injectable} from '@angular/core'
import {Actions} from '@ngrx/effects'

@Injectable()
export class DashboardEffects {
  constructor(private actions$: Actions) {}
}
