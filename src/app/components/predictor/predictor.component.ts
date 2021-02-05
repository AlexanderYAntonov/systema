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
      matches: new FormControl(
        `5 3 1 22:10	2 1 1 11:6	6 2 1 21:9	4 0 0 13:3
4 1 4 9:10	2 0 2 4:6	4 2 3 9:10	2 0 2 3:5`,
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
      names: new FormControl(
        `St. Odd - Sarps-borg 08	 	
18	2.01	3.58	3.49	Tomorrow 18:00
Haugesund - Aalesund	 	
18	1.34	5.29	7.95	Tomorrow 20:30
Mjondalen - Molde	 	
19	4.93	4.26	1.61	01.11. 15:00
Kristiansund - Bodo/Glimt	 	
19	3.19	3.57	2.13	01.11. 18:00
Rosenborg - Start	 	
19	1.37	4.86	7.96	01.11. 18:00
Sandefjord - Brann	 	
19	2.71	3.42	2.48	01.11. 18:00
Stabaek - Viking	 	
19	2.32	3.58	2.84	01.11. 18:00
Stromsgodset - Valerenga	 	
19	3.09	3.53	2.20	01.11. 20:30`,
        Validators.required
      ),
      allMatches: new FormControl(
        `1.	Bodo/Glimt	22	19	2	1	73:25	59	
2.	Molde	22	14	1	7	54:27	43	
3.	Rosenborg	22	12	6	4	42:22	42	
4.	Valerenga	22	11	6	5	37:28	39	
5.	St. Odd	21	12	2	7	40:32	38	
6.	Kristiansund	22	9	9	4	42:30	36	
7.	Viking	21	8	5	8	38:39	29	
8.	Stabaek	22	7	8	7	30:33	29	
9.	Haugesund	22	8	4	10	27:36	28	
10.	Sarps-borg 08	22	8	3	11	26:29	27	
11.	Sandefjord	22	8	2	12	22:34	26	
12.	Stromsgodset	22	5	9	8	30:40	24	
13.	Brann	22	6	6	10	26:36	24	
14.	Start	22	4	7	11	25:41	19	
15.	Mjondalen	22	5	2	15	17:38	17	
16.	Aalesund	22	1	4	17	25:64	7`,
        Validators.required
      ),
      allHomeMatches: new FormControl(
        `1.	Bodo/Glimt	11	11	0	0	39:8	33	
2.	Molde	11	9	0	2	30:9	27	
3.	Valerenga	11	7	4	0	25:12	25	
4.	Rosenborg	11	7	3	1	27:12	24	
5.	St. Odd	10	7	1	2	21:12	22	
6.	Sarps-borg 08	12	6	1	5	18:11	19	
7.	Stabaek	11	5	3	3	15:10	18	
8.	Haugesund	11	5	2	4	18:18	17	
9.	Kristiansund	10	4	4	2	24:16	16	
10.	Start	12	4	4	4	17:16	16	
11.	Viking	11	4	3	4	23:19	15	
12.	Stromsgodset	11	3	5	3	16:19	14	
13.	Sandefjord	10	3	2	5	7:14	11	
14.	Brann	11	2	4	5	14:15	10	
15.	Mjondalen	10	3	0	7	8:14	9	
16.	Aalesund	12	1	2	9	14:33	5`,
        Validators.required
      ),
      allAwayMatches: new FormControl(
        `1.	Bodo/Glimt	11	8	2	1	34:17	26	
2.	Kristiansund	12	5	5	2	18:14	20	
3.	Rosenborg	11	5	3	3	15:10	18	
4.	Molde	11	5	1	5	24:18	16	
5.	St. Odd	11	5	1	5	19:20	16	
6.	Sandefjord	12	5	0	7	15:20	15	
7.	Valerenga	11	4	2	5	12:16	14	
8.	Viking	10	4	2	4	15:20	14	
9.	Brann	11	4	2	5	12:21	14	
10.	Stabaek	11	2	5	4	15:23	11	
11.	Haugesund	11	3	2	6	9:18	11	
12.	Stromsgodset	11	2	4	5	14:21	10	
13.	Sarps-borg 08	10	2	2	6	8:18	8	
14.	Mjondalen	12	2	2	8	9:24	8	
15.	Start	10	0	3	7	8:25	3	
16.	Aalesund	10	0	2	8	11:31	2`,
        Validators.required
      ),
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
    this.prediction$ = this.predictOneLine(this.formUltraShort.value.matches);
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
