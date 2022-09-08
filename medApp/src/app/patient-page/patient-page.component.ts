import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, switchMap } from 'rxjs';
import { VisitInfo } from '../models/schedule';
import { DoctorService } from '../services/doctor.service';
import { VisitSignComponent } from './visit-sign.component';

export interface VisitData {
  visitInfo: VisitInfo;
  note: string;
  name: string;
  surname: string;
  patientId: string;
}

@Component({
  selector: 'app-patient-page',
  template: `
    <p>
      <mat-toolbar color="primary">
        <button mat-icon-button class="icon">
          <mat-icon>menu</mat-icon>
        </button>
        <a [routerLink]="['/']">
          <button mat-icon-button class="icon">
            <mat-icon>exit_to_app</mat-icon>
          </button>
        </a>
        <span>Panel Pacjenta</span>
        <span class="spacer"></span>
        <a [routerLink]="['/patientPage/details']">
          <button mat-raised-button color="patientDetails">Moje Wizyty</button>
        </a>
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

  <div class="visitsList">
    <table mat-table [dataSource]="selectedVisits" class="mat-elevation-z8">
      <ng-container matColumnDef="city">
        <th mat-header-cell *matHeaderCellDef> Miasto </th>
        <td mat-cell *matCellDef="let element"> {{element.docCity}}</td>
      </ng-container>

      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef> Imię i nazwisko lekarza</th>
        <td mat-cell *matCellDef="let element"> {{element.docName}} {{element.docSurname}}</td>
      </ng-container>

      <ng-container matColumnDef="spec">
        <th mat-header-cell *matHeaderCellDef> Specjalizacja </th>
        <td mat-cell *matCellDef="let element"> {{element.docSpecialization}} </td>
      </ng-container>

      <ng-container matColumnDef="visitDate">
        <th mat-header-cell *matHeaderCellDef> Data wizyty </th>
        <td mat-cell *matCellDef="let element"> {{element.visit.startHour | date:'yyyy-MM-dd HH:mm':'+0000' }} — {{element.visit.finishHour | date:'HH:mm':'+0000' }}</td>
      </ng-container>

      <ng-container matColumnDef="buttons">
        <th mat-header-cell *matHeaderCellDef>  </th>
        <td mat-cell *matCellDef="let element">
          <button id ="editButton" mat-icon-button color="black" (click)="openVisitSignDialog(element)">
            <mat-icon>assignment icon</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>

    <mat-paginator [pageSizeOptions]="[10, 20]" showFirstLastButtons>
    </mat-paginator>
  </div>
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
      width: 120px;
      height: 52px;
      background-color: white;
      color: black;
      border: 2px solid black;
      border-color: rgb(170, 62, 198);
    }

    .mat-searchButton:hover {
      background-color: rgb(170, 62, 198);
      color: #fff;
    }

    .mat-patientDetails {
      background-color: rgb(170, 62, 198);
      color: white;
    }

    .mat-patientDetails:hover {
      background-color: white;
      color: black;
    }
  `]
})

export class PatientPageComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  citiesList: string[] = [];
  specsList: string[] = [];
  selectedCities = new FormControl(this.citiesList);
  selectedSpec: string = this.specsList[0];
  range = new FormGroup({
    start: new FormControl<Date>(new Date()),
    end: new FormControl<Date>(new Date())
  })
  selectedVisits = new MatTableDataSource<VisitInfo>();
  displayedColumns: string[] = ['city', 'name', 'spec', 'visitDate', 'buttons']
  subscription$: Subscription = new Subscription;
  interval$!: any;

  constructor(
    private doctorService: DoctorService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.interval$ = setInterval(() => {
      this.updateMenuData();
    }, 500);
    this.subscription$ = this.interval$;
  }

  ngOnDestroy(): void {
    clearInterval(this.interval$);
    this.subscription$.unsubscribe;
  }

  ngAfterViewInit(): void {
    this.selectedVisits.paginator = this.paginator;
  }

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

    dialogRef.afterClosed().pipe(
      switchMap(
        (result) => this.doctorService.editVisit(result.visitInfo.visit, result.visitInfo.doctorId, result.visitInfo.scheduleId, result.visitInfo.visit._id, result.patientId)),
      switchMap(
        () => this.doctorService.getFilteredVisits(this.selectedSpec, this.selectedCities.value as string[], this.range.value.start as Date, this.range.value.end as Date)
      )
    ).subscribe((matchingVisits: VisitInfo[]) => {
      this.selectedVisits.data = matchingVisits;
    })

  }

  selectSpec(event: Event): void {
    this.selectedSpec = (event.target as HTMLSelectElement).value;
  }

  getFilteredVisits(): void {
    if (this.selectedSpec && this.selectedCities.value && this.range.value.start && this.range.value.end) {
      const cities: string[] = this.selectedCities.value;
      this.doctorService.getFilteredVisits(this.selectedSpec, this.selectedCities.value, this.range.value.start, this.range.value.end).subscribe((matchingVisits: VisitInfo[]) => {
        this.selectedVisits.data = matchingVisits;
      })
    }
  }

  updateMenuData(): void {
    this.doctorService.getCities().subscribe((cities: string[]) => {
      if (JSON.stringify(this.citiesList) !== JSON.stringify(cities)) {
        this.citiesList = cities;
      }
    })
    this.doctorService.getSpecs().subscribe((specs: string[]) => {
      if (JSON.stringify(this.specsList) !== JSON.stringify(specs)) {
        this.specsList = specs;
      }
    })
  }
}
