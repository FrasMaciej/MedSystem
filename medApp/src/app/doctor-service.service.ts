import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { catchError, retry } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DoctorServiceService {
  constructor(private httpClient: HttpClient) {}

  public get(url: string): Observable<any>{
    return this.httpClient.get(url);
  }

}
