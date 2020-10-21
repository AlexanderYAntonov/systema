import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs';
import {
  GoalsPoint,
  NormalVektor,
  Prediction,
  PredictResult,
  WinsPoint
} from 'src/app/models/vektor';
import { VektorService } from '../../services/vektor.service';

@Component({
  selector: 'app-predictor',
  templateUrl: './predictor.component.html',
  styleUrls: [ './predictor.component.css' ]
})
export class PredictorComponent implements OnInit {
  form: FormGroup;
  prediction$: Observable<Prediction>;

  constructor(private vektorService: VektorService) {
    this.buildForm();
  }

  ngOnInit() {}

  private buildForm() {
    this.form = new FormGroup({
      homeTotalMatches: new FormGroup({
        wins: new FormControl(null, Validators.required),
        equals: new FormControl(null, Validators.required),
        loses: new FormControl(null, Validators.required)
      }),
      homeInMatches: new FormGroup({
        wins: new FormControl(null, Validators.required),
        equals: new FormControl(null, Validators.required),
        loses: new FormControl(null, Validators.required)
      }),
      visitorTotalMatches: new FormGroup({
        wins: new FormControl(null, Validators.required),
        equals: new FormControl(null, Validators.required),
        loses: new FormControl(null, Validators.required)
      }),
      visitorOutMatches: new FormGroup({
        wins: new FormControl(null, Validators.required),
        equals: new FormControl(null, Validators.required),
        loses: new FormControl(null, Validators.required)
      }),
      homeTotalGoals: new FormGroup({
        shots: new FormControl(null, Validators.required),
        loses: new FormControl(null, Validators.required)
      }),
      homeInGoals: new FormGroup({
        shots: new FormControl(null, Validators.required),
        loses: new FormControl(null, Validators.required)
      }),
      visitorTotalGoals: new FormGroup({
        shots: new FormControl(null, Validators.required),
        loses: new FormControl(null, Validators.required)
      }),
      visitorOutGoals: new FormGroup({
        shots: new FormControl(null, Validators.required),
        loses: new FormControl(null, Validators.required)
      })
    });
  }

  calcPrediction() {
    console.table(this.form.value);
    console.log(this.form.valid);
    const { value } = this.form;
    const homeTotalMatches: WinsPoint = value['homeTotalMatches'];
    const homeInMatches: WinsPoint = value['homeInMatches'];
    const visitorTotalMatches: WinsPoint = value['viisitorTotalMatches'];
    const visitorOutMatches: WinsPoint = value['viisitorOutMatches'];
    const homeTotalGoals: GoalsPoint = value['homeTotalGoals'];
    const homeInGoals: GoalsPoint = value['homeInGoals'];
    const visitorTotalGoals: GoalsPoint = value['visitorTotalGoals'];
    const visitorOutGoals: GoalsPoint = value['visitorOutGoals'];
    let vektor = new NormalVektor(
      homeTotalMatches,
      homeInMatches,
      visitorTotalMatches,
      visitorOutMatches,
      homeTotalGoals,
      homeInGoals,
      visitorTotalGoals,
      visitorOutGoals
    );
    vektor = this.vektorService.renormalizeVektor(vektor);
    console.table(vektor);
    this.prediction$ = this.vektorService.calcPrediction(vektor);
  }
}
