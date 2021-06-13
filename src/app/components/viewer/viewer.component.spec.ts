import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewerComponent } from './viewer.component';
import { VektorService } from '../../services/vektor.service';
import { Observable } from 'rxjs';
import { PredictResult } from 'src/app/models/vektor';

describe('ViewerComponent', () => {
  let component: ViewerComponent;
  let fixture: ComponentFixture<ViewerComponent>;

  const vektorServiceStub: Partial<VektorService> = {
    calcTestPredictions(testGroupSize, koef): Observable<PredictResult[]> {
      return new Observable();
    }
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ ViewerComponent ],
        providers: [ { provide: VektorService, useService: vektorServiceStub } ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
