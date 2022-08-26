import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Doctor } from '../models/doctor';
import { HttpClient } from '@angular/common/http';
import { Schedule, Visit } from '../models/schedule';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private doctorsList: Doctor[] | any = [];

  constructor(private httpClient: HttpClient) { }

  getDoctor(id: string) : Observable<any> {
    const getSelectedDoctorUrl = config.baseUrlDoc+'/'+id;
    return this.httpClient.get(getSelectedDoctorUrl);
  }

  getDoctors() : Observable<any> {
    console.log(config.baseUrlDoc);
    this.doctorsList = this.httpClient.get(config.baseUrlDoc);
    return this.doctorsList;
  }

  removeDoctor(doctor: Doctor) {
    const deleteUrl = config.baseUrlDoc+'/'+doctor._id;
    return this.httpClient.delete(deleteUrl);
  }

  editDoctor(doctor: Doctor) {
    const editUrl = config.baseUrlDoc+'/'+doctor._id;
    return this.httpClient.put(editUrl, doctor);
  } 

  addDoctor(doctor: Doctor) {
    const addUrl = config.baseUrlDoc;
    return this.httpClient.post(addUrl, doctor);
  }

  addTerminsSlots(schedule: Schedule, doctor: Doctor) : Observable<any> {
    const addTerminsUrl = config.baseUrlDoc+'/'+'addTerminsSlots'+'/'+doctor._id;
    return this.httpClient.post(addTerminsUrl, schedule);
  }

  editVisit(visit: Visit, doctorId: String, scheduleId: String, visitId: String) {
    const editVisitUrl = config.baseUrlDoc+'/'+'editVisit'+'/'+doctorId+'/'+scheduleId+'/'+visitId;
    return this.httpClient.put(editVisitUrl, visit)
  }

  getCities() : Observable<any> {
    const getCitiesUrl = config.baseUrlDoc+'/'+'cities';
    return this.httpClient.get(getCitiesUrl);
  }

  getSpecs() : Observable<any> {
    const getSpecsUrl = config.baseUrlDoc+'/'+'specs';
    return this.httpClient.get(getSpecsUrl);
  }

  getFilteredVisits(specialization: String, cities: String[], startDate: Date, endDate: Date) : Observable<any> {
    const visitReq = {
      specialization: specialization,
      cities: cities,
      startDate: startDate,
      endDate: endDate
    }
    const getVisitsUrl = config.baseUrlDoc+'/'+'filteredVisits';
    return this.httpClient.post(getVisitsUrl, visitReq);
  }
}
