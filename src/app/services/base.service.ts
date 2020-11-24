import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  url$: BehaviorSubject<string> = new BehaviorSubject('assets/json/stat.json');

  constructor() { }

  setUrl(newUrl: string) {
    if (newUrl) {
      this.url$.next(newUrl);
    }
  }

  getUrl(): Observable<string> {
    return this.url$.asObservable();
  }
}
