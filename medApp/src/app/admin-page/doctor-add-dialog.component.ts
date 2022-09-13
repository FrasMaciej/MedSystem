import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UserI } from "@shared/user";
import { DoctorData } from "./admin-page.component";

@Component({
  selector: 'app-doctor-add-dialog',
  template: `
    <h1 mat-dialog-title>Dodajesz nowego lekarza<br></h1>

    <form [formGroup]="addDoctorForm">
      <div mat-dialog-content>
        <mat-form-field>
          <input matInput placeholder="Imię" formControlName="name" required>
        </mat-form-field>    
        <br>
        <mat-form-field>
          <input matInput placeholder="Nazwisko" formControlName="surname" required>
        </mat-form-field>    
        <br>
        <mat-form-field>
          <input matInput placeholder="Miasto" formControlName="city" required>
        </mat-form-field>    
        <br>
        <mat-form-field>
          <input matInput placeholder="Nazwa użytkownika" formControlName="username" minlength="6" required>
        </mat-form-field>  
        <br>
        <mat-form-field>
          <input type="password" matInput placeholder="Hasło" formControlName="password" minlength="6" required>
        </mat-form-field>  
      </div>

      <div mat-dialog-actions align="center">
        <button mat-button (click)="closeDialogRef()">Powrót</button>
        <button mat-button [disabled]="!addDoctorForm.valid" (click)="saveClick()" [mat-dialog-close]="doctor">Dodaj</button>
      </div>
    </form>

  `,
  styles: [`
      h1{
          text-align: center;
      }
  `]
})

export class DoctorAddDialogComponent {
  addDoctorForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    surname: new FormControl(''),
    city: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl(''),
  });
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
    this.doctor.name = this.addDoctorForm.get('name')?.value;
    this.doctor.surname = this.addDoctorForm.get('surname')?.value;
    this.doctor.city = this.addDoctorForm.get('city')?.value;
    this.doctor.username = this.addDoctorForm.get('username')?.value;
    this.doctor.password = this.addDoctorForm.get('password')?.value;
    this.doctor.role = 'Doctor';
  }

  closeDialogRef(): void {
    this.dialogRef.close();
  }
}
