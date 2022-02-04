import { Component, OnInit } from '@angular/core';
import { concatMap, map, switchMap, take, tap } from 'rxjs/operators';
import { allLeagues } from 'src/app/models/leagues';
import { LeagueSchedule, ScannerService } from 'src/app/services/scanner.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css']
})
export class ScannerComponent implements OnInit {
  schedules: LeagueSchedule[] = [];
  isLoading = false;
  private counter = 0;

  constructor(
    private readonly scannerService: ScannerService,
    private readonly settingsService: SettingsService,
  ) { }

  ngOnInit(): void {

  }

  scan(): void {
    this.schedules = [];
    this.isLoading = true
    this.settingsService.sport$.pipe(
      take(1),
      switchMap((sport: string) => this.scannerService.loadSchedules(allLeagues[sport]).pipe(
        tap(() => this.counter++),
        concatMap((schedule: LeagueSchedule) => this.scannerService.loadOverallTable(schedule)),
        concatMap((schedule: LeagueSchedule) => this.scannerService.loadHomeTable(schedule)),
        concatMap((schedule: LeagueSchedule) => this.scannerService.loadAwayTable(schedule)),
        map((schedule: LeagueSchedule) => this.scannerService.createPrediction(schedule))
      ))
    ).subscribe(schedule => {
      this.schedules.push(schedule);
      this.counter--;
      this.isLoading = this.counter > 0;
    });
  }

}
