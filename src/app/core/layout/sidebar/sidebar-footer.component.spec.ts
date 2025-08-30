import {ComponentFixture, TestBed} from '@angular/core/testing'
import {MatDialog} from '@angular/material/dialog'
import {NoopAnimationsModule} from '@angular/platform-browser/animations'

import {SidebarFooterComponent} from './sidebar-footer.component'
import {DashboardCreationModalComponent} from '../../../shared/ui/dashboard-creation-modal/dashboard-creation-modal.component'

describe('SidebarFooterComponent', () => {
  let component: SidebarFooterComponent
  let fixture: ComponentFixture<SidebarFooterComponent>
  let mockDialog: jasmine.SpyObj<MatDialog>

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open'])

    await TestBed.configureTestingModule({
      imports: [SidebarFooterComponent, NoopAnimationsModule],
      providers: [{provide: MatDialog, useValue: mockDialog}],
    }).compileComponents()

    fixture = TestBed.createComponent(SidebarFooterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should emit logout event when logout button is clicked', () => {
    spyOn(component.logout, 'emit')
    component.userProfile = {fullName: 'Test User', initials: 'TU'}
    fixture.detectChanges()

    component.onLogout()

    expect(component.logout.emit).toHaveBeenCalled()
  })

  it('should open dashboard creation modal when add dashboard button is clicked', () => {
    const mockDialogRef = {
      afterClosed: () => ({subscribe: jasmine.createSpy('subscribe')}),
    }
    mockDialog.open.and.returnValue(mockDialogRef as any)

    component.onAddDashboard()

    expect(mockDialog.open).toHaveBeenCalledWith(
      DashboardCreationModalComponent,
      {
        width: '500px',
        disableClose: false,
        autoFocus: true,
      }
    )
  })

  it('should display add dashboard button', () => {
    const compiled = fixture.nativeElement as HTMLElement
    const addButton = compiled.querySelector('.add-dashboard-button')

    expect(addButton).toBeTruthy()
    expect(addButton?.textContent?.trim()).toContain('Add Dashboard')
  })

  it('should show only icon when collapsed', () => {
    component.isCollapsed = true
    fixture.detectChanges()

    const compiled = fixture.nativeElement as HTMLElement
    const addButton = compiled.querySelector('.add-dashboard-button')

    expect(addButton?.classList).toContain('icon-only')
  })
})
