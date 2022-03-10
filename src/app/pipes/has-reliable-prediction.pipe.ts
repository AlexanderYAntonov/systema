import { Pipe, PipeTransform } from '@angular/core';
import { Prediction, Result } from '../models/vektor';

@Pipe({
  name: 'hasReliablePrediction'
})
export class HasReliablePredictionPipe implements PipeTransform {

  transform(predictions: Prediction[], ...args: unknown[]): boolean {
    if (!predictions) return false;

    const index = predictions.findIndex(item =>
      item.part >= 0.7 && item.result === Result.Lose && item.epsilon >= 0.5);
    return index >= 0;
  }

}
