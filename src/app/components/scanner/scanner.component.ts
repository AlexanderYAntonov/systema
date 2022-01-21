import { Component, OnInit } from '@angular/core';
import { concatMap, map } from 'rxjs/operators';
import { LeagueSchedule, ScannerService } from 'src/app/services/scanner.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css']
})
export class ScannerComponent implements OnInit {
  schedules: LeagueSchedule[] = [];

  constructor(
    private readonly scannerService: ScannerService,
  ) { }

  ngOnInit(): void {
    this.scannerService.loadSchedules().pipe(
      concatMap((schedule: LeagueSchedule) => this.scannerService.loadOverallTable(schedule)),
      concatMap((schedule: LeagueSchedule) => this.scannerService.loadHomeTable(schedule)),
      concatMap((schedule: LeagueSchedule) => this.scannerService.loadAwayTable(schedule)),
      map((schedule: LeagueSchedule) => this.scannerService.createPrediction(schedule))
    ).subscribe(schedule => this.schedules.push(schedule));
  }

}
