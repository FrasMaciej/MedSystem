import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DoctorData } from "./admin-page.component";

@Component({
  selector: 'doctor-add-dialog',
  template: `
    <h1 mat-dialog-title>Dodajesz nowego lekarza<br></h1>
    <div mat-dialog-content>
      <mat-form-field>
        <input matInput placeholder="Imię" [(ngModel)]="data.newName">
      </mat-form-field>    
      <br>
      <mat-form-field>
        <input matInput placeholder="Nazwisko" [(ngModel)]="data.newSurname">
      </mat-form-field>    
      <br>
      <mat-form-field>
        <input matInput placeholder="Miasto" [(ngModel)]="data.newCity">
      </mat-form-field>    
    </div>
    <div mat-dialog-actions align="center">
      <button mat-button (click)="closeDialogRef()">Powrót</button>
      <button mat-button (click)="saveClick()" [mat-dialog-close]="data.doctor">Dodaj</button>
    </div>
  `,
  styles: [`
      h1{
          text-align: center;
      }
  `]
})

export class DoctorAddDialog {
  constructor(
    public dialogRef: MatDialogRef<DoctorAddDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DoctorData) { }

  saveClick(): void {
    this.data.doctor.name = this.data.newName;
    this.data.doctor.surname = this.data.newSurname;
    this.data.doctor.city = this.data.newCity;
  }

  closeDialogRef(): void {
    this.dialogRef.close();
  }
}
