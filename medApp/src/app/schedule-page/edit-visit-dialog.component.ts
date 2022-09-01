import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ScheduleData } from "./schedule-page.component";

@Component({
  selector: 'edit-visit-dialog',
  template: `
    <h1 mat-dialog-title>Edytujesz Dane wizyty {{data.visit.startHour | date:'HH:mm':'+0000'}} — {{data.visit.finishHour | date:'HH:mm':'+0000'}}<br></h1>
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
        <input matInput placeholder="Notatka" [(ngModel)]="data.newVisitNote">
      </mat-form-field>    
    </div>
    <label id="is-free-radio-button">Czy termin zajęty:</label>
    <mat-radio-group class="radio-group" [(ngModel)]="data.newIsFree">
      <mat-radio-button class="radio-button" [value]=true color="primary">Wolny</mat-radio-button>
      <br>
      <mat-radio-button class="radio-button" [value]=false color="primary">Zajęty</mat-radio-button>
    </mat-radio-group>
    <div mat-dialog-actions align="center">
      <button mat-button (click)="closeDialogRef()">Powrót</button>
      <button mat-button (click)="saveClick()" [mat-dialog-close]="data">Zapisz</button>
    </div>
  `,
  styles: [`
    h1 {
      text-align: center;
    }
    .radio-group {
      display: flex;
      flex-direction: column;
      margin: 15px 0;
      align-items: flex-start;
    }
  
    .radio-button {
      margin: 5px;
    }
  `]
})

export class EditVisitDialog {
  constructor(
    public dialogRef: MatDialogRef<EditVisitDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ScheduleData) { }

  saveClick(): void {
    this.data.visit.isFree = this.data.newIsFree;
    this.data.visit.visitNote = this.data.newVisitNote;
    this.data.visit.patientInfo = { name: this.data.newName, surname: this.data.newSurname }
  }

  closeDialogRef(): void {
    this.dialogRef.close();
  }
}
