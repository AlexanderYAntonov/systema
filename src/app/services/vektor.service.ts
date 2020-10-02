import { Injectable } from '@angular/core';
import {
  Vektor,
  NormalVektor,
  WinsPoint,
  GoalsPoint,
  Point,
  Result
} from '../models/vektor';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { equal } from 'assert';

const url = 'assets/json/stat.json';

@Injectable({
  providedIn: 'root'
})
export class VektorService {
  baseVektorList: Vektor[];
  constructor(private http: HttpClient) {}

  loadData() {
    this.http
      .get<Vektor[]>(url)
      .pipe(
        map((list) => list.slice(0, 2)),
        tap(console.table),
        map((list) => this.convertVektorList(list)),
        tap(console.table)
      )
      .subscribe((list) => console.log(this.calcDistance(list[1], list[0])));
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
      wins: this.truncDigits(arr[0] / count, 2),
      equals: this.truncDigits(arr[1] / count, 2),
      loses: this.truncDigits(arr[2] / count, 2)
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
      shots: this.truncDigits(arr[5] / count, 2),
      loses: this.truncDigits(arr[6] / count, 2)
    };
    return point;
  }

  calcDistance(vektorA: NormalVektor, vektorB: NormalVektor): number {
    let distance = 0;
    for (let key in vektorA) {
      distance += this.truncDigits(
        this.calcDistancePoints(vektorA[key], vektorB[key]),
        4
      );
    }
    distance = this.truncDigits(distance, 4);
    return distance;
  }

  calcDistancePoints(pointA: Point, pointB: Point): number {
    let distance = 0;
    for (let key in pointA) {
      const raw = Math.pow(pointA[key] - pointB[key], 2);
      distance += this.truncDigits(raw, 4);
    }
    return distance;
  }

  private truncDigits(num: number, digits: number): number {
    const koef = Math.pow(10, digits);
    return Math.trunc(num * koef) / koef;
  }

  findKCloseVektors(
    vektor: NormalVektor,
    searchBase: NormalVektor[],
    k: number
  ): Result[] {
    return [];
  }
}
