import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, merge, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { League } from '../models/leagues';
import { Prediction, Vektor } from '../models/vektor';
import { VektorService } from './vektor.service';

export interface LeagueSchedule {
  league: League;
  rows: ScheduleRowData[];
  ts: string;
  overall?: string[];
  home?: string[];
  away?: string[];
  overallForm?: {[key: string]: string[]};
  homeForm?: {[key: string]: string[]};
  awayForm?: {[key: string]: string[]};
  predictionsList$?: Observable<Prediction[]>;
  blockVektorList?: Vektor[];
}
export interface ScheduleRowData{
  teams: string[];
  odds: number[];
  dateTime: string;
  joinedRow: string;
}

export interface ScheduleResponse {
  rows: ScheduleRowData[];
  ts: string;
}
@Injectable({
  providedIn: 'root'
})
export class ScannerService {


  constructor(
    private http: HttpClient,
    private vektorService: VektorService,
  ) { }

  loadSchedules(leagues: League[]): Observable<LeagueSchedule> {
    return merge(...leagues.map(league => this.loadSchedule(league.url).pipe(
      map((schedule: ScheduleResponse) => ({league, rows: schedule.rows, ts: schedule.ts})))));
  }

  private loadSchedule(url: string): Observable<ScheduleResponse> {
    return this.http.get(url, { responseType: 'text' }).pipe(
      map((data: string) => {

        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "text/html");
        const element = doc.getElementsByClassName('table-main--leaguefixtures')[0];
        const rowData: ScheduleRowData[] = [];
        if (element) {
          const rows = element.getElementsByTagName('tr');
          const XMLS = new XMLSerializer();

          const teamsReg = new RegExp('class="in-match">(.+)<\/a>', 'gm');
          const oddsReg = new RegExp('data-odd="(.+)"><\/a>', 'gm');
          const timeReg = new RegExp('<td class="h-text-right" colspan="2">(.*)<\/td>','gm');

          for (let i = 1; i < rows.length; i++) {
            const str = XMLS.serializeToString(rows[i]);
            let teams: string[] = str.match(teamsReg) ? str.match(teamsReg)[0].match(/<span>([^<]+)<\/span>/g) : [];
            teams = teams.map(item => item.replace(/<[^<]*>/g, ''));
            const oddsMatch = str.match(oddsReg) ? str.match(oddsReg) : [];
            const odds: number[] = oddsMatch.map(item => item.match(/([\d\.]+)/) ? parseFloat(item.match(/([\d\.]+)/)[0]) : 0);
            let dateTime: string = str.match(timeReg) ? str.match(timeReg)[0].replace(/<.+">|<\/td>/g,'') : '';
            if (dateTime) {
              rowData.push({
                teams,
                odds,
                dateTime,
                joinedRow: `${teams.join(' - ')} 0 ${odds.join(' ')} ${dateTime}`
              });
            }
          }
        }
        

        const tsReg = new RegExp('overall&ts=([^&]+)&dcheck','gm');
        const ts = tsReg.exec(data) ? tsReg.exec(data)[1] : '';
        return {rows: rowData, ts};
      })
    )
  }

  loadOverallTable(schedule: LeagueSchedule): Observable<LeagueSchedule> {
    return this.loadTable(schedule, 'overall');
  }

  loadHomeTable(schedule: LeagueSchedule): Observable<LeagueSchedule> {
    return this.loadTable(schedule, 'home');
  }

  loadAwayTable(schedule: LeagueSchedule): Observable<LeagueSchedule> {
    return this.loadTable(schedule, 'away');
  }

  private loadTable(schedule: LeagueSchedule, key: string): Observable<LeagueSchedule> {
    return this.http.get(
      `${schedule.league.url}standings/?table=table&table_sub=${key}&ts=${schedule.ts}&dcheck=0`,
      { responseType: 'text' }).pipe(
        map((data: string) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(data, "text/html");
          const rows = doc.getElementsByTagName('tr');
          const rowData: string[] = [];
          const formKey = `${key}Form`;
          const formObj: {[key: string]: string[]} = {};
          for (let i = 1; i < rows.length; i++) {
            const cols = rows[i].getElementsByTagName('td');
            let str = '';
            let name = '';
            Array.from(cols).forEach(element => {
              str = `${str} ${element.textContent}`;
              if (element.className.includes('col_name')) {
                name = element.textContent;
              }
              if (element.className.includes('col_form')) {
                const formDiv = element.getElementsByTagName('a');
                let formList = Array.from(formDiv).map(item => item.className.match(/form-w|form-d|form-l/g));
                const convertedFormList = formList.filter(item => !!item).map(item => item[0].replace('form-','').toUpperCase()).reverse();
                Object.assign(formObj, {[name]: convertedFormList});
              }
            });
            rowData.push(str.trim());

          }

          return {...schedule, [key]: rowData, [formKey]: formObj};
        })
      );
  }

  createPrediction(schedule: LeagueSchedule): LeagueSchedule {
    const blockVektorList = this.vektorService.createVektorListFromBlockForm(
      schedule.rows.map(row => row.joinedRow).join(' '),
      schedule.overall.join(' '),
      schedule.home.join(' '),
      schedule.away.join(' '),
    );

    schedule.blockVektorList = blockVektorList;

    schedule.predictionsList$ = of(blockVektorList).pipe(
      switchMap((list: Vektor[]) => combineLatest(list.map((vektor: Vektor) => this.vektorService.calcPrediction(vektor))))
    );
    return schedule;
  }
}
