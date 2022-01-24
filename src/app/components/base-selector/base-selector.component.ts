import { Component, OnInit } from '@angular/core';
import { DropdownOption } from 'src/app/models/dropdown';
import { BasesList, Sport, SportsList } from 'src/app/models/sport';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-base-selector',
  templateUrl: './base-selector.component.html',
  styleUrls: ['./base-selector.component.css']
})
export class BaseSelectorComponent implements OnInit {
  readonly basesList: DropdownOption[] = BasesList;
  readonly sportsList: DropdownOption[] = SportsList;
  selectedBase = 'assets/json/stat.json';
  selectedSport = Sport.soccer;

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
  }

  selectBase(event) {
    console.log(this.selectedBase);
    this.settingsService.setUrl(this.selectedBase);
  }

  selectSport(event) {
    this.settingsService.setSport(this.selectedSport);
  }
}
