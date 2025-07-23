import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Sensor } from '../../models/index';
import { SensorValuePipe } from '../../pipes/sensor-value.pipe';

@Component({
  selector: 'app-sensor',
  standalone: true,
  imports: [CommonModule, MatIconModule, SensorValuePipe],
  templateUrl: './sensor.component.html',
  styleUrl: './sensor.component.scss',
})
export class SensorComponent {
  @Input() sensor!: Sensor;
  @Input() layout: 'vertical' | 'horizontal' | 'grid' = 'vertical';

  get isHorizontalLayout(): boolean {
    return this.layout === 'horizontal';
  }

  get isVerticalLayout(): boolean {
    return this.layout === 'vertical' || this.layout === 'grid';
  }
}
