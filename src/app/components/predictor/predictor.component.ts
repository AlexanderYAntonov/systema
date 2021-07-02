import { isNgTemplate } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { strictEqual } from 'assert';
import { Observable } from 'rxjs';
import { share, tap } from 'rxjs/operators';
import {
  GoalsPoint,
  NormalVektor,
  Prediction,
  PredictResult,
  Result,
  Vektor,
  WinsPoint,
} from 'src/app/models/vektor';
import { VektorService } from '../../services/vektor.service';

@Component({
  selector: 'app-predictor',
  templateUrl: './predictor.component.html',
  styleUrls: [ './predictor.component.css' ],
})
export class PredictorComponent implements OnInit {
  formDetailed: FormGroup;
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

  constructor(private vektorService: VektorService) {
    // this.buildDetailedForm();
    this.buildShortForm();
    this.buildUltraShortForm();
    this.buildBlockForm();
    this.buildMultiLineForm();
  }

  ngOnInit() {}

  private buildDetailedForm() {
    this.formDetailed = new FormGroup({
      homeTotalMatches: new FormGroup({
        wins: new FormControl(null, Validators.required),
        equals: new FormControl(null, Validators.required),
        loses: new FormControl(null, Validators.required),
      }),
      homeInMatches: new FormGroup({
        wins: new FormControl(null, Validators.required),
        equals: new FormControl(null, Validators.required),
        loses: new FormControl(null, Validators.required),
      }),
      visitorTotalMatches: new FormGroup({
        wins: new FormControl(null, Validators.required),
        equals: new FormControl(null, Validators.required),
        loses: new FormControl(null, Validators.required),
      }),
      visitorOutMatches: new FormGroup({
        wins: new FormControl(null, Validators.required),
        equals: new FormControl(null, Validators.required),
        loses: new FormControl(null, Validators.required),
      }),
      homeTotalGoals: new FormGroup({
        shots: new FormControl(null, Validators.required),
        loses: new FormControl(null, Validators.required),
      }),
      homeInGoals: new FormGroup({
        shots: new FormControl(null, Validators.required),
        loses: new FormControl(null, Validators.required),
      }),
      visitorTotalGoals: new FormGroup({
        shots: new FormControl(null, Validators.required),
        loses: new FormControl(null, Validators.required),
      }),
      visitorOutGoals: new FormGroup({
        shots: new FormControl(null, Validators.required),
        loses: new FormControl(null, Validators.required),
      }),
    });
  }

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
  }

  calcBlockFormPrediction() {
    const namesRegExp = /([a-zA-Z\s\.\-\/\\]+\s-\s[a-zA-Z\s\.\-\/\\]+)/g;
    const namesArr: string[] = this.extractBlockValues(
      namesRegExp,
      this.formBlock.value.names.replace(/\//g, 'A')
    );

    console.table(namesArr);

    const allMatchesRegExp = /\d\.([a-zA-Z\s\\\d\.\-\/]+\d:\d+)/g;
    const allMatchesArr: string[] = this.extractBlockValues(
      allMatchesRegExp,
      this.formBlock.value.allMatches.replace(/\//g, 'A')
    );

    const allHomeMatchesArr: string[] = this.extractBlockValues(
      allMatchesRegExp,
      this.formBlock.value.allHomeMatches.replace(/\//g, 'A')
    );

    const allAwayMatchesArr: string[] = this.extractBlockValues(
      allMatchesRegExp,
      this.formBlock.value.allAwayMatches.replace(/\//g, 'A')
    );

    let vektorList: Vektor[] = namesArr.map((source) => {
      const regExp = /(.*)\s\-\s(.*)/;
      const names = source.match(regExp);
      return {
        home: names[1],
        visitor: names[2],
        visitorOut: null,
        visitorTotal: null,
        homeIn: null,
        homeTotal: null,
        result: null,
      };
    });

    vektorList = this.getAllMatchesFromBlockForm(vektorList, allMatchesArr);
    vektorList = this.getHomeMatchesFromBlockForm(
      vektorList,
      allHomeMatchesArr
    );
    vektorList = this.getAwayMatchesFromBlockForm(
      vektorList,
      allAwayMatchesArr
    );

    this.blockVektorList = vektorList;
    console.table(vektorList);

    this.predictions$ = vektorList.map((vektor) =>
      this.vektorService.calcPrediction(vektor)
    );
  }

  private getAllMatchesFromBlockForm(
    vektorList: Vektor[],
    matches: string[]
  ): Vektor[] {
    vektorList = vektorList.map((vektor) => {
      const { home, visitor } = vektor;
      const homeTotal = this.extractMatches(matches, home);
      const visitorTotal = this.extractMatches(matches, visitor);
      Object.assign(vektor, { visitorTotal, homeTotal });
      return vektor;
    });
    return vektorList;
  }

  private extractMatches(matches: string[], team: string) {
    const regExp = /(\d+\s+\d+\s+\d+\s+\d+\s*:\s*\d+)/g;
    const found = matches.find((item) => item.includes(team));
    if (!found) {
      console.error('team not found', team);
      throw new Error('team not found' + team);
    }
    const result = matches.find((item) => item.includes(team)).match(regExp)[0];
    return result;
  }

  private getHomeMatchesFromBlockForm(
    vektorList: Vektor[],
    matches: string[]
  ): Vektor[] {
    vektorList = vektorList.map((vektor) => {
      const { home } = vektor;
      const homeIn = this.extractMatches(matches, home);
      Object.assign(vektor, { homeIn });
      return vektor;
    });
    return vektorList;
  }

  private getAwayMatchesFromBlockForm(
    vektorList: Vektor[],
    matches: string[]
  ): Vektor[] {
    vektorList = vektorList.map((vektor) => {
      const { visitor } = vektor;
      const visitorOut = this.extractMatches(matches, visitor);
      Object.assign(vektor, { visitorOut });
      return vektor;
    });
    return vektorList;
  }

  private extractBlockValues(regExp: RegExp, source: string): string[] {
    let matchesArr: string[] = source.match(regExp);
    matchesArr = matchesArr ? matchesArr.map((item) => item.trim()) : [];
    return matchesArr;
  }

  resetForm(form: FormGroup) {
    form.reset();
  }

  // calcPrediction() {
  // detail form calculation has bugs
  // console.table(this.form.value);
  // console.log(this.form.valid);
  // const { value } = this.form;
  // const homeTotalMatches: WinsPoint = value['homeTotalMatches'];
  // const homeInMatches: WinsPoint = value['homeInMatches'];
  // const visitorTotalMatches: WinsPoint = value['viisitorTotalMatches'];
  // const visitorOutMatches: WinsPoint = value['viisitorOutMatches'];
  // const homeTotalGoals: GoalsPoint = value['homeTotalGoals'];
  // const homeInGoals: GoalsPoint = value['homeInGoals'];
  // const visitorTotalGoals: GoalsPoint = value['visitorTotalGoals'];
  // const visitorOutGoals: GoalsPoint = value['visitorOutGoals'];
  // let vektor = new NormalVektor(
  //   homeTotalMatches,
  //   homeInMatches,
  //   visitorTotalMatches,
  //   visitorOutMatches,
  //   homeTotalGoals,
  //   homeInGoals,
  //   visitorTotalGoals,
  //   visitorOutGoals
  // );
  // vektor = this.vektorService.renormalizeVektor(vektor);
  // console.table(vektor);
  // this.prediction$ = this.vektorService.calcPrediction(vektor);
  // }

  toggleForm(key: string) {
    this.showForm[key] = !this.showForm[key];
  }
}
