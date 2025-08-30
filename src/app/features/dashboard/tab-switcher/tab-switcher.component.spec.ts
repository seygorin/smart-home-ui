import {ComponentFixture, TestBed} from '@angular/core/testing'
import {NoopAnimationsModule} from '@angular/platform-browser/animations'
import {provideHttpClient} from '@angular/common/http'
import {provideHttpClientTesting} from '@angular/common/http/testing'

import {TabSwitcherComponent} from './tab-switcher.component'

describe('TabSwitcherComponent', () => {
  let component: TabSwitcherComponent
  let fixture: ComponentFixture<TabSwitcherComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabSwitcherComponent, NoopAnimationsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents()

    fixture = TestBed.createComponent(TabSwitcherComponent)
    component = fixture.componentInstance

    component.tabs = [
      {id: 'tab1', title: 'Tab 1', cards: []},
      {id: 'tab2', title: 'Tab 2', cards: []},
    ]
    component.selectedTabId = 'tab1'

    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
