import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import config from './config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClient: HttpClient) { }

  public isAuthenticated() : Boolean {
    let userData = localStorage.getItem('userInfo')
    if(userData && JSON.parse(userData)){
      return true;
    }
    else return false;
  }

  public setUserInfo(user: any){
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  public validate(username: String, password: String) {
    const loginUrl = config.baseUrlUser+'/'+'login';
    const loginData = {
      username: username,
      password: password,
    }
    return this.httpClient.post(loginUrl, loginData).toPromise();
  }

  public register(username: String, password: String, name: String, surname: String) {
    const registerUrl = config.baseUrlUser+'/'+'register';
    const newUser = {
      username: username,
      password: password,
      name: name,
      surname: surname
    }
    return this.httpClient.post(registerUrl, newUser)
  }

}
