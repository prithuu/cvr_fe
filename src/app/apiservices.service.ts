import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders, HttpParams} from '../../node_modules/@angular/common/http';
import {environment} from '../environments/environment';
import {map, shareReplay} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ApiservicesService {

  httpOptions : any;
  constructor(private httpClient: HttpClient) { }

  getHttp(){
    this.httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
      })
    };
  }

  postData(data){
    this.getHttp();
    return this.httpClient.post(environment.host + '/', JSON.stringify(data), this.httpOptions)
            .pipe(map(res => res));
  }
}
