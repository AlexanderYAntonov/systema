import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PredictResult, Result } from 'src/app/models/vektor';
import { BaseService } from 'src/app/services/base.service';
import { VektorService } from '../../services/vektor.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: [ './viewer.component.css' ]
})
export class ViewerComponent implements OnInit, OnDestroy {
  predictResults$: Observable<PredictResult[]>;
  predictionSuccessPart: number;
  predictionSuccessPartPair: number;
  minPart = 0;
  minPartPair = 0;
  maxPartPair = 1;
  koef = 7;
  testGroupSize = 50;
  result: Result;
  predResult: Result;
  subscription: Subscription = new Subscription();
  
  constructor(
    private vektorService: VektorService,
    private baseService: BaseService,
  ) {}

  ngOnInit() {
    this.predictResults$ = this.vektorService
      .calcTestPredictions(this.testGroupSize, this.koef)
      .pipe(tap((list) => this.calcSuccesPart(list)));

    this.subscription.add(
      this.baseService.getUrl().subscribe(url => this.apply())
    );
  }

  calcSuccesPart(list: PredictResult[]) {
    const count = list.filter((item) => item.prediction.result === item.result)
      .length;
    this.predictionSuccessPart = this.vektorService.roundDigits(count / list.length, 2);
    const predictableList = list.filter(
      (item) => !item.prediction.resultPair.includes(Result.Unknown)
    );
    const countPair = predictableList.filter((item) =>
      item.prediction.resultPair.includes(item.result)
    ).length;
    this.predictionSuccessPartPair = this.vektorService.roundDigits(countPair / predictableList.length, 2);
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
              item.prediction.partPair <= this.maxPartPair &&
              (!this.result || item.result === this.result) &&
              (!this.predResult || item.prediction.result === this.predResult)
          )
        ),
        tap((list) => this.calcSuccesPart(list))
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
