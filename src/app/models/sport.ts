import { DropdownOption } from './dropdown';

export const BasesList: DropdownOption[] = [
  {
    label: 'Init base',
    value: 'assets/json/stat.json'
  },
  {
    label: 'HBFG',
    value: 'HBFG'
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
    label: 'Greece base',
    value: 'assets/json/greece.json'
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
  {
    label: 'Portugal base',
    value: 'assets/json/portugal.json'
  },
  {
    label: 'Slovenia base',
    value: 'assets/json/slovenia.json'
  },
  {
    label: 'Turkey base',
    value: 'assets/json/turkey.json'
  },
  {
    label: 'Eng League One base',
    value: 'assets/json/eng-league-one.json'
  },
  {
    label: 'Eng Women Super League base',
    value: 'assets/json/eng-women-super-league.json'
  },
  {
    label: 'BFG 2000',
    value: 'BFG'
  }
];

export enum Sport {
  'soccerMajor' = 'soccerMajor',
  'soccerMinor' = 'soccerMinor',
  'handball' = 'handball'
}

export const SportsList: DropdownOption[] = [
  {
    label: 'Soccer Major',
    value: Sport.soccerMajor
  },
  {
    label: 'Soccer Minor',
    value: Sport.soccerMinor
  },
  {
    label: 'Handball',
    value: Sport.handball
  },
];
