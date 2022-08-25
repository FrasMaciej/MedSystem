import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

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
    const loginUrl = config.baseUrlPatient+'/'+'login';
    const loginData = {
      username: username,
      password: password,
    }
    return this.httpClient.post(loginUrl, loginData).toPromise();
  }

  public register(username: String, password: String, name: String, surname: String) {
    const registerUrl = config.baseUrlPatient+'/'+'register';
    const newPatient = {
      username: username,
      password: password,
      name: name,
      surname: surname
    }
    return this.httpClient.post(registerUrl, newPatient)
  }

}
