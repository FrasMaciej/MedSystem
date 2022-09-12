import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { DoctorPageComponent } from './doctor-page/doctor-page.component';
import { LoginComponent } from './login/login.component';
import { MainPageComponent } from './main-page/main-page.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { PatientPageComponent } from './patient-page/patient-page.component';
import { SchedulePageComponent } from './schedule-page/schedule-page.component';
import { AuthGuardService as AuthGuard } from './login/auth-guard.service';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'login/admin', component: LoginComponent },
  { path: 'login/doctor', component: LoginComponent },
  { path: 'login/patient', component: LoginComponent },
  { path: 'patientPage', component: PatientPageComponent, canActivate: [AuthGuard] },
  { path: 'patientPage/details', component: PatientDetailsComponent, canActivate: [AuthGuard] },
  { path: 'schedulePage/doctor/:docId/:schId', component: SchedulePageComponent, canActivate: [AuthGuard] },
  { path: 'schedulePage/admin/:docId/:schId', component: SchedulePageComponent, canActivate: [AuthGuard] },
  { path: 'adminPage', component: AdminPageComponent },
  { path: 'doctorPage', component: DoctorPageComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
