import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import {
  Prediction,
  Vektor,
} from 'src/app/models/vektor';
import { VektorService } from '../../services/vektor.service';

@Component({
  selector: 'app-predictor',
  templateUrl: './predictor.component.html',
  styleUrls: [ './predictor.component.css' ],
})
export class PredictorComponent implements OnInit {
  formShort: FormGroup;
  formUltraShort: FormGroup;
  formBlock: FormGroup;
  formMultiLine: FormGroup;
  prediction$: Observable<Prediction>;
  predictions$: Observable<Prediction>[];
  predictionsML$: Observable<Prediction>[];
  blockVektorList: Vektor[];

  showForm = {
    shortForm: false,
    ultraShortForm: false,
    multiLineForm: false,
  };

  showData = {
    blockForm: false,
    shortForm: false,
    ultraShortForm: false,
    multiLineForm: false,
  }

  constructor(private vektorService: VektorService) {
    this.buildShortForm();
    this.buildUltraShortForm();
    this.buildBlockForm();
    this.buildMultiLineForm();
  }

  ngOnInit() {}

  private buildShortForm() {
    this.formShort = new FormGroup({
      homeTotal: new FormControl('15 5 3 51:19', Validators.required),
      homeIn: new FormControl('9 0 2 28:10', Validators.required),
      visitorTotal: new FormControl('7 5 11 25:33', Validators.required),
      visitorOut: new FormControl('1 4 6 8:17', Validators.required),
    });
  }

  private buildMultiLineForm() {
    this.formMultiLine = new FormGroup({
      matches: new FormControl('',
        Validators.required
      ),
    });
  }

  private buildUltraShortForm() {
    this.formUltraShort = new FormGroup({
      matches: new FormControl(
        '15 5 3 51:19  9 0 2 28:10  7 5 11 25:33  1 4 6 8:17',
        Validators.required
      ),
    });
  }

  private buildBlockForm() {
    this.formBlock = new FormGroup({
      names: new FormControl('', Validators.required),
      allMatches: new FormControl('', Validators.required),
      allHomeMatches: new FormControl('', Validators.required),
      allAwayMatches: new FormControl('', Validators.required),
    });
  }

  calcPrediction() {
    const vektor: Vektor = {
      ...this.formShort.value,
      result: '',
      home: '',
      visitor: '',
    };
    console.table(vektor);
    this.prediction$ = this.vektorService.calcPrediction(vektor).pipe(
      share()
    );
  }

  calcUltraShortFormPrediction() {
    this.prediction$ = this.predictOneLine(this.formUltraShort.value.matches).pipe(
      share()
    );
    this.showData.ultraShortForm = true;
  }

  private predictOneLine(source: string):Observable<Prediction> {
    const regExp = /(\d+\s\d+\s\d+\s\d+:\d+)/g;
    const arr = source.match(regExp);
    const vektor: Vektor = {
      homeTotal: arr[0],
      homeIn: arr[1],
      visitorTotal: arr[2],
      visitorOut: arr[3],
      result: null,
      home: '',
      visitor: '',
    };
    return this.vektorService.calcPrediction(vektor);
  }

  calcMultiLineFormPrediction() {
    const regExp = /((\d+\s\d+\s\d+\s\d+:\d+\s*){4})/g;
    const arr = this.formMultiLine.value.matches.match(regExp);

    this.predictionsML$ = arr.map(item => this.predictOneLine(item));
    this.showData.multiLineForm = true;
  }

  calcBlockFormPrediction() {
    this.blockVektorList = this.vektorService.createVektorListFromBlockForm(
      this.formBlock.value.names,
      this.formBlock.value.allMatches,
      this.formBlock.value.allHomeMatches,
      this.formBlock.value.allAwayMatches,
    );

    this.predictions$ = this.blockVektorList.map((vektor) =>
      this.vektorService.calcPrediction(vektor)
    );
    this.showData.blockForm = true;
  }

  resetForm(form: FormGroup, key: string) {
    form.reset();
    this.showData[key] = false;
  }

  toggleForm(key: string) {
    this.showForm[key] = !this.showForm[key];
  }
}
