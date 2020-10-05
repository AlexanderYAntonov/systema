import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PredictResult } from 'src/app/models/vektor';
import { VektorService } from '../../services/vektor.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: [ './viewer.component.sass' ]
})
export class ViewerComponent implements OnInit {
  predictResults$: Observable<PredictResult[]>;
  predictionSuccessPart: number;
  constructor(private vektorService: VektorService) {}

  ngOnInit() {
    this.predictResults$ = this.vektorService
      .calcTestPredictions()
      .pipe(tap((list) => this.calcSuccesPart(list)));
  }

  calcSuccesPart(list: PredictResult[]) {
    const count = list.filter((item) => item.prediction.result === item.result)
      .length;
    this.predictionSuccessPart = count / list.length;
  }
}
