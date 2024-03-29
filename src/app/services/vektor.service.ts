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
  GoalsIntervalPoint,
} from '../models/vektor';
import { HttpClient } from '@angular/common/http';
import { concatMap, map, share } from 'rxjs/operators';
import { combineLatest, forkJoin, Observable, zip } from 'rxjs';
import { SettingsService } from './settings.service';

const predictKoeffInit = 7;
const testGroupUrl = 'assets/json/soccer-euro-2021.json';

@Injectable({
  providedIn: 'root',
})
export class VektorService {

  baseVektorList: NormalVektor[];
  predictionVektorList: NormalVektor[];
  predictKoeff = predictKoeffInit;
  constructor(
    private http: HttpClient,
    private settingsService: SettingsService
  ) {}

  loadData(): Observable<NormalVektor[]> {
    return this.settingsService.getUrl().pipe(
      concatMap((url) => {
        let result$ = this.http.get<Vektor[]>(url);
        if (url === 'BFG') {
          const urls$ = this.settingsService.getAllUrls().map(item => this.http.get<Vektor[]>(item));
          result$ = forkJoin(urls$).pipe(map((list) => this.joinList(list)));
        }
        if (url === 'HBFG') {
          const urls$ = this.settingsService.getAllHandballUrls().map(item => this.http.get<Vektor[]>(item));
          result$ = forkJoin(urls$).pipe(map((list) => this.joinList(list)));
        }
        return result$.pipe(
          map((list) => this.convertVektorList(list))
        );
      })
        );
  }

  loadTestGroupData(url = testGroupUrl): Observable<NormalVektor[]> {
    return this.http.get<Vektor[]>(url).pipe(
      map((list) => this.convertVektorList(list))
    );
  }

  private joinList(list: Vektor[][]): Vektor[] {
    return list.reduce((acc, item) => [...acc, ...item]);
  }

  private convertVektorList(list: Vektor[]): NormalVektor[] {
    console.log('list length: ', list.length);
    return list.map((item) =>  this.normalize(item));
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

    const { shotsInterval, losesInterval } = this.calcAverageTotal(vektor);
    return new NormalVektor(
      homeTotalMatchesPoint,
      homeInMatchesPoint,
      visitorTotalMatchesPoint,
      visitorOutMatchesPoint,
      homeTotalGoalsPoint,
      homeInGoalsPoint,
      visitorTotalGoalsPoint,
      visitorOutGoalsPoint,
      shotsInterval,
      losesInterval,
      vektor.result
    );
  }

  calcAverageTotal(vektor: Vektor): { shotsInterval: GoalsIntervalPoint, losesInterval: GoalsIntervalPoint} {
    const { homeTotal, visitorTotal, homeIn, visitorOut } = vektor;

    const homeTotalShotsAT = this.getGoalsValue(homeTotal, true);
    const homeTotalLosesAT = this.getGoalsValue(homeTotal, false);
    const visitorTotalShotsAT = this.getGoalsValue(visitorTotal, true);
    const visitorTotalLosesAT = this.getGoalsValue(visitorTotal, false);
    const homeInShotsAT = this.getGoalsValue(homeIn, true);
    const homeInLosesAT = this.getGoalsValue(homeIn, false);
    const visitorOutShotsAT = this.getGoalsValue(visitorOut, true);
    const visitorOutLosesAT = this.getGoalsValue(visitorOut, false);

    const shotsInterval = {
      from: Math.min(homeTotalShotsAT, homeInShotsAT, visitorTotalLosesAT, visitorOutLosesAT),
      to: Math.max(homeTotalShotsAT, homeInShotsAT, visitorTotalLosesAT, visitorOutLosesAT),
    };
    const losesInterval = {
      from: Math.min(homeTotalLosesAT, homeInLosesAT, visitorOutShotsAT, visitorTotalShotsAT),
      to: Math.max(homeTotalLosesAT, homeInLosesAT, visitorOutShotsAT, visitorTotalShotsAT),
    };
    return {shotsInterval, losesInterval};
  }

