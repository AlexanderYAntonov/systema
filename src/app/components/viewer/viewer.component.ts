import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PredictResult } from 'src/app/models/vektor';
import { VektorService } from '../../services/vektor.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: [ './viewer.component.css' ]
})
export class ViewerComponent implements OnInit {
  predictResults$: Observable<PredictResult[]>;
  predictionSuccessPart: number;
  predictionSuccessPartPair: number;
  minPart = 0;
  minPartPair = 0;
  maxPartPair = 1;
  koef = 19;
  testGroupSize = 50;
  constructor(private vektorService: VektorService) {}

  ngOnInit() {
    this.predictResults$ = this.vektorService
      .calcTestPredictions(this.testGroupSize, this.koef)
      .pipe(tap((list) => this.calcSuccesPart(list)));
  }

  calcSuccesPart(list: PredictResult[]) {
    const count = list.filter((item) => item.prediction.result === item.result)
      .length;
    this.predictionSuccessPart = count / list.length;
    const countPair = list.filter((item) =>
      item.prediction.resultPair.includes(item.result)
    ).length;
    this.predictionSuccessPartPair = countPair / list.length;
  }

  apply() {
    this.predictResults$ = this.vektorService
      .calcTestPredictions(this.testGroupSize, this.koef)
      .pipe(
        map((list) =>
          list.filter(
            (item) =>
              item.prediction.part >= this.minPart &&
              item.prediction.partPair >= this.minPartPair &&
              item.prediction.partPair <= this.maxPartPair
          )
        ),
        tap((list) => this.calcSuccesPart(list))
      );
  }
}
