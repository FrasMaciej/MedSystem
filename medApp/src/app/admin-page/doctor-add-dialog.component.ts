import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UserI } from "@shared/user";
import { DoctorData } from "./admin-page.component";

@Component({
  selector: 'app-doctor-add-dialog',
  template: `
    <h1 mat-dialog-title>Dodajesz nowego lekarza<br></h1>
    <div mat-dialog-content>
      <mat-form-field>
        <input matInput placeholder="Imię" [(ngModel)]="name">
      </mat-form-field>    
      <br>
      <mat-form-field>
        <input matInput placeholder="Nazwisko" [(ngModel)]="surname">
      </mat-form-field>    
      <br>
      <mat-form-field>
        <input matInput placeholder="Miasto" [(ngModel)]="city">
      </mat-form-field>    
      <br>
      <mat-form-field>
        <input matInput placeholder="Nazwa użytkownika" [(ngModel)]="username">
      </mat-form-field>  
      <br>
      <mat-form-field>
        <input type="password" matInput placeholder="Hasło" [(ngModel)]="password">
      </mat-form-field>  
    </div>
    <div mat-dialog-actions align="center">
      <button mat-button (click)="closeDialogRef()">Powrót</button>
      <button mat-button (click)="saveClick()" [mat-dialog-close]="doctor">Dodaj</button>
    </div>
  `,
  styles: [`
      h1{
          text-align: center;
      }
  `]
})

export class DoctorAddDialogComponent {
  name: string = '';
  surname: string = '';
  city: string = '';
  username: string = '';
  password: string = '';
  doctor: UserI = {
    username: '',
    name: '',
    surname: '',
    role: '',
    city: ''
  }
  constructor(
    public dialogRef: MatDialogRef<DoctorAddDialogComponent>) { }
  // @Inject(MAT_DIALOG_DATA) public doctor: UserI) { }

  saveClick(): void {
    this.doctor.name = this.name;
    this.doctor.surname = this.surname;
    this.doctor.city = this.city;
    this.doctor.username = this.username;
    this.doctor.password = this.password;
    this.doctor.role = 'Doctor';
  }

  closeDialogRef(): void {
    this.dialogRef.close();
  }
}