  private getGoalsValue(source: string, shots: boolean): number {
    const regExpGames = /(\d+)/g;
    const arrGames: number[] = source
      .match(regExpGames)
      .map((item) => parseInt(item, 10));
    const totalGames = arrGames[0] + arrGames[1] + arrGames[2];

    const regExp = /(\d+\s*:\s*\d+)/g;
    const arr: string[] = source.match(regExp);
    const goalsArr: number[] = arr[0]
      .match(/\d+/g)
      .map((item) => parseInt(item, 10));
    return this.roundDigits(goalsArr[shots ? 0 : 1]/totalGames, 2);
  }

  calcWinsPoint(source: string): WinsPoint {
    const regExp = /(\d+)/g;
    const arr: number[] = source
      .match(regExp)
      .map((item) => parseInt(item, 10));
    const count: number = this.calcNormalSum(arr);
    const point: WinsPoint = {
      wins: this.roundDigits(arr[0] / count, 2),
      equals: this.roundDigits(arr[1] / count, 2),
      loses: this.roundDigits(arr[2] / count, 2),
    };
    return point;
  }

  private calcNormalSum(arr: number[]): number {
    return Math.sqrt(Math.pow(arr[0], 2) + Math.pow(arr[1], 2) + Math.pow(arr[2], 2));
  }

