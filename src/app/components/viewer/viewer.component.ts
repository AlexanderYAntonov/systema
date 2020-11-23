import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { NormalVektor, PredictResult, Result } from 'src/app/models/vektor';
import { VektorService } from '../../services/vektor.service';

interface DropdownOption { label: string; value: string; }

const BasesList:DropdownOption[] = [
  {
    label: 'Init base',
    value: 'assets/json/stat.json'
  },
  {
    label: 'Eng base',
    value: 'assets/json/eng.json'
  },
  {
    label: 'Neth base',
    value: 'assets/json/neth.json'
  },
  {
    label: 'Germany base',
    value: 'assets/json/germany.json'
  },
];

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
  koef = 7;
  testGroupSize = 50;
  result: Result;
  predResult: Result;
  readonly basesList: DropdownOption[] = BasesList;
  selectedBase = 'assets/json/stat.json';

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
    const predictableList = list.filter(
      (item) => !item.prediction.resultPair.includes(Result.Unknown)
    );
    const countPair = predictableList.filter((item) =>
      item.prediction.resultPair.includes(item.result)
    ).length;
    this.predictionSuccessPartPair = countPair / predictableList.length;
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

  selectBase(event) {
    console.log(this.selectedBase);
    this.vektorService.setUrl(this.selectedBase);
    this.apply();
  }
}
