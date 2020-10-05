import { Injectable } from '@angular/core';
import {
  Vektor,
  NormalVektor,
  WinsPoint,
  GoalsPoint,
  Point,
  Result,
  DistantVektor,
  Prediction,
  PredictResult
} from '../models/vektor';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

const url = 'assets/json/stat.json';
const predictKoeff = 19;

@Injectable({
  providedIn: 'root'
})
export class VektorService {
  baseVektorList: NormalVektor[];
  predictionVektorList: NormalVektor[];
  constructor(private http: HttpClient) {}

  loadData(): Observable<NormalVektor[]> {
    return this.http
      .get<Vektor[]>(url)
      .pipe(map((list) => this.convertVektorList(list)));
    // .subscribe((list: NormalVektor[]) => {
    //   this.baseVektorList = list.slice(50);
    //   this.predictionVektorList = list.slice(0, 50);
    // });
  }

  private convertVektorList(list: Vektor[]): NormalVektor[] {
    return list.map((item) => this.normalize(item));
  }

  private normalize(vektor: Vektor): NormalVektor {
    const { homeTotal, visitorTotal, homeIn, visitorOut } = vektor;
    const homeTotalMatchesPoint: WinsPoint = this.calcWinsPoint(homeTotal);
    const homeInMatchesPoint: WinsPoint = this.calcWinsPoint(homeIn);
    const visitorTotalMatchesPoint: WinsPoint = this.calcWinsPoint(
      visitorTotal
    );
    const visitorOutMatchesPoint: WinsPoint = this.calcWinsPoint(visitorOut);
    const homeTotalGoalsPoint: GoalsPoint = this.calcGoalsPoint(homeTotal);
    const visitorTotalGoalsPoint: GoalsPoint = this.calcGoalsPoint(
      visitorTotal
    );
    const homeInGoalsPoint: GoalsPoint = this.calcGoalsPoint(homeIn);
    const visitorOutGoalsPoint: GoalsPoint = this.calcGoalsPoint(visitorOut);
    return new NormalVektor(
      homeTotalMatchesPoint,
      homeInMatchesPoint,
      visitorTotalMatchesPoint,
      visitorOutMatchesPoint,
      homeTotalGoalsPoint,
      homeInGoalsPoint,
      visitorTotalGoalsPoint,
      visitorOutGoalsPoint,
      vektor.result
    );
  }

  calcWinsPoint(source: string): WinsPoint {
    const arr = source
      .split(' ')
      .filter((item) => item !== ':')
      .map((item) => parseInt(item, 10));
    const count: number = arr[0] + arr[1] + arr[2];
    const point: WinsPoint = {
      wins: this.roundDigits(arr[0] / count, 2),
      equals: this.roundDigits(arr[1] / count, 2),
      loses: this.roundDigits(arr[2] / count, 2)
    };
    return point;
  }

  calcGoalsPoint(source: string): GoalsPoint {
    const arr = source
      .split(' ')
      .filter((item) => item !== ':')
      .map((item) => parseInt(item, 10));
    const count: number = arr[5] + arr[6];
    const point: GoalsPoint = {
      shots: this.roundDigits(arr[5] / count, 2),
      loses: this.roundDigits(arr[6] / count, 2)
    };
    return point;
  }

  calcDistance(vektorA: NormalVektor, vektorB: NormalVektor): number {
    let distance = 0;
    for (let key in vektorA) {
      distance += this.roundDigits(
        this.calcDistancePoints(vektorA[key], vektorB[key]),
        4
      );
    }
    distance = this.roundDigits(distance, 4);
    return distance;
  }

  calcDistancePoints(pointA: Point, pointB: Point): number {
    let distance = 0;
    for (let key in pointA) {
      const raw = Math.pow(pointA[key] - pointB[key], 2);
      distance += this.roundDigits(raw, 4);
    }
    return distance;
  }

  private roundDigits(num: number, digits: number): number {
    const koef = Math.pow(10, digits);
    return Math.round(num * koef) / koef;
  }

  calcTestPredictions(): Observable<PredictResult[]> {
    return this.loadData().pipe(
      map((list: NormalVektor[]) => {
        const baseVektorList = list.slice(50);
        const predictionVektorList = list.slice(0, 50);
        const predictions = predictionVektorList.map((vektor) => ({
          prediction: this.predictResult(vektor, baseVektorList),
          result: vektor.result
        }));
        return predictions;
      })
    );
  }

  predictResult(vektor: NormalVektor, base: NormalVektor[]): Prediction {
    const results: Result[] = this.findKCloseVektors(
      vektor,
      base,
      predictKoeff
    );
    const winsCount = results.filter((item) => item === Result.Win).length;
    const equalsCount = results.filter((item) => item === Result.Equal).length;
    const losesCount = results.filter((item) => item === Result.Lose).length;
    const winsPart = this.roundDigits(winsCount / predictKoeff, 2);
    const equalsPart = this.roundDigits(equalsCount / predictKoeff, 2);
    const losesPart = this.roundDigits(losesCount / predictKoeff, 2);

    const parts: number[] = [ winsPart, equalsPart, losesPart ];
    const maxPart = Math.max(...parts);
    let result;

    // TO DO DRY
    if (winsPart === maxPart) {
      result = Result.Win;
    }

    if (equalsPart === maxPart) {
      result = Result.Equal;
    }

    if (losesPart === maxPart) {
      result = Result.Lose;
    }

    const prediction: Prediction = new Prediction(result, maxPart);
    return prediction;
  }

  private findKCloseVektors(
    vektor: NormalVektor,
    searchBase: NormalVektor[],
    k: number
  ): Result[] {
    const distances: DistantVektor[] = searchBase.map((item) => ({
      ...item,
      distance: this.calcDistance(vektor, item)
    }));
    const sortedDistances: DistantVektor[] = distances.sort(
      (a, b) => a.distance - b.distance
    );
    const results: Result[] = sortedDistances
      .slice(0, k)
      .map((item) => item.result);
    return results;
  }
}
