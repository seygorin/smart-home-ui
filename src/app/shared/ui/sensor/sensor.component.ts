import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Sensor } from '../../models/index';

@Component({
  selector: 'app-sensor',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './sensor.component.html',
  styleUrl: './sensor.component.scss',
})
export class SensorComponent {
  @Input() sensor!: Sensor;
}
