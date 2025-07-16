import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sensorValue'
})
export class SensorValuePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
