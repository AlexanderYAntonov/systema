import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { concatMap, finalize, map, switchMap, take } from 'rxjs/operators';
import { allLeagues } from 'src/app/models/leagues';
import { LeagueSchedule } from 'src/app/models/schedule';
import { ScannerService } from 'src/app/services/scanner.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css']
})
export class ScannerComponent implements OnDestroy {
  schedules: LeagueSchedule[] = [];
  isLoading = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private readonly scannerService: ScannerService,
    private readonly settingsService: SettingsService,
  ) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  scan(): void {
    this.schedules = [];
    this.isLoading = true
    this.subscription.add(
      this.settingsService.sport$.pipe(
        take(1),
        switchMap((sport: string) => this.scannerService.loadSchedules(allLeagues[sport]).pipe(
          concatMap((schedule: LeagueSchedule) => this.scannerService.loadOverallTable(schedule)),
          concatMap((schedule: LeagueSchedule) => this.scannerService.loadHomeTable(schedule)),
          concatMap((schedule: LeagueSchedule) => this.scannerService.loadAwayTable(schedule)),
          map((schedule: LeagueSchedule) => this.scannerService.createPrediction(schedule)),
        )),
        finalize(() => this.isLoading = false),
      ).subscribe(schedule => {
        this.schedules.push(schedule);
      }));
  }

}
