import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DoctorData } from "./admin-page.component";

@Component({
  selector: 'doctor-edit-dialog',
  template: `
    <h1 mat-dialog-title>Edytujesz dane lekarza: <br> {{data.doctor.name}} {{data.doctor.surname}}</h1>
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

    <div class="specializations">Specjalizacje</div>
    <mat-selection-list #doctor [multiple]="false" class="scroll-bar"> 
      <mat-list-option *ngFor="let specialization of data.doctor.specializations">
        <div id="specializationsList">
        <button id = "deleteButton" mat-icon-button color="warn" (click)="removeSpecialization(specialization)" (click)="onRemove($event)">
          <mat-icon>remove_circle</mat-icon>
        </button>
        {{ specialization }}
        </div>
      </mat-list-option>
    </mat-selection-list>

    <div class="addNewSpecialization" align="center">
      <div class = "specFormElem">
        <mat-form-field appearance="fill">
          <mat-label>Specjalizacja</mat-label>
          <input matInput [(ngModel)]="data.newSpec">
        </mat-form-field>
      </div>
      <div class = "specFormElem">
        <button mat-raised-button color="editDoctorButton" (click)="addSpecialization()">Dodaj specjalizację</button>
      </div>
    </div>

    <div mat-dialog-actions align="center">
      <button mat-button (click)="closeDialogRef()">Powrót</button>
      <button mat-button (click)="saveClick()" [mat-dialog-close]="data.doctor">Zapisz</button>
    </div>
  `,
  styles: [`
      h1{
        text-align: center;
      }

      .scroll-bar{
        height:15vh;
        overflow-x: hidden;
      }

      .addNewSpecialization {
        text: center;
      }

      .specializations{
        text-align: center;
      }

      #specializationsList{
        display: flex;
        align-items: center;
      }

      .mat-editDoctorButton {
        background-color: rgb(21, 190, 41);
        height: 52px;
        color: #fff;
      }
      
      .addNewSpecialization {
        margin-top: 15px;
        display:flex;
        flex-direction: row;
        justify-content: center;
        border-bottom: 1px solid grey;
        border-bottom-color: #C45506;
      }

      .specFormElem {
        margin: 5px;
      }
  `]
})

export class DoctorEditDialog {
  constructor(
    public dialogRef: MatDialogRef<DoctorEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DoctorData) { }

  addSpecialization(): void {
    if (this.data.newSpec !== '') {
      this.data.newSpecializations.push(this.data.newSpec);
      this.data.newSpec = '';
    }
  }

  removeSpecialization(specialization: String): void {
    const index = this.data.newSpecializations.indexOf(specialization);
    this.data.newSpecializations.splice(index, 1);
  }

  saveClick(): void {
    this.data.doctor.name = this.data.newName;
    this.data.doctor.surname = this.data.newSurname;
    this.data.doctor.city = this.data.newCity;
    this.data.doctor.specializations = this.data.newSpecializations;
  }

  onRemove(e: Event): void {
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  closeDialogRef(): void {
    this.dialogRef.close();
  }
}
