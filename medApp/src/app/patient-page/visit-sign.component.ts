import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { DoctorService } from '../services/doctor.service';
import { VisitData } from './patient-page.component';

@Component({
  selector: 'app-visit-sign',
  template: `
    <h1 mat-dialog-title>Zapisujesz się na wizytę <br> 
    {{data.visitInfo.visit.startHour | date:'yyyy-MM-dd HH:mm':'+0000'}} — {{data.visitInfo.visit.finishHour | date:'HH:mm':'+0000'}}<br>
    {{data.visitInfo.docName}} {{data.visitInfo.docSurname}}, {{data.visitInfo.docSpecialization}}
    </h1>
    <div mat-dialog-content>
      <mat-form-field>
        <input matInput placeholder="Imię" [(ngModel)]="data.name" [disabled]='true'>
      </mat-form-field>    
      <br>
      <mat-form-field>
        <input matInput placeholder="Nazwisko" [(ngModel)]="data.surname" [disabled]='true'>
      </mat-form-field>    
      <br>
      <mat-form-field>
        <input matInput placeholder="Notatka" [(ngModel)]="data.note">
      </mat-form-field>    
    </div>

    <div mat-dialog-actions align="center">
      <button mat-button (click)="backClick()">Powrót</button>
      <button mat-button (click)="saveClick()" [mat-dialog-close]="data">Zapisz mnie na wizytę</button>
    </div>
  `,
  styles: [`
    h1 {
      text-align: center;
    }
  `]
})
export class VisitSignComponent {
  constructor(
    public dialogRef: MatDialogRef<VisitSignComponent>,
    private doctorService: DoctorService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: VisitData) { 
      const userInfo = JSON.parse(window.localStorage.getItem('userInfo') || '{}');
      this.data.name = userInfo.user.user.name;
      this.data.surname = userInfo.user.user.surname;
    }

  backClick() {
    this.dialogRef.close();
  }
  
  saveClick() {
    this.data.visitInfo.visit.isFree = false;
    this.data.visitInfo.visit.patientInfo.name = this.data.name;
    this.data.visitInfo.visit.patientInfo.surname = this.data.surname;
    this.data.visitInfo.visit.visitNote = this.data.note;
  }

}
