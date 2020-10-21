import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictorComponent } from './predictor.component';
import { VektorService } from '../../services/vektor.service';
import { Observable } from 'rxjs';
import { PredictResult } from 'src/app/models/vektor';

describe('PredictorComponent', () => {
  let component: PredictorComponent;
  let fixture: ComponentFixture<PredictorComponent>;

  const vektorServiceStub: Partial<VektorService> = {
    calcTestPredictions(testGroupSize, koef): Observable<PredictResult[]> {
      return new Observable();
    }
  };

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [ PredictorComponent ],
        providers: [ { provide: VektorService, useService: vektorServiceStub } ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
