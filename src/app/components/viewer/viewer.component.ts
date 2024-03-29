import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, tap } from 'rxjs/operators';
import { PredictResult, Result } from 'src/app/models/vektor';
import { SettingsService } from 'src/app/services/settings.service';
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
  subscription: Subscription = new Subscription();
  form: FormGroup = new FormGroup({
    testGroupSize: new FormControl(50, Validators.required),
    minPart: new FormControl(0, Validators.required),
    maxPart: new FormControl(1, Validators.required),
    minEpsilon: new FormControl(0, Validators.required),
    maxEpsilon: new FormControl(10, Validators.required),
    minPartPair: new FormControl(0, Validators.required),
    maxPartPair: new FormControl(1, Validators.required),
    showAverageTotal: new FormControl(false),
    predResult: new FormControl(null),
    result: new FormControl(null),
    showEpsilon: new FormControl(false),
  });
  fullList$: Observable<PredictResult[]>;
  isLoading = false;

  constructor(
    private vektorService: VektorService,
    private baseService: SettingsService,
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.baseService.getUrl().subscribe(url => this.apply())
    );

    this.subscription.add(
      this.form.valueChanges.pipe(
        distinctUntilChanged((a,b) => a.minPart === b.minPart && a.maxPart === b.maxPart &&
        a.minPartPair === b.minPartPair && a.maxPartPair === b.maxPartPair
        && a.result === b.result && a.predResult === b.predResult && a.maxEpsilon === b.maxEpsilon
        && a.minEpsilon === b.minEpsilon))
      .subscribe(
        val => this.updateView(val)
      ));
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
    this.isLoading = false;
  }

  apply() {
    const { minPart, maxPart, minPartPair, maxPartPair, result, predResult, testGroupSize } = this.form.value;
    // this.fullList$ = this.vektorService.calcTestPredictions(testGroupSize).pipe(shareReplay(1));
    this.fullList$ = this.vektorService.calcTestPredictions21(testGroupSize).pipe(shareReplay(1));
    this.updateView(this.form.value);
  }

  private updateView({minPart, maxPart, minPartPair, maxPartPair, result, predResult, maxEpsilon, minEpsilon}) {
    this.isLoading = true;
    this.predictResults$ = this.fullList$.pipe(
      map((list) =>
        list.filter(
          (item) =>
            item.prediction.part >= minPart &&
            item.prediction.part <= maxPart &&
            item.prediction.epsilon <= maxEpsilon &&
            item.prediction.epsilon >= minEpsilon &&
            item.prediction.partPair >= minPartPair &&
            item.prediction.partPair <= maxPartPair &&
            (!result || item.result === result) &&
            (!predResult || item.prediction.result === predResult)
        )
      ),
      tap((list) => this.calcSuccesPart(list))
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
