import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Doctor } from '../models/doctor';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private doctorsList: Array<Doctor> | any = [];
  public baseUrl = "http://localhost:8080/api/doctors";


  constructor(private httpClient: HttpClient) {}

  getDoctors(){
    return this.httpClient.get(this.baseUrl);
  }

}
