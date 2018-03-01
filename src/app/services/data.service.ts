import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { MetaData } from './data.model';

@Injectable()
export class DataService {

  private data: any;

  constructor(private http: Http) {
  }

  // TODO: Figure out how to call the local files.
  public getJson(): Observable<MetaData[]> {
    return this.http.get('data.json').map((res) => res.json());
  }


}
