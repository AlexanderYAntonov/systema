import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';

interface DropdownOption { label: string; value: string; }

const BasesList: DropdownOption[] = [
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
  {
    label: 'Norway base',
    value: 'assets/json/norway.json'
  },
  {
    label: 'Spain base',
    value: 'assets/json/spain.json'
  },
  {
    label: 'Rus base',
    value: 'assets/json/rus.json'
  },
  {
    label: 'France base',
    value: 'assets/json/france.json'
  },
  {
    label: 'Italy base',
    value: 'assets/json/italy.json'
  },
];

@Component({
  selector: 'app-base-selector',
  templateUrl: './base-selector.component.html',
  styleUrls: ['./base-selector.component.sass']
})
export class BaseSelectorComponent implements OnInit {
  readonly basesList: DropdownOption[] = BasesList;
  selectedBase = 'assets/json/stat.json';

  constructor(private baseService: BaseService) { }

  ngOnInit() {
  }

  selectBase(event) {
    console.log(this.selectedBase);
    this.baseService.setUrl(this.selectedBase);
  }
}
