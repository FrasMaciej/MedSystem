import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { config } from './config';
import { DoctorI } from '@shared/doctor';
import { ScheduleI, VisitI } from '@shared/schedule';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private doctorsList: DoctorI[] | any = [];

  constructor(private httpClient: HttpClient) { }

  getDoctor(id: string): Observable<any> {
    const getSelectedDoctorUrl = config.baseUrlDoc + '/' + id;
    return this.httpClient.get(getSelectedDoctorUrl);
  }

  getDoctors(): Observable<any> {
    this.doctorsList = this.httpClient.get(config.baseUrlDoc);
    return this.doctorsList;
  }

  getDoctorByUserId(id: string): Observable<any> {
    const getDoctorByUserIdUrl = config.baseUrlDoc + '/' + 'getByUserId' + '/' + id;
    return this.httpClient.get(getDoctorByUserIdUrl)
  }

  removeDoctor(doctor: DoctorI) {
    const deleteUrl = config.baseUrlDoc + '/' + doctor._id;
    return this.httpClient.delete(deleteUrl);
  }

  editDoctor(doctor: DoctorI) {
    const editUrl = config.baseUrlDoc + '/' + doctor._id;
    return this.httpClient.put(editUrl, doctor);
  }

  addDoctor(doctor: DoctorI) {
    const addUrl = config.baseUrlDoc;
    return this.httpClient.post(addUrl, doctor);
  }

  addTerminsSlots(schedule: ScheduleI, doctor: DoctorI): Observable<any> {
    const addTerminsUrl = config.baseUrlDoc + '/' + 'addTerminsSlots' + '/' + doctor._id;
    return this.httpClient.post(addTerminsUrl, schedule);
  }

  editVisit(visit: VisitI, doctorId: string, scheduleId: string, visitId: string, patientId: string) {
    const editVisitUrl = config.baseUrlDoc + '/' + 'editVisit' + '/' + doctorId + '/' + scheduleId + '/' + visitId;
    const visitInfo = {
      visit: visit,
      patientId: patientId
    }
    return this.httpClient.put(editVisitUrl, visitInfo);
  }

  getCities(): Observable<any> {
    const getCitiesUrl = config.baseUrlDoc + '/' + 'cities';
    return this.httpClient.get(getCitiesUrl);
  }

  getSpecs(): Observable<any> {
    const getSpecsUrl = config.baseUrlDoc + '/' + 'specs';
    return this.httpClient.get(getSpecsUrl);
  }

  getFilteredVisits(specialization: string, cities: string[], startDate: Date, endDate: Date): Observable<any> {
    const visitReq = {
      specialization: specialization,
      cities: cities,
      startDate: startDate,
      endDate: endDate
    }
    const getVisitsUrl = config.baseUrlDoc + '/' + 'filteredVisits';
    return this.httpClient.post(getVisitsUrl, visitReq);
  }

  getVisitsByPatient(patientId: string): Observable<any> {
    const getVisitsByPatientUrl = config.baseUrlDoc + '/' + 'findVisitByPatient' + '/' + patientId;
    return this.httpClient.get(getVisitsByPatientUrl)
  }
}
