import { Pipe, PipeTransform } from '@angular/core';
import { SensorValue } from '../models/index';

@Pipe({
  name: 'sensorValue',
  standalone: true,
  pure: true,
})
export class SensorValuePipe implements PipeTransform {
  transform(value: SensorValue): string {
    if (!value) return '';
    return `${value.amount} ${value.unit}`;
  }
}
