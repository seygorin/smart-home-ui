import {Component, Input, Output, EventEmitter, inject} from '@angular/core'
import {CommonModule} from '@angular/common'
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'
import {MatMenuModule} from '@angular/material/menu'
import {MatDialog} from '@angular/material/dialog'
import {Card, CardLayout} from '../../models/index'
import {CardComponent} from '../card/card.component'
import {CardLayoutModalComponent} from '../card-layout-modal/card-layout-modal.component'
import {
  ConfirmationModalComponent,
  ConfirmationModalData,
} from '../confirmation-modal/confirmation-modal.component'
import {EmptyStateComponent} from '../empty-state/empty-state.component'
import {LoadingStateComponent} from '../loading-state/loading-state.component'

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    CardComponent,
    EmptyStateComponent,
    LoadingStateComponent,
  ],
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss',
})
export class CardListComponent {
  private readonly dialog = inject(MatDialog)

  @Input() cards: Card[] = []
  @Input() editMode = false
  @Input() loading = false

  @Output() cardAdded = new EventEmitter<CardLayout>()
  @Output() cardRemoved = new EventEmitter<string>()
  @Output() cardReordered = new EventEmitter<{
    cardId: string
    newIndex: number
  }>()
  @Output() cardContentEdited = new EventEmitter<string>

  onAddCard(): void {
    const dialogRef = this.dialog.open(CardLayoutModalComponent, {
      width: '600px',
      disableClose: false,
    })

    dialogRef.afterClosed().subscribe((layout: CardLayout | undefined) => {
      if (layout) {
        this.cardAdded.emit(layout)
      }
    })
  }

  onRemoveCard(cardId: string): void {
    const card = this.cards.find((c) => c.id === cardId)
    if (!card) return

    const confirmationData: ConfirmationModalData = {
      title: 'Delete Card',
      message: `Are you sure you want to delete this card${
        card.title ? ` "${card.title}"` : ''
      }? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDestructive: true,
    }

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: confirmationData,
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.cardRemoved.emit(cardId)
      }
    })
  }

  onReorderCard(cardId: string, direction: 'up' | 'down'): void {
    const currentIndex = this.cards.findIndex((card) => card.id === cardId)
    if (currentIndex === -1) return

    let newIndex: number
    if (direction === 'up' && currentIndex > 0) {
      newIndex = currentIndex - 1
    } else if (direction === 'down' && currentIndex < this.cards.length - 1) {
      newIndex = currentIndex + 1
    } else {
      return
    }

    this.cardReordered.emit({cardId, newIndex})
  }

  onEditCardContent(cardId: string): void {
    this.cardContentEdited.emit(cardId)
  }

  canMoveUp(cardId: string): boolean {
    const index = this.cards.findIndex((card) => card.id === cardId)
    return index > 0
  }

  canMoveDown(cardId: string): boolean {
    const index = this.cards.findIndex((card) => card.id === cardId)
    return index >= 0 && index < this.cards.length - 1
  }

  getCardPosition(cardId: string): number {
    return this.cards.findIndex((card) => card.id === cardId) + 1
  }
}
