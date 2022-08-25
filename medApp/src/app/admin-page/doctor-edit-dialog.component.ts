import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DoctorData } from "./admin-page.component";

// CR-KR
// Tutaj fajnie że używasz gotowych kontrolek materialowych do inputów :)
// ale no właśnie, tutaj nie są to nawet takie typowo zrobione formularze angularowe
// angular umożliwia dwa podejścia jak można pisać formularze (z walidacją i wszystkim)
// 1. Template-driven forms https://angular.io/guide/forms
// 2. Reactive forms https://angular.io/guide/reactive-forms
// gorąco zachęcam żeby się zapoznać z tymi podejściami i wypróbować w praktyce oba
// dodając też do formularzy jakąś nawet najprostszą walidację pól
// typu pole wymagane, albo pole nie może zawierać cyfr :)
// zdecydowanie to jest coś co się przydaje w przyszłości 

// Edit :) faktycznie w kodzie znalazłam użycie reactive-forms
// ale jest kompletnie bez walidacji pól, więc nie wykorzystujesz tam potencjału tego mechanizmu

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
        <mat-selection-list #doctor [multiple]="false" class="custom-scroll-bar"> 
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
            <button mat-raised-button color="editDoctorButton" (click)="addNewSpec()">Dodaj specjalizację</button>
          </div>
        </div>

        <div mat-dialog-actions align="center">
            <button mat-button (click)="backClick()">Powrót</button>
            <button mat-button (click)="saveClick()" [mat-dialog-close]="data.doctor">Zapisz</button>
        </div>
    `,
    styles: [`
        h1{
          text-align: center;
        }

        .custom-scroll-bar{
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

  backClick(): void {
    this.dialogRef.close();
  }

  saveClick(): void {
    this.data.doctor.name = this.data.newName;
    this.data.doctor.surname = this.data.newSurname;
    this.data.doctor.city = this.data.newCity;
    this.data.doctor.specializations = this.data.newSpecializations;
  }

  onRemove(e: Event) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  removeSpecialization(specialization: string) {
    const index = this.data.newSpecializations.indexOf(specialization);
    this.data.newSpecializations.splice(index, 1);                              
  }

  addNewSpec() {
    if (this.data.newSpec !== ''){
      this.data.newSpecializations.push(this.data.newSpec);
      this.data.newSpec = '';
    }
  }
}
