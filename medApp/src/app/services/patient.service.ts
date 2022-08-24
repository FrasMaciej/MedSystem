import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Patient } from '../models/schedule';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  public baseUrl = 'http://localhost:8080/api/patient';

  constructor(private httpClient: HttpClient) { }

  public isAuthenticated() : Boolean {
    let patientData = localStorage.getItem('patientInfo')
    if(patientData && JSON.parse(patientData)){
      return true;
    }
    else return false;
  }

  public setPatientInfo(patient: any){
    localStorage.setItem('patientInfo', JSON.stringify(patient));
  }

  public validate(username: String, password: String) {
    const loginUrl = this.baseUrl+'/'+'login';
    const loginData = {
      username: username,
      password: password,
    }
    return this.httpClient.post(loginUrl, loginData).toPromise();
  }

  public register(username: String, password: String, name: String, surname: String) {
    const registerUrl = this.baseUrl+'/'+'register';
    const newPatient = {
      username: username,
      password: password,
      name: name,
      surname: surname
    }
    return this.httpClient.post(registerUrl, newPatient)
  }

}
