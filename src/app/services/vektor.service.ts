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
  PredictResult,
  PredictPart
} from '../models/vektor';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

const url = 'assets/json/stat.json';
const predictKoeff = 7;

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
    source = source.replace(':', ' ');
    const arr = source
      .split(' ')
      .map((item) => parseInt(item, 10))
      .filter((item) => !isNaN(item));
    const count: number = arr[3] + arr[4];
    const point: GoalsPoint = {
      shots: this.roundDigits(arr[3] / count, 2),
      loses: this.roundDigits(arr[4] / count, 2)
    };
    return point;
  }

  calcDistance(vektorA: NormalVektor, vektorB: NormalVektor): number {
    let distance = 0;
    for (let key in vektorA) {
      if (key !== 'result') {
        distance += this.roundDigits(
          this.calcDistancePoints(vektorA[key], vektorB[key]),
          4
        );
      }
    }
    // if (isNaN(distance)) {
    //   console.table(vektorA);
    //   console.table(vektorB);
    // }
    distance = this.roundDigits(distance, 4);
    return distance;
  }

  calcDistancePoints(pointA: Point, pointB: Point): number {
    let distance = 0;
    for (let key in pointA) {
      const raw: number = Math.pow(pointA[key] - pointB[key], 2);
      distance += Number.isNaN(raw) ? 0 : this.roundDigits(raw, 4);
    }
    return distance;
  }

  private roundDigits(num: number, digits: number): number {
    const koef = Math.pow(10, digits);
    return Math.round(num * koef) / koef;
  }

  calcTestPredictions(
    testGroupSize = 50,
    koef = predictKoeff
  ): Observable<PredictResult[]> {
    return this.loadData().pipe(
      map((list: NormalVektor[]) => {
        const baseVektorList = list.slice(testGroupSize);
        const predictionVektorList = list.slice(0, testGroupSize);
        const predictions = predictionVektorList.map(
          (vektor) =>
            new PredictResult(
              this.predictResult(vektor, baseVektorList, koef),
              vektor.result
            )
        );
        return predictions;
      })
    );
  }

  calcPrediction(
    vektor: NormalVektor,
    koef = predictKoeff
  ): Observable<Prediction> {
    return this.loadData().pipe(
      map((list: NormalVektor[]) => this.predictResult(vektor, list, koef))
    );
  }

  predictResult(
    vektor: NormalVektor,
    base: NormalVektor[],
    koef = predictKoeff
  ): Prediction {
    const parts: PredictPart[] = this.getPredictionParts(vektor, base, koef);
    const prediction = new Prediction(
      parts[0].result,
      parts[0].part,
      [ parts[0].result, parts[1].result ],
      parts[0].part + parts[1].part
    );
    return prediction;
  }

  getPredictionParts(
    vektor: NormalVektor,
    base: NormalVektor[],
    koef: number
  ): PredictPart[] {
    const results: Result[] = this.findKCloseVektors(vektor, base, koef);
    const winsCount = results.filter((item) => item === Result.Win).length;
    const equalsCount = results.filter((item) => item === Result.Equal).length;
    const losesCount = results.filter((item) => item === Result.Lose).length;
    const winsPart = this.roundDigits(winsCount / koef, 2);
    const equalsPart = this.roundDigits(equalsCount / koef, 2);
    const losesPart = this.roundDigits(losesCount / koef, 2);

    let parts = [
      {
        part: winsPart,
        result: Result.Win
      },
      {
        part: equalsPart,
        result: Result.Equal
      },
      {
        part: losesPart,
        result: Result.Lose
      }
    ];
    parts = parts.sort((a, b) => b.part - a.part);
    console.log(parts);
    return parts;
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
    // console.log(sortedDistances.length);
    // console.log(`0: ${sortedDistances[0].distance}`);
    // console.log(`10: ${sortedDistances[10].distance}`);
    // console.log(`50: ${sortedDistances[50].distance}`);
    // console.log(`100: ${sortedDistances[100].distance}`);
    // console.log(`500: ${sortedDistances[500].distance}`);
    const results: Result[] = sortedDistances
      .slice(0, k)
      .map((item) => item.result);
    return results;
  }

  renormalizeVektor(vektor: NormalVektor): NormalVektor {
    for (let key in vektor) {
      if (key !== 'result') {
        vektor[key] = this.renormalizePoint(vektor[key]);
      }
    }
    return vektor;
  }

  renormalizePoint(point: Point): Point {
    let total = 0;
    for (let key in point) {
      total += point[key];
    }
    for (let key in point) {
      point[key] = this.roundDigits(point[key] / total, 2);
    }
    return point;
  }
}
