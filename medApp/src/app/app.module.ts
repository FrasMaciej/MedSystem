import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AdminPageComponent, DoctorAddDialog, DoctorEditDialog } from './admin-page/admin-page.component';
import { LoginComponent } from './login/login.component';
import { MainPageComponent } from './main-page/main-page';
import { DoctorService } from './services/doctor.service';



@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    LoginComponent,
    AdminPageComponent,
    DoctorEditDialog,
    DoctorAddDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: MainPageComponent },
      { path: 'login', component: LoginComponent },
      { path: 'adminPage', component: AdminPageComponent },
    ])
  ],
  providers: [DoctorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
