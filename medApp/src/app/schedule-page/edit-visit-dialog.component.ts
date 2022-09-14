import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ScheduleData } from "./schedule-page.component";

@Component({
  selector: 'app-edit-visit-dialog',
  template: `
    <h1 mat-dialog-title>Edytujesz Dane wizyty {{data.visit.startHour | date:'HH:mm':'+0000'}} — {{data.visit.finishHour | date:'HH:mm':'+0000'}}<br></h1>
    <form [formGroup]="editVisitForm">
      <mat-form-field>
        <input matInput placeholder="Imię" formControlName="name">
      </mat-form-field>    
      <br>
      <mat-form-field>
        <input matInput placeholder="Nazwisko" formControlName="surname">
      </mat-form-field>    
      <br>
      <mat-form-field>
        <input matInput placeholder="Notatka" formControlName="note">
      </mat-form-field>  
    </form>  
    <label id="is-free-radio-button">Czy termin zajęty:</label>
    <mat-radio-group class="radio-group" [(ngModel)]="data.newIsFree">
      <mat-radio-button class="radio-button" [value]=true color="primary">Wolny</mat-radio-button>
      <br>
      <mat-radio-button class="radio-button" [value]=false color="primary">Zajęty</mat-radio-button>
    </mat-radio-group>
    <div mat-dialog-actions align="center">
      <button mat-button (click)="closeDialogRef()">Powrót</button>
      <button mat-button (click)="saveClick()" [mat-dialog-close]="data" [disabled]="editVisitValidator(editVisitForm)">Zapisz</button>
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

export class EditVisitDialogComponent {
  editVisitForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    surname: new FormControl(''),
    note: new FormControl(''),
  });

  constructor(
    public dialogRef: MatDialogRef<EditVisitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ScheduleData) { }


  editVisitValidator(formGroup: FormGroup): boolean {
    const name = formGroup.controls['name']?.value;
    const surname = formGroup.controls['surname']?.value;

    if (this.data.newIsFree || (!this.data.newIsFree && name && surname)) {
      return false
    }
    else {
      return true;
    }
  }

  saveClick(): void {
    this.data.visit.isFree = this.data.newIsFree;
    this.data.visit.visitNote = this.editVisitForm.get('note')?.value;
    this.data.visit.patientInfo = { name: this.editVisitForm.get('name')?.value, surname: this.editVisitForm.get('surname')?.value }
  }

  closeDialogRef(): void {
    this.dialogRef.close();
  }
}
