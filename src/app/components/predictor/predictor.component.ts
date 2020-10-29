import { isNgTemplate } from '@angular/compiler';
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
  predictions$: Observable<Prediction>[];
  blockVektorList: Vektor[];

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
      names: new FormControl(
        `19:00Mallorca - Malaga	 	
1.95	3.04	4.34
19:00Mirandes - Zaragoza	 	
2.67	2.88	2.86
19:00Tenerife - Lugo	 	
2.00	2.93	4.35`,
        Validators.required
      ),
      allMatches: new FormControl(
        `1.	Espanyol	9	6	2	1	11:1	20	
2.	Gijon	8	5	1	2	8:4	16	
3.	Mallorca	8	4	3	1	6:1	15	
4.	Leganes	8	5	0	3	9:7	15	
5.	Malaga	8	4	2	2	6:8	14	
6.	Rayo Vallecano	8	4	1	3	9:7	13	
7.	Fuenlabrada	8	3	4	1	9:8	13	
8.	Las Palmas	9	3	4	2	12:12	13	
9.	Cartagena	9	3	3	3	11:9	12	
10.	Ponferradina	8	4	0	4	9:8	12	
11.	Lugo	8	4	0	4	10:10	12	
12.	Girona	7	4	0	3	5:7	12	
13.	Almeria	7	3	1	3	8:6	10	
14.	Mirandes	8	2	4	2	6:6	10	
15.	Albacete	9	2	3	4	7:10	9	
16.	Zaragoza	6	2	2	2	7:5	8	
17.	Castellon	9	2	2	5	8:10	8	
18.	Logrones	8	2	2	4	8:10	8	
19.	Tenerife	8	2	2	4	5:8	8	
20.	R. Oviedo	9	1	4	4	6:10	7	
21.	Alcorcon	6	1	1	4	2:7	4	
22.	Sabadell	6	0	1	5	1:9	1`,
        Validators.required
      ),
      allHomeMatches: new FormControl(
        `1.	Espanyol	5	4	1	0	8:0	13	
2.	Leganes	5	4	0	1	7:3	12	
3.	Las Palmas	4	3	1	0	9:5	10	
4.	Gijon	4	3	1	0	6:2	10	
5.	Rayo Vallecano	3	3	0	0	7:1	9	
6.	Fuenlabrada	4	2	2	0	4:1	8	
7.	Albacete	5	2	2	1	7:5	8	
8.	Malaga	4	2	2	0	3:1	8	
9.	Cartagena	4	2	1	1	6:3	7	
10.	Tenerife	4	2	1	1	4:2	7	
11.	Mallorca	4	2	1	1	3:1	7	
12.	Ponferradina	4	2	0	2	5:4	6	
13.	Lugo	4	2	0	2	5:4	6	
14.	Girona	3	2	0	1	3:2	6	
15.	Zaragoza	4	1	2	1	4:4	5	
16.	R. Oviedo	5	1	2	2	3:5	5	
17.	Almeria	3	1	1	1	4:2	4	
18.	Logrones	4	1	1	2	4:5	4	
19.	Mirandes	4	0	3	1	1:2	3	
20.	Castellon	5	1	0	4	3:5	3	
21.	Alcorcon	3	1	0	2	2:5	3	
22.	Sabadell	2	0	0	2	0:3	0`,
        Validators.required
      ),
      allAwayMatches: new FormControl(
        `1.	Mallorca	4	2	2	0	3:0	8	
2.	Espanyol	4	2	1	1	3:1	7	
3.	Mirandes	4	2	1	1	5:4	7	
4.	Ponferradina	4	2	0	2	4:4	6	
5.	Almeria	4	2	0	2	4:4	6	
6.	Gijon	4	2	0	2	2:2	6	
7.	Lugo	4	2	0	2	5:6	6	
8.	Girona	4	2	0	2	2:5	6	
9.	Malaga	4	2	0	2	3:7	6	
10.	Castellon	4	1	2	1	5:5	5	
11.	Cartagena	5	1	2	2	5:6	5	
12.	Fuenlabrada	4	1	2	1	5:7	5	
13.	Logrones	4	1	1	2	4:5	4	
14.	Rayo Vallecano	5	1	1	3	2:6	4	
15.	Zaragoza	2	1	0	1	3:1	3	
16.	Leganes	3	1	0	2	2:4	3	
17.	Las Palmas	5	0	3	2	3:7	3	
18.	R. Oviedo	4	0	2	2	3:5	2	
19.	Alcorcon	3	0	1	2	0:2	1	
20.	Tenerife	4	0	1	3	1:6	1	
21.	Sabadell	4	0	1	3	1:6	1	
22.	Albacete	4	0	1	3	0:5	1`,
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

    const allMatchesRegExp = /\d\.([a-zA-Z\s\\\d\.\-]+\d:\d+)/g;
    const allMatchesArr: string[] = this.extractBlockValues(
      allMatchesRegExp,
      this.formBlock.value.allMatches
    );

    const allHomeMatchesArr: string[] = this.extractBlockValues(
      allMatchesRegExp,
      this.formBlock.value.allHomeMatches
    );

    const allAwayMatchesArr: string[] = this.extractBlockValues(
      allMatchesRegExp,
      this.formBlock.value.allAwayMatches
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

  // TO DO DRY
  private getAllMatchesFromBlockForm(
    vektorList: Vektor[],
    matches: string[]
  ): Vektor[] {
    vektorList = vektorList.map((vektor) => {
      const { home, visitor } = vektor;
      const regExp = /(\d+\s+\d+\s+\d+\s+\d+:\d+)/g;
      const homeTotal = matches
        .find((item) => item.includes(home))
        .match(regExp)[0];
      const visitorTotal = matches
        .find((item) => item.includes(visitor))
        .match(regExp)[0];
      Object.assign(vektor, { visitorTotal, homeTotal });
      return vektor;
    });
    return vektorList;
  }

  private getHomeMatchesFromBlockForm(
    vektorList: Vektor[],
    matches: string[]
  ): Vektor[] {
    vektorList = vektorList.map((vektor) => {
      const { home } = vektor;
      const regExp = /(\d+\s+\d+\s+\d+\s+\d+:\d+)/g;
      const homeIn = matches
        .find((item) => item.includes(home))
        .match(regExp)[0];
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
      const regExp = /(\d+\s+\d+\s+\d+\s+\d+:\d+)/g;
      const visitorOut = matches
        .find((item) => item.includes(visitor))
        .match(regExp)[0];
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
}
