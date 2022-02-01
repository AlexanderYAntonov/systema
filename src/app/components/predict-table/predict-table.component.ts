import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Prediction, Vektor } from 'src/app/models/vektor';

@Component({
  selector: 'app-predict-table',
  templateUrl: './predict-table.component.html',
  styleUrls: ['./predict-table.component.css']
})
export class PredictTableComponent implements OnInit {
  @Input() predictions$: Observable<Prediction>[];
  @Input() blockVektorList: Vektor[] = [];
  @Input() showGoalsPrediction = false;
  @Input() homeForm: {[key: string]: string[]};
  @Input() awayForm: {[key: string]: string[]};

  constructor() { }

  ngOnInit(): void {
  }

}
