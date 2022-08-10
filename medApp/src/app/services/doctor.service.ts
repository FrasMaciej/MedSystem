import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Doctor } from '../models/doctor';
import { HttpClient } from '@angular/common/http';
import { Schedule } from '../models/schedule';



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
    const editUrl = this.baseUrl+'/'+doctor._id;
    return this.httpClient.put(editUrl, doctor);
  } 

  addDoctor(doctor: Doctor){
    const addUrl = this.baseUrl;
    return this.httpClient.post(addUrl, doctor);
  }

  addTerminsSlots(schedule: Schedule, doctor: Doctor){
    const addTerminsUrl = this.baseUrl+'/'+'addTerminsSlots'+'/'+doctor._id;
    return this.httpClient.post(addTerminsUrl, schedule);
  }

}
