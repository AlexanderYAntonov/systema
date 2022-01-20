import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { element } from 'protractor';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {
  engUrl = '/soccer/england/premier-league/';

  constructor(private http: HttpClient,) { }

  loadSchedules() {
    this.loadSchedule(this.engUrl).subscribe(() => {});
  }

  private loadSchedule(url: string): Observable<any> {
    return this.http.get(url, { responseType: 'text' }).pipe(
      map(data => {

        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "text/html");
        const element = doc.getElementsByClassName('table-main--leaguefixtures')[0];
        const XMLS = new XMLSerializer();
        const str = XMLS.serializeToString(element);
        console.log(str);
      })
    )
  }
}
