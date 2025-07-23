import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { Device } from '../../models/index';

@Component({
  selector: 'app-device',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, MatIconModule],
  templateUrl: './device.component.html',
  styleUrl: './device.component.scss',
})
export class DeviceComponent {
  @Input() device!: Device;
  @Input() isSingle = false;
  @Output() stateChanged = new EventEmitter<Device>();

  onToggle(change?: boolean): void {
    this.device.state = change ?? !this.device.state;
    this.stateChanged.emit(this.device);
  }

  getIconColor(): string {
    return this.device.state ? 'primary' : 'grey';
  }
}
