import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { LoginComponent } from './login/login.component';
import { MainPageComponent } from './main-page/main-page';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { PatientPageComponent } from './patient-page/patient-page.component';
import { SchedulePageComponent } from './schedule-page/schedule-page.component';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'login/admin', component: LoginComponent },
  { path: 'login/doctor', component: LoginComponent },
  { path: 'login/patient', component: LoginComponent },
  { path: 'adminPage', component: AdminPageComponent },
  { path: 'patientPage', component: PatientPageComponent, canActivate : [AuthGuard] },
  { path: 'patientPage/details', component: PatientDetailsComponent, canActivate : [AuthGuard] },
  { path: 'schedulePage/:docId/:schId', component: SchedulePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
