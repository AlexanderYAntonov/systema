import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formCounter'
})
export class FormCounterPipe implements PipeTransform {
  mapValues = {
    W: 2,
    L: 0,
    D: 1
  }

  transform(list: string[], ...args: unknown[]): number {
    if (!list) return 0;
    const mappedList = list.map(key => this.mapValues[key]);
    const sum = mappedList.reduce((acc, item) => item + acc, 0);
    return sum;
  }

}
