import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserI } from '@shared/user';
import { config } from '../services/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClient: HttpClient) { }

  public isAuthenticated(): boolean {
    let userData = localStorage.getItem('userInfo')
    if (userData && JSON.parse(userData)) {
      return true;
    }
    else return false;
  }

  public setUserInfo(user: any) {
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  public validate(username: string, password: string) {
    const loginUrl = config.baseUrlUser + '/' + 'login';
    const loginData = {
      username: username,
      password: password,
    }
    return this.httpClient.post(loginUrl, loginData).toPromise();
  }

  public register(user: UserI) {
    const registerUrl = config.baseUrlUser + '/' + 'register';
    return this.httpClient.post(registerUrl, user).toPromise();
  }
}
