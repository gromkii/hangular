import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Http} from "@angular/http";

@Injectable()
export class DataServiceService {

  private data: any;

  constructor(private http: Http) {
    this.getJson().subscribe(res => {
      this.data = res;
    }, err => console.log(err));
  }

  getData() {
    return this.data;
  }

  public getJson(): Observable<any> {
    return this.http.get('./data.json')
      .map((res: Response) => res.json())
      .catch((error: any) => console.log(error));
  }


}
