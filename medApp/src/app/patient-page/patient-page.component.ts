import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Doctor } from '../models/doctor';
import { Visit, VisitInfo } from '../models/schedule';
import { DoctorService } from '../services/doctor.service';
import { VisitSignComponent } from './visit-sign.component';

export interface VisitData {
  visitInfo: VisitInfo;
  note: String;
  name: String;
  surname: String;
}

@Component({
  selector: 'app-patient-page',
  template: `
    <p>
      <mat-toolbar color="primary">
        <button mat-icon-button class="icon" (click)="click()">
          <mat-icon>menu</mat-icon>
        </button>
        <a [routerLink]="['/']">
          <button mat-icon-button class="icon">
            <mat-icon>exit_to_app</mat-icon>
          </button>
        </a>
        <span>Panel Pacjenta</span>
      </mat-toolbar>
    </p>
    
    <div class="PatientSearchForm" >
      <div class="formElem">
        <mat-form-field appearance="fill">
          <mat-label>Miasta</mat-label>
          <mat-select [formControl]="selectedCities" multiple>
            <mat-select-trigger>
              {{selectedCities.value?.[0] || ''}}
              <span *ngIf="(selectedCities.value?.length || 0) > 1" class="additional-selection">
                (+{{(selectedCities.value?.length || 0) - 1}} {{selectedCities.value?.length === 2 ? 'other' : 'others'}})
              </span>
            </mat-select-trigger>
            <mat-option *ngFor="let city of citiesList" [value]="city">{{city}}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="formElem">
        <mat-form-field appearance="fill">
          <mat-label>Specjalizacja</mat-label>
          <mat-select [(value)]="selectedSpec">
            <mat-option></mat-option>
            <mat-option [value]="option" *ngFor="let option of specsList">{{ option }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="formElem">
        <mat-form-field appearance="fill">
          <mat-label>Przedział czasowy</mat-label>
          <mat-date-range-input [formGroup]="range" [rangePicker]="picker">
            <input matStartDate formControlName="start" placeholder="Start date">
            <input matEndDate formControlName="end" placeholder="End date">
          </mat-date-range-input>
          <mat-hint>MM/DD/YYYY – MM/DD/YYYY</mat-hint>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-date-range-picker #picker></mat-date-range-picker>

          <mat-error *ngIf="range.controls.start.hasError('matStartDateInvalid')">Invalid start date</mat-error>
          <mat-error *ngIf="range.controls.end.hasError('matEndDateInvalid')">Invalid end date</mat-error>
        </mat-form-field>
      </div>


      <div class="formElem">
        <button mat-raised-button color="searchButton" (click)="getFilteredVisits()">Wyszukaj</button>
      </div>
    </div>

  <table mat-table [dataSource]="selectedVisits" class="mat-elevation-z8">
    <!-- Position Column -->
    <ng-container matColumnDef="city">
      <th mat-header-cell *matHeaderCellDef> Miasto </th>
      <td mat-cell *matCellDef="let element"> {{element.docCity}}</td>
    </ng-container>

    <!-- Name Column -->
    <ng-container matColumnDef="name">
      <th mat-header-cell *matHeaderCellDef> Imię i nazwisko lekarza</th>
      <td mat-cell *matCellDef="let element"> {{element.docName}} {{element.docSurname}}</td>
    </ng-container>

    <!-- Weight Column -->
    <ng-container matColumnDef="spec">
      <th mat-header-cell *matHeaderCellDef> Specjalizacja </th>
      <td mat-cell *matCellDef="let element"> {{element.docSpecialization}} </td>
    </ng-container>

    <!-- Symbol Column -->
    <ng-container matColumnDef="visitDate">
      <th mat-header-cell *matHeaderCellDef> Data wizyty </th>
      <td mat-cell *matCellDef="let element"> {{element.visit.startHour | date:'yyyy-MM-dd HH:mm':'+0000' }} — {{element.visit.finishHour | date:'HH:mm':'+0000' }}
        <button id ="editButton" mat-icon-button color="black" (click)="openVisitSignDialog(element)">
            <mat-icon>assignment icon</mat-icon>
        </button>
      </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>

  `,
  styles: [`
    .mat-toolbar.mat-primary {
      background-color: rgb(71, 106, 141);
    }

    .additional-selection {
      opacity: 0.75;
      font-size: 0.75em;
    }

    .PatientSearchForm {
      display:flex;
      flex-direction: row;
      justify-content: center;
      border-bottom: 2px solid grey;
      border-bottom-color: #22788a;

    }

    .formElem {
      margin: 5px;
    }

    .mat-searchButton {
      background-color: rgb(170, 62, 198);
      width: 120px;
      height: 52px;
      color: #fff;
      
    }

    .custom-scroll-bar{
      height:60vh;
      overflow-y: scroll;
      overflow-x: hidden;
    }

    table {
      width: 100%;
    }

  `]
})

export class PatientPageComponent implements OnInit {
  citiesList: String[] = [];
  specsList: String[] = [];
  selectedCities = new FormControl(this.citiesList);
  selectedSpec: String = this.specsList[0];
  range = new FormGroup({
    start: new FormControl<Date>(new Date()),
    end: new FormControl<Date>(new Date())
  })
  selectedVisits: VisitInfo[] = [];
  displayedColumns: String[] = ['city', 'name', 'spec', 'visitDate']

  constructor(
    private doctorService: DoctorService,
    public dialog: MatDialog,
    ) { }

  openVisitSignDialog(visitInfo: VisitInfo): void {
    const dialogRef = this.dialog.open(VisitSignComponent, {
      width: '500px',
      height: '400px',
      autoFocus: false,
      data: {
        visitInfo: visitInfo, note: '',
        name: '', surname: ''
      }
    });

    dialogRef.afterClosed().subscribe( result => {
      if(result!==null){
        this.doctorService.editVisit(result.visitInfo.visit, result.visitInfo.doctorId, result.visitInfo.scheduleId, result.visitInfo.visit._id).subscribe(() => {
          this.getFilteredVisits();
        })
      }
    });
    
  }

  ngOnInit(): void {
    this.updateMenuData();
  }

  updateMenuData(): void {
    this.doctorService.getCities().subscribe((cities: String[]) => {
      this.citiesList = cities;
    })
    this.doctorService.getSpecs().subscribe((specs: String[]) => {
      this.specsList = specs;
    })
  }

  click(){
    console.log(this.selectedVisits);
  }

  selectSpec(event: Event) {
    this.selectedSpec = (event.target as HTMLSelectElement).value;
  }

  getFilteredVisits() {
    if(this.selectedSpec && this.selectedCities.value && this.range.value.start && this.range.value.end){
      const cities: String[] = this.selectedCities.value;
      this.doctorService.getFilteredVisits(this.selectedSpec, this.selectedCities.value, this.range.value.start, this.range.value.end).subscribe((visitInfo: VisitInfo[]) => {
        this.selectedVisits = visitInfo;
      })
    }
  }
  
}
