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
  PredictPart,
} from '../models/vektor';
import { HttpClient } from '@angular/common/http';
import { concatMap, map, tap } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { BaseService } from './base.service';

const predictKoeffInit = 7;

@Injectable({
  providedIn: 'root',
})
export class VektorService {
  
  baseVektorList: NormalVektor[];
  predictionVektorList: NormalVektor[];
  predictKoeff = 7;
  constructor(
    private http: HttpClient,
    private baseService: BaseService
  ) {}

  loadData(): Observable<NormalVektor[]> {
    return this.baseService.getUrl().pipe(
      concatMap((url) => {
        let result$ = this.http.get<Vektor[]>(url);
        if (url === 'BFG') {
          const urls$ = this.baseService.getAllUrls().map(item => this.http.get<Vektor[]>(item));
          result$ = forkJoin(...urls$).pipe(map((list) => this.joinList(list)));
        }
        return result$.pipe(
          // tap((list) => console.log(url)),
          map((list) => this.convertVektorList(list)));
      })
        );
  }

  private joinList(list: Vektor[][]): Vektor[] {
    return list.reduce((acc, item) => [...acc, ...item]);
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
    const regExp = /(\d+)/g;
    const arr: number[] = source
      .match(regExp)
      .map((item) => parseInt(item, 10));
    const count: number = arr[0] + arr[1] + arr[2];
    const point: WinsPoint = {
      wins: this.roundDigits(arr[0] / count, 2),
      equals: this.roundDigits(arr[1] / count, 2),
      loses: this.roundDigits(arr[2] / count, 2),
    };
    return point;
  }

  calcGoalsPoint(source: string): GoalsPoint {
    const regExp = /(\d+\s*:\s*\d+)/g;
    const arr: string[] = source.match(regExp);
    const goalsArr: number[] = arr[0]
      .match(/\d+/g)
      .map((item) => parseInt(item, 10));
    const count: number = goalsArr[0] + goalsArr[1];
    const point: GoalsPoint = {
      shots: this.roundDigits(goalsArr[0] / count, 2),
      loses: this.roundDigits(goalsArr[1] / count, 2),
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
    //   console.error('NaN');
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

  roundDigits(num: number, digits: number): number {
    const koef = Math.pow(10, digits);
    return Math.round(num * koef) / koef;
  }

  calcTestPredictions(
    testGroupSize = 50,
    koef = this.predictKoeff
  ): Observable<PredictResult[]> {
    console.log(`koef = ${koef}`);
    return this.loadData().pipe(
      map((list: NormalVektor[]) => {
        const baseVektorList = list.slice(testGroupSize);
        console.log(`baseVektorList.length=${baseVektorList.length}`);
        const predictionVektorList = list.slice(0, testGroupSize);
        const predictions = predictionVektorList.map(
          (vektor) =>
            new PredictResult(
              this.predictResult(vektor, baseVektorList, koef),
              vektor.result
            )
        );
        console.table(predictions);
        return predictions;
      })
    );
  }

  calcPrediction(vektor: Vektor, koef = this.predictKoeff): Observable<Prediction> {
    // console.log(vektor);
    console.log(`koef = ${koef}`);
    const normalVektor: NormalVektor = this.normalize(vektor);
    // console.table(normalVektor);
    return this.loadData().pipe(
      map((list: NormalVektor[]) =>
        this.predictResult(normalVektor, list, koef)
      )
    );
  }

  predictResult(
    vektor: NormalVektor,
    base: NormalVektor[],
    koef = this.predictKoeff
  ): Prediction {
    const parts: PredictPart[] = this.getPredictionParts(vektor, base, koef);
    if (parts[1].part === parts[2].part) {
      parts[1].result = Result.Unknown;
      parts[2].result = Result.Unknown;

      if (parts[2].part === parts[0].part) {
        console.error('Bad parts');
      }
    }

    const prediction = new Prediction(
      parts[0].result,
      parts[0].part,
      [ parts[0].result, parts[1].result ],
      this.roundDigits(parts[0].part + parts[1].part, 2)
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
        result: Result.Win,
      },
      {
        part: equalsPart,
        result: Result.Equal,
      },
      {
        part: losesPart,
        result: Result.Lose,
      },
    ];
    parts = parts.sort((a, b) => b.part - a.part);
    // console.log(parts);
    return parts;
  }

  private findKCloseVektors(
    vektor: NormalVektor,
    searchBase: NormalVektor[],
    k: number
  ): Result[] {
    const distances: DistantVektor[] = searchBase.map((item) => ({
      ...item,
      distance: this.calcDistance(vektor, item),
    }));
    const sortedDistances: DistantVektor[] = distances.sort(
      (a, b) => a.distance - b.distance
    );
    // console.log(sortedDistances.length);
    // let index = 0;
    // while (index < 50) {
    //   console.log(`${index}: ${sortedDistances[index].distance}  ${sortedDistances[index].result}`);
    //   index += 1;
    // }
    // console.log(`0: ${sortedDistances[0].distance}  ${sortedDistances[0].result}`);
    // console.log(`1: ${sortedDistances[1].distance}  ${sortedDistances[1].result}`);
    // console.log(`2: ${sortedDistances[2].distance}  ${sortedDistances[2].result}`);
    // console.log(`3: ${sortedDistances[3].distance}  ${sortedDistances[3].result}`);
    // console.log(`4: ${sortedDistances[4].distance}  ${sortedDistances[4].result}`);
    // console.log(`5: ${sortedDistances[5].distance}  ${sortedDistances[5].result}`);
    // console.log(`6: ${sortedDistances[6].distance}  ${sortedDistances[6].result}`);
    // console.log(`7: ${sortedDistances[7].distance}  ${sortedDistances[7].result}`);
    // console.log(`10: ${sortedDistances[10].distance}  ${sortedDistances[10].result}`);
    // console.log(`50: ${sortedDistances[50].distance}  ${sortedDistances[50].result}`);
    // console.log(`100: ${sortedDistances[100].distance}  ${sortedDistances[100].result}`);
    // console.log(`500: ${sortedDistances[500].distance}  ${sortedDistances[500].result}`);
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

  setPredictKoef(koef: number) {
    this.predictKoeff = koef;
  }
}
