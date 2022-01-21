import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Prediction, Vektor } from '../models/vektor';
import { VektorService } from './vektor.service';

export interface LeagueSchedule {
  league: League;
  rows: ScheduleRowData[];
  ts: string;
  overall?: string[];
  home?: string[];
  away?: string[];
  predictions$?: Observable<Prediction>[];
  blockVektorList?: Vektor[];
}
export interface ScheduleRowData{
  teams: string[];
  odds: number[];
  dateTime: string;
  joinedRow: string;
}

export interface League {
  url: string;
  caption: string;
  country: string;
}

export interface ScheduleResponse {
  rows: ScheduleRowData[];
  ts: string;
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
    {
      url: '/soccer/germany/bundesliga/',
      caption: 'Bundesliga',
      country: 'Germany'
    },
    {
      url: '/soccer/italy/serie-a/',
      caption: 'Seria A',
      country: 'Italy'
    },
    {
      url: '/soccer/france/ligue-1/',
      caption: 'Ligue 1',
      country: 'France'
    },
    {
      url: '/soccer/netherlands/eredivisie/',
      caption: 'Eredivisie',
      country: 'Netherlands'
    },
    {
      url: '/soccer/portugal/liga-portugal/',
      caption: 'liga-portugal',
      country: 'Portugal'
    },
    {
      url: '/soccer/belgium/jupiler-pro-league/',
      caption: 'jupiler-pro',
      country: 'Belgium'
    },
    {
      url: '/soccer/russia/premier-league/',
      caption: 'Premier league',
      country: 'Russia'
    },
    {
      url: '/soccer/scotland/premiership/',
      caption: 'Premiership',
      country: 'Scotland'
    },
    {
      url: '/soccer/sweden/allsvenskan/',
      caption: 'Allsvenskan',
      country: 'Sweden'
    },
    {
      url: '/soccer/serbia/super-liga/',
      caption: 'Super liga',
      country: 'Serbia'
    },
    {
      url: '/soccer/australia/a-league/',
      caption: 'A League',
      country: 'Australia'
    },
    {
      url: '/soccer/england/championship/',
      caption: 'Championship',
      country: 'England'
    },
    {
      url: '/soccer/greece/super-league/',
      caption: 'Supr league',
      country: 'Greece'
    },
  ];

  constructor(
    private http: HttpClient,
    private vektorService: VektorService,
  ) { }

  loadSchedules(): Observable<LeagueSchedule> {
    return merge(...this.leagues.map(league => this.loadSchedule(league.url).pipe(
      map((schedule: ScheduleResponse) => ({league, rows: schedule.rows, ts: schedule.ts})))));
  }

  private loadSchedule(url: string): Observable<ScheduleResponse> {
    return this.http.get(url, { responseType: 'text' }).pipe(
      map((data: string) => {

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
              dateTime,
              joinedRow: `${teams.join(' - ')} 0 ${odds.join(' ')} ${dateTime}`
            });
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
          const XMLS = new XMLSerializer();
          const rowData: string[] = [];

          for (let i = 1; i < rows.length; i++) {
            const cols = rows[i].getElementsByTagName('td');
            let str = '';
            Array.from(cols).forEach(element => {
              str = `${str} ${element.textContent}`;
            });
            rowData.push(str.trim());
          }

          return {...schedule, [key]: rowData};
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

    schedule.predictions$ = blockVektorList.map((vektor) =>
      this.vektorService.calcPrediction(vektor)
    );
    return schedule;
  }
}
