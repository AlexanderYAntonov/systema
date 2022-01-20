import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface LeagueSchedule {
  league: League;
  rows: ScheduleRowData[];
}
export interface ScheduleRowData{
  teams: string[];
  odds: number[];
  dateTime: string;
}

export interface League {
  url: string;
  caption: string;
  country: string;
}
@Injectable({
  providedIn: 'root'
})
export class ScannerService {
  leagues: League[] = [
    {
      url: '/soccer/england/premier-league/',
      caption: 'Premier League',
      country: 'England'
    },
    {
      url: '/soccer/spain/laliga/',
      caption: 'La Liga',
      country: 'Spain'
    },
  ];

  // overall: soccer/england/premier-league/standings/?table=table&table_sub=overall&ts=6kJqdMr2&dcheck=0

  constructor(private http: HttpClient,) { }

  loadSchedules(): Observable<LeagueSchedule> {
    return merge(...this.leagues.map(league => this.loadSchedule(league.url).pipe(
      map((schedule: ScheduleRowData[]) => ({league, rows: schedule})))));
  }

  private loadSchedule(url: string): Observable<ScheduleRowData[]> {
    return this.http.get(url, { responseType: 'text' }).pipe(
      map(data => {

        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "text/html");
        const element = doc.getElementsByClassName('table-main--leaguefixtures')[0];
        const rows = element.getElementsByTagName('tr');
        const XMLS = new XMLSerializer();

        const teamsReg = new RegExp('class="in-match">(.+)<\/a>', 'gm');
        const oddsReg = new RegExp('data-odd="(.+)"><\/a>', 'gm');
        const timeReg = new RegExp('<td class="h-text-right" colspan="2">(.*)<\/td>','gm');

        const rowData: ScheduleRowData[] = [];
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
              dateTime
            });
          }
        }
        return rowData;
      })
    )
  }
}
