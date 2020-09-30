import { Injectable } from '@angular/core';
import { Vektor, NormalVektor, WinsPoint, GoalsPoint } from '../models/vektor';
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
        map((list) => list.slice(0, 1)),
        tap(console.table),
        map((list) => this.convertVektorList(list))
      )
      .subscribe(console.table);
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
      visitorOutGoalsPoint
    );
  }

  calcWinsPoint(source: string): WinsPoint {
    const arr = source
      .split(' ')
      .filter((item) => item !== ':')
      .map((item) => parseInt(item, 10));
    const count: number = arr[0] + arr[1] + arr[2];
    const point: WinsPoint = {
      wins: arr[0] / count,
      equals: arr[1] / count,
      loses: arr[2] / count
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
      shots: arr[5] / count,
      loses: arr[6] / count
    };
    return point;
  }
}
