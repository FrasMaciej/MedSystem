import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Doctor } from '../models/doctor';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private doctorsList: Array<Doctor> | any = [];

  constructor(private http: HttpClient) { 
  }

  getDoctorsHttp(){
    this.http.get('http://localhost:8080/api/doctors')
    .subscribe((doctors)=>{
      console.log(doctors);
      this.doctorsList = JSON.parse(JSON.stringify(doctors));
    });

  }

  getDoctors(){
    this.getDoctorsHttp();
    return this.doctorsList;
  }

}
