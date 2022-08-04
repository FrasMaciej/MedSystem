import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Doctor } from '../models/doctor';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private doctorsList: Array<Doctor> | any = [];
  public baseUrl = 'http://localhost:8080/api/doctors';


  constructor(private httpClient: HttpClient) {}

  getDoctors() : Observable<any>{
    this.doctorsList = this.httpClient.get(this.baseUrl);
    return this.doctorsList;
  }

  removeDoctor(doctor: Doctor){
    const deleteUrl = this.baseUrl+'/'+doctor._id;
    return this.httpClient.delete(deleteUrl);
  }

  editDoctor(doctor: Doctor){
    const deleteUrl = this.baseUrl+'/'+doctor._id;
    console.log("Dziaua");
    return this.httpClient.put(deleteUrl, doctor);
  } 

}
