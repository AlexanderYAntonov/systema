import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  url$: BehaviorSubject<string> = new BehaviorSubject('assets/json/stat.json');
  private allUrls:string[] = [
    // 'assets/json/stat.json',
    'assets/json/eng.json',
    'assets/json/neth.json',
    'assets/json/germany.json',
    'assets/json/greece.json',
    'assets/json/spain.json',
    'assets/json/rus.json',
    'assets/json/france.json',
    'assets/json/italy.json',
    'assets/json/portugal.json',
    'assets/json/slovenia.json',
    'assets/json/turkey.json',
    // 'assets/json/eng-league-one.json',   
  ];

  private allHandballUrls:string[] = [
    'assets/json/handball/germany.json',
    'assets/json/handball/sweden.json',
    'assets/json/handball/denmark.json',
    'assets/json/handball/spain.json',
    'assets/json/handball/france.json',
    'assets/json/handball/romania.json',
    'assets/json/handball/austria.json',
    'assets/json/handball/croatia.json',
    'assets/json/handball/portugal.json',
    // 'assets/json/handball/russia.json',
  ];

  constructor() { }

  setUrl(newUrl: string) {
    if (newUrl) {
      this.url$.next(newUrl);
    }
  }

  getUrl(): Observable<string> {
    return this.url$.asObservable();
  }

  getAllUrls(): string[] {
    return this.allUrls;
  }

  getAllHandballUrls(): string[] {
    return this.allHandballUrls;
  }
}
