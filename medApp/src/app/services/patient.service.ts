import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  public baseUrl = 'http://localhost:8080/api/patient';

  constructor(private httpClient: HttpClient) { }

  login(username: String, password: String) {
    const loginUrl = this.baseUrl+'/'+'login';
    const loginData = {
      username: username,
      password: password,
    }
    return this.httpClient.post(loginUrl, loginData)
  }

  register(username: String, password: String, name: String, surname: String) {
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
