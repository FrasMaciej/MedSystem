import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';


import { MainTopBarComponent } from './main-top-bar/main-top-bar.component';
import { MatIconModule } from '@angular/material/icon'; 
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { LoginComponent } from './login/login.component';
import { AdminPageComponent, DoctorEditDialog } from './admin-page/admin-page.component';
import { DoctorService } from './services/doctor.service';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    AppComponent,
    MainTopBarComponent,
    LoginComponent,
    AdminPageComponent,
    DoctorEditDialog
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
      { path: '', component: MainTopBarComponent },
      { path: 'login', component: LoginComponent },
      { path: 'adminPage', component: AdminPageComponent },
    ])
  ],
  providers: [DoctorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
