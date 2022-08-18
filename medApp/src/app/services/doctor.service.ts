import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Doctor } from '../models/doctor';
import { HttpClient } from '@angular/common/http';
import { Schedule, Visit } from '../models/schedule';



@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private doctorsList: Doctor[] | any = [];
  public baseUrl = 'http://localhost:8080/api/doctors';


  constructor(private httpClient: HttpClient) { }

  getDoctor(id: string) : Observable<any> {
    const getSelectedDoctorUrl = this.baseUrl+'/'+id;
    return this.httpClient.get(getSelectedDoctorUrl);
  }

  getDoctors() : Observable<any> {
    this.doctorsList = this.httpClient.get(this.baseUrl);
    return this.doctorsList;
  }

  removeDoctor(doctor: Doctor) {
    const deleteUrl = this.baseUrl+'/'+doctor._id;
    return this.httpClient.delete(deleteUrl);
  }

  editDoctor(doctor: Doctor) {
    const editUrl = this.baseUrl+'/'+doctor._id;
    return this.httpClient.put(editUrl, doctor);
  } 

  addDoctor(doctor: Doctor) {
    const addUrl = this.baseUrl;
    return this.httpClient.post(addUrl, doctor);
  }

  addTerminsSlots(schedule: Schedule, doctor: Doctor) : Observable<any> {
    const addTerminsUrl = this.baseUrl+'/'+'addTerminsSlots'+'/'+doctor._id;
    return this.httpClient.post(addTerminsUrl, schedule);
  }

  editVisit(visit: Visit, doctorId: String, scheduleId: String, visitId: String) {
    const editVisitUrl = this.baseUrl+'/'+'editVisit'+'/'+doctorId+'/'+scheduleId+'/'+visitId;
    return this.httpClient.put(editVisitUrl, visit)
  }

  getCities() : Observable<any> {
    const getCitiesUrl = this.baseUrl+'/'+'cities';
    return this.httpClient.get(getCitiesUrl);
  }

  getSpecs() : Observable<any> {
    const getSpecsUrl = this.baseUrl+'/'+'specs';
    return this.httpClient.get(getSpecsUrl);
  }

  getFilteredVisits(specialization: String, cities: String[], startDate: Date, endDate: Date) : Observable<any> {
    const visitReq = {
      specialization: specialization,
      cities: cities,
      startDate: startDate,
      endDate: endDate
    }
    const getVisitsUrl = this.baseUrl+'/'+'filteredVisits';
    return this.httpClient.post(getVisitsUrl, visitReq);
  }

}
