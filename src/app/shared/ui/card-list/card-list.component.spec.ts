import {ComponentFixture, TestBed} from '@angular/core/testing'
import {MatDialog} from '@angular/material/dialog'
import {NoopAnimationsModule} from '@angular/platform-browser/animations'

import {CardListComponent} from './card-list.component'

describe('CardListComponent', () => {
  let component: CardListComponent
  let fixture: ComponentFixture<CardListComponent>
  let mockDialog: jasmine.SpyObj<MatDialog>

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open'])

    await TestBed.configureTestingModule({
      imports: [CardListComponent, NoopAnimationsModule],
      providers: [{provide: MatDialog, useValue: mockDialog}],
    }).compileComponents()

    fixture = TestBed.createComponent(CardListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should emit cardAdded when onAddCard is called and layout is selected', () => {
    spyOn(component.cardAdded, 'emit')
    const mockDialogRef = {
      afterClosed: () => ({
        subscribe: (callback: any) => callback('singleDevice'),
      }),
    }
    mockDialog.open.and.returnValue(mockDialogRef as any)

    component.onAddCard()

    expect(mockDialog.open).toHaveBeenCalled()
    expect(component.cardAdded.emit).toHaveBeenCalledWith('singleDevice')
  })

  it('should emit cardRemoved when onRemoveCard is called and confirmed', () => {
    spyOn(component.cardRemoved, 'emit')
    component.cards = [{id: 'card1', layout: 'singleDevice', items: []}]
    const mockDialogRef = {
      afterClosed: () => ({subscribe: (callback: any) => callback(true)}),
    }
    mockDialog.open.and.returnValue(mockDialogRef as any)

    component.onRemoveCard('card1')

    expect(mockDialog.open).toHaveBeenCalled()
    expect(component.cardRemoved.emit).toHaveBeenCalledWith('card1')
  })

  it('should emit cardReordered when onReorderCard is called', () => {
    spyOn(component.cardReordered, 'emit')
    component.cards = [
      {id: 'card1', layout: 'singleDevice', items: []},
      {id: 'card2', layout: 'singleDevice', items: []},
    ]

    component.onReorderCard('card1', 'down')

    expect(component.cardReordered.emit).toHaveBeenCalledWith({
      cardId: 'card1',
      newIndex: 1,
    })
  })

  it('should return correct canMoveUp status', () => {
    component.cards = [
      {id: 'card1', layout: 'singleDevice', items: []},
      {id: 'card2', layout: 'singleDevice', items: []},
    ]

    expect(component.canMoveUp('card1')).toBeFalse()
    expect(component.canMoveUp('card2')).toBeTrue()
  })

  it('should return correct canMoveDown status', () => {
    component.cards = [
      {id: 'card1', layout: 'singleDevice', items: []},
      {id: 'card2', layout: 'singleDevice', items: []},
    ]

    expect(component.canMoveDown('card1')).toBeTrue()
    expect(component.canMoveDown('card2')).toBeFalse()
  })
})
