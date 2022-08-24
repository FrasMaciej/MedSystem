import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { PatientService } from './patient.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private patientService: PatientService, private route: Router) { }

  canActivate(){
    if(this.patientService.isAuthenticated()){
      return true;
    }
    this.route.navigate(['login/patient']);
    return false;
  }
}
