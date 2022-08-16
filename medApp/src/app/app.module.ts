import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AdminPageComponent} from './admin-page/admin-page.component';
import { LoginComponent } from './login/login.component';
import { MainPageComponent } from './main-page/main-page';
import { DoctorService } from './services/doctor.service';
import { SchedulePageComponent} from './schedule-page/schedule-page.component';
import { EditVisitDialog } from './schedule-page/edit-visit-dialog.component';
import { SchedulesDialog } from './admin-page/schedules-dialog.component';
import { DoctorAddDialog } from './admin-page/doctor-add-dialog.component';
import { DoctorEditDialog } from './admin-page/doctor-edit-dialog.component';
import { PatientPageComponent } from './patient-page/patient-page.component';

@NgModule({
  declarations: [
    AppComponent, MainPageComponent, LoginComponent, AdminPageComponent,
    DoctorEditDialog, DoctorAddDialog, EditVisitDialog, SchedulesDialog,
    SchedulePageComponent,
    PatientPageComponent,
  ],
  imports: [
    BrowserModule, AppRoutingModule, MatRadioModule, BrowserAnimationsModule,
    MatToolbarModule, MatIconModule, MatButtonModule, MatCardModule,
    MatDialogModule, MatInputModule, MatListModule, FormsModule,
    MatSelectModule, ReactiveFormsModule, HttpClientModule, 
    RouterModule.forRoot([
      { path: '', component: MainPageComponent },
      { path: 'login/admin', component: LoginComponent },
      { path: 'login/doctor', component: LoginComponent },
      { path: 'login/patient', component: LoginComponent },
      { path: 'adminPage', component: AdminPageComponent },
      { path: 'patientPage', component: PatientPageComponent },
      { path: 'schedulePage/:docId/:schId', component: SchedulePageComponent },
    ])
  ],
  providers: [DoctorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