  calcGoalsPoint(source: string): GoalsPoint {
    const regExp = /(\d+\s*:\s*\d+)/g;
    const arr: string[] = source.match(regExp);
    const goalsArr: number[] = arr[0]
      .match(/\d+/g)
      .map((item) => parseInt(item, 10));
    const count: number = this.calcNormalSum([...goalsArr, 0]);
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
        console.table(predictions);
        return predictions;
      })
    );
  }

  calcTestPredictions21(
    testGroupSize = 50,
    koef = this.predictKoeff
  ): Observable<PredictResult[]> {
    console.log('calc test');
    return combineLatest([this.loadData(), this.loadTestGroupData()]).pipe(
      map(([baseVektorList, predictionVektorList]: [NormalVektor[], NormalVektor[]]) => {
        predictionVektorList = predictionVektorList.slice(0, testGroupSize);
        console.log(predictionVektorList.length);
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

  calcPredictions(list: Vektor[], koef = this.predictKoeff): Observable<Prediction[]> {
    const normalList: NormalVektor[] = list.map((vektor: Vektor) => this.normalize(vektor));
    return this.loadData().pipe(
      map((list: NormalVektor[]) =>
        normalList.map((normalVektor: NormalVektor) => this.predictResult(normalVektor, list, koef))
      ),
      share()
    );
  }

  calcPrediction(vektor: Vektor, koef = this.predictKoeff): Observable<Prediction> {
    const normalVektor: NormalVektor = this.normalize(vektor);
    return this.loadData().pipe(
      map((list: NormalVektor[]) =>
        this.predictResult(normalVektor, list, koef)
      ),
      share()
    );
  }

  predictResult(
    vektor: NormalVektor,
    base: NormalVektor[],
    koef = this.predictKoeff
  ): Prediction {
    const { parts, epsilon } = this.getPredictionParts(vektor, base, koef);
    if (parts[1].part === parts[2].part) {
      parts[1].result = Result.Unknown;
      parts[2].result = Result.Unknown;

      if (parts[2].part === parts[0].part) {
        console.error('Bad parts');
      }
    }

    const prediction = new Prediction(
      vektor.shotsInterval,
      vektor.losesInterval,
      parts[0].result,
      parts[0].part,
      [ parts[0].result, parts[1].result ],
      this.roundDigits(parts[0].part + parts[1].part, 2),
      epsilon,
    );
    return prediction;
  }

  getPredictionParts(
    vektor: NormalVektor,
    base: NormalVektor[],
    koef: number
  ): { parts: PredictPart[], epsilon: number } {
    const { results, epsilon } = this.findKCloseVektors(vektor, base, koef);
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
    return { parts, epsilon };
  }

  private findKCloseVektors(
    vektor: NormalVektor,
    searchBase: NormalVektor[],
    k: number
  ): { results: Result[], epsilon: number } {
    const distances: DistantVektor[] = searchBase.map((item) => ({
      ...item,
      distance: this.calcDistance(vektor, item),
    }));
    const sortedDistances: DistantVektor[] = distances.sort(
      (a, b) => a.distance - b.distance
    );
    const results: Result[] = sortedDistances
      .slice(0, k)
      .map((item) => item.result);
    return { results, epsilon: sortedDistances[k-1].distance };
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

  createVektorListFromBlockForm(names: string, allMatches: string, allHomeMatches: string, allAwayMatches: string): Vektor[] {
    names = names.replace(/&amp;/g,'&');
    const namesRegExp = /([a-zA-Z&;'\s\.\-\/\\]+\s-\s[a-zA-Z&;'\s\.\-\/\\]+)/g;
    const namesArr: string[] = this.extractBlockValues(
      namesRegExp,
      names.replace(/\//g, 'A')
    );

    const allMatchesRegExp = /\d+\.([a-zA-Z&;'\s\\\d\.\-\/]+\d:\d+)/g;
    const allMatchesArr: string[] = this.extractBlockValues(
      allMatchesRegExp,
      allMatches.replace(/\//g, 'A')
    );

    const allHomeMatchesArr: string[] = this.extractBlockValues(
      allMatchesRegExp,
      allHomeMatches.replace(/\//g, 'A')
    );

    const allAwayMatchesArr: string[] = this.extractBlockValues(
      allMatchesRegExp,
      allAwayMatches.replace(/\//g, 'A')
    );

    let vektorList: Vektor[] = namesArr.map((source) => {
      const regExp = /(.*)\s\-\s(.*)/;
      const names = source.match(regExp);
      return {
        home: names[1],
        visitor: names[2],
        visitorOut: null,
        visitorTotal: null,
        homeIn: null,
        homeTotal: null,
        result: null,
      };
    });

    vektorList = this.getAllMatchesFromBlockForm(vektorList, allMatchesArr);
    vektorList = this.getHomeMatchesFromBlockForm(
      vektorList,
      allHomeMatchesArr
    );
    vektorList = this.getAwayMatchesFromBlockForm(
      vektorList,
      allAwayMatchesArr
    );

    return vektorList;
  }

  private getAllMatchesFromBlockForm(
    vektorList: Vektor[],
    matches: string[]
  ): Vektor[] {
    try {
      vektorList = vektorList.map((vektor) => {
        const { home, visitor } = vektor;
        const homeTotal = this.extractMatches(matches, home);
        const visitorTotal = this.extractMatches(matches, visitor);
        Object.assign(vektor, { visitorTotal, homeTotal });
        return vektor;
      });
    } catch(err) {
      console.error(err);
      return [];
    }
    return vektorList;
  }

  extractMatches(matches: string[], team: string) {
    const regExp = /(\d+\s+\d+\s+\d+\s+\d+\s*:\s*\d+)/g;
    const found = matches.find((item) => item.includes(team));
    if (!found) {
      console.log(matches);
      console.error('team not found', team);
      alert(`'team not found ${team}`);
      throw new Error('team not found' + team);
    }
    const result = matches.find((item) => item.includes(team)).match(regExp)[0];
    return result;
  }

  getHomeMatchesFromBlockForm(
    vektorList: Vektor[],
    matches: string[]
  ): Vektor[] {
    vektorList = vektorList.map((vektor) => {
      const { home } = vektor;
      const homeIn = this.extractMatches(matches, home);
      Object.assign(vektor, { homeIn });
      return vektor;
    });
    return vektorList;
  }

  getAwayMatchesFromBlockForm(
    vektorList: Vektor[],
    matches: string[]
  ): Vektor[] {
    vektorList = vektorList.map((vektor) => {
      const { visitor } = vektor;
      const visitorOut = this.extractMatches(matches, visitor);
      Object.assign(vektor, { visitorOut });
      return vektor;
    });
    return vektorList;
  }

  extractBlockValues(regExp: RegExp, source: string): string[] {
    let matchesArr: string[] = source.match(regExp);
    matchesArr = matchesArr ? matchesArr.map((item) => item.trim()) : [];
    return matchesArr;
  }
}
