import { Component, OnInit } from '@angular/core';
import { PredictResult } from 'src/app/models/vektor';
import { VektorService } from '../../services/vektor.service';

@Component({
  selector: 'app-predictor',
  templateUrl: './predictor.component.html',
  styleUrls: [ './predictor.component.sass' ]
})
export class PredictorComponent implements OnInit {
  constructor(private vektorService: VektorService) {}

  ngOnInit() {}
}
