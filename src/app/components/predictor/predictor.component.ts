import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
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
  prediction$: Observable<Prediction>;

  constructor(private vektorService: VektorService) {
    // this.buildDetailedForm();
    this.buildShortForm();
    this.buildUltraShortForm();
    this.buildBlockForm();
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
    this.prediction$ = this.vektorService.calcPrediction(vektor);
  }

  calcUltraShortFormPrediction() {
    const regExp = /(\d+\s\d+\s\d+\s\d+:\d+)/g;
    const arr = this.formUltraShort.value.matches.match(regExp);
    console.table(arr);
    const vektor: Vektor = {
      homeTotal: arr[0],
      homeIn: arr[1],
      visitorTotal: arr[2],
      visitorOut: arr[3],
      result: null,
      home: '',
      visitor: '',
    };
    console.table(vektor);
    this.prediction$ = this.vektorService.calcPrediction(vektor);
  }

  calcBlockFormPrediction() {
    const namesRegExp = /([a-zA-Z\s]+-[a-zA-Z\s]+)/g;
    const namesArr: string[] = this.extractBlockValues(
      namesRegExp,
      this.formBlock.value.names
    );
    // let namesArr: string[] = this.formBlock.value.names.match(namesRegExp);
    // namesArr = namesArr ? namesArr.map((item) => item.trim()) : [];
    // console.table(namesArr);

    const allMatchesRegExp = /\d\.([a-zA-Z\s\\\d\.\-]+\d:\d+)/g;
    const allMatchesArr: string[] = this.extractBlockValues(
      allMatchesRegExp,
      this.formBlock.value.allMatches
    );
    // let allMatchesArr: string[] = this.formBlock.value.allMatches.match(
    //   allMatchesRegExp
    // );
    // allMatchesArr = allMatchesArr
    //   ? allMatchesArr.map((item) => item.trim())
    //   : [];
    // console.table(allMatchesArr);

    const allHomeMatchesArr: string[] = this.extractBlockValues(
      allMatchesRegExp,
      this.formBlock.value.allHomeMatches
    );
    // let allHomeMatchesArr: string[] = this.formBlock.value.allHomeMatches.match(
    //   allMatchesRegExp
    // );
    // allHomeMatchesArr = allHomeMatchesArr
    //   ? allHomeMatchesArr.map((item) => item.trim())
    //   : [];
    // console.table(allHomeMatchesArr);

    const allAwayMatchesArr: string[] = this.extractBlockValues(
      allMatchesRegExp,
      this.formBlock.value.allAwayMatches
    );
    // let allAwayMatchesArr: string[] = this.formBlock.value.allAwayMatches.match(
    //   allMatchesRegExp
    // );
    // allAwayMatchesArr = allAwayMatchesArr
    //   ? allAwayMatchesArr.map((item) => item.trim())
    //   : [];
    // console.table(allAwayMatchesArr);

    // const vektor: Vektor = {
    //   homeTotal: arr[0],
    //   homeIn: arr[1],
    //   visitorTotal: arr[2],
    //   visitorOut: arr[3],
    //   result: null,
    //   home: '',
    //   visitor: '',
    // };
    // console.table(vektor);
    // this.prediction$ = this.vektorService.calcPrediction(vektor);
  }

  private extractBlockValues(regExp: RegExp, source: string): string[] {
    let matchesArr: string[] = source.match(regExp);
    matchesArr = matchesArr ? matchesArr.map((item) => item.trim()) : [];
    console.table(matchesArr);
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
}
