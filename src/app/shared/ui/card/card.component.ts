import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Card, CardItem, Device, Sensor } from '../../models/index';
import { DeviceComponent } from '../device/device.component';
import { SensorComponent } from '../sensor/sensor.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    MatSlideToggleModule,
    DeviceComponent,
    SensorComponent,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent implements OnInit {
  @Input() card!: Card;
  @Output() stateChanged = new EventEmitter<Device>();

  localItems: CardItem[] = [];
  showGroupToggle = false;
  groupToggleState = false;

  ngOnInit(): void {
    this.localItems = [...this.card.items];
    this.showGroupToggle = this.getControllableDevices().length >= 2;
    this.updateGroupToggleState();
  }

  onDeviceStateChange(device: Device): void {
    const index = this.localItems.indexOf(device);
    if (index !== -1) {
      (this.localItems[index] as Device).state = device.state;
    }
    this.updateGroupToggleState();
    this.stateChanged.emit(device);
  }

  onGroupToggleChange(checked: boolean): void {
    for (const device of this.getControllableDevices()) {
      device.state = checked;
      this.stateChanged.emit(device);
    }
    this.updateGroupToggleState();
  }

  private getControllableDevices(): Device[] {
    return this.localItems.filter(
      (item): item is Device => item.type === 'device'
    );
  }

  private updateGroupToggleState(): void {
    this.groupToggleState = this.getControllableDevices().some(
      (device) => device.state
    );
  }

  trackById(_index: number, item: CardItem): string {
    return item.label;
  }

  isDevice(item: CardItem): item is Device {
    return item.type === 'device';
  }

  isSensor(item: CardItem): item is Sensor {
    return item.type === 'sensor';
  }

  getLayoutClass(): string {
    switch (this.card.layout) {
      case 'singleDevice': {
        return 'single';
      }
      case 'horizontalLayout': {
        return 'horizontal';
      }
      case 'verticalLayout': {
        return 'vertical';
      }
      default: {
        return 'default';
      }
    }
  }
}
