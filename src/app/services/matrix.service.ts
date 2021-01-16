import { Injectable } from '@angular/core';
import { Column, PredictType, Char } from '../models/matrix';

@Injectable({
  providedIn: 'root'
})
export class MatrixService {

  constructor() { }

  charsToIndex(chars: Char[], pattern: PredictType = 3): number {
    const length = chars.length;
    const pow = 3; // TO DO change to pattern
    const convertedNumbers: number[] = chars.map((item, index) => Math.pow(3, length - index - 1) * item);
    const result: number = convertedNumbers.reduce((prev, curr) => prev + curr);
    return result;
  }

  indexToChars(index: number): Char[] {
    const result = [];
    
    return result;
  }
}
