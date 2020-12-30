import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VektorService } from 'src/app/services/vektor.service';

@Component({
  selector: 'app-koef-selector',
  templateUrl: './koef-selector.component.html',
  styleUrls: ['./koef-selector.component.css']
})
export class KoefSelectorComponent implements OnInit {
  koef: number;

  constructor(private vektorService: VektorService) { }

  ngOnInit() {
    this.koef = 7;
  }

  koefChange(event) {
    const {value} = event.target;
    console.log(value);
    if (value) {
      this.vektorService.setPredictKoef(value);
    }
  }

}
