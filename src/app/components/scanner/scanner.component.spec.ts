import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { LeagueSchedule } from 'src/app/models/schedule';
import { ScannerService } from 'src/app/services/scanner.service';

import { ScannerComponent } from './scanner.component';

xdescribe('ScannerComponent', () => {
  let component: ScannerComponent;
  let fixture: ComponentFixture<ScannerComponent>;

  // const vektorServiceStub: Partial<VektorService> = {
  //   calcTestPredictions(testGroupSize, koef): Observable<PredictResult[]> {
  //     return new Observable();
  //   }
  // };
  const scannerServiceStub: Partial<ScannerService> = {
    loadSchedules(): Observable<LeagueSchedule> {
      return new Observable();
    },
    loadOverallTable(schedule: LeagueSchedule): Observable<LeagueSchedule> {
      return new Observable();
    },
    loadHomeTable(schedule: LeagueSchedule): Observable<LeagueSchedule> {
      return new Observable();
    },
    loadAwayTable(schedule: LeagueSchedule): Observable<LeagueSchedule> {
      return new Observable();
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScannerComponent ],
      providers: [ { provide: ScannerService, useService: scannerServiceStub } ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
