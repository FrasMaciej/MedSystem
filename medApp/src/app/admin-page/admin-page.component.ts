import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, switchMap } from 'rxjs';
import { Doctor } from '../models/doctor';
import { Schedule } from '../models/schedule';
import { DoctorService } from '../services/doctor.service';
import { DoctorAddDialog } from './doctor-add-dialog.component';
import { DoctorEditDialog } from './doctor-edit-dialog.component';
import { SchedulesDialog } from './schedules-dialog.component';

export interface DoctorData {
  doctor: Doctor;
  newName: string;
  newSurname: string;
  newCity: string;
  newSpecializations: string[];
  newSpec: string;
  newSchedule: Schedule[];
  newVisitTime: number;
  newStartDate: Date;
  newFinishDate: Date;
}

@Component({
  selector: 'app-admin-page',
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
        <span>Panel Administratora</span>
        <span class="spacer"></span>
        <button mat-raised-button color="newDoctorButton" (click)="openAddDoctorDialog()">Dodaj lekarza</button>
      </mat-toolbar>
    </p>

    <div class="doctorsList">
      <table mat-table [dataSource]="doctors" class="mat-elevation-z8">

        <ng-container matColumnDef="city">
          <th mat-header-cell *matHeaderCellDef> Miasto </th>
          <td mat-cell *matCellDef="let element"> {{element.city}}</td>
        </ng-container>

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef> Imię i nazwisko lekarza </th>
          <td mat-cell *matCellDef="let element"> {{element.name}} {{element.surname}}</td>
        </ng-container>

        <ng-container matColumnDef="specs">
          <th mat-header-cell *matHeaderCellDef> Specjalizacje </th>
          <td mat-cell *matCellDef="let element"> 
            <span *ngFor="let spec of element.specializations">
              {{spec}}, 
            </span>
          </td>
        </ng-container>

        <ng-container matColumnDef="buttons" id="buttons">
          <th mat-header-cell *matHeaderCellDef>  </th>
          <td mat-cell *matCellDef="let element"> 
          <button id = "deleteButton" mat-icon-button color="warn" (click)="removeDoctor(element)" (click)="onRemove($event)">
            <mat-icon>remove_circle</mat-icon>
          </button>
          <button id ="editButton" mat-icon-button color="black" (click)="openEditDoctorDialog(element)">
            <mat-icon>edit</mat-icon>
          </button>
          <button id ="editSchedule" mat-icon-button color="black" (click)="openSchedulesDialog(element)">
            <mat-icon>schedule</mat-icon>
          </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    <mat-paginator [pageSizeOptions]="[10, 20]"
                 showFirstLastButtons >
    </mat-paginator>
  </div>
  `,
  styles: [`
    #doctorsString{
      margin: 1%;
    }

    #doctorsList{
      display: flex;
      align-items: center;
    }

    .mat-newDoctorButton {
      background-color: rgb(255, 255, 255);
      color: black;
    }

    .mat-newDoctorButton:hover {
      background-color: rgb(72, 0, 0);
      color: white;
    }
    
    .mat-toolbar.mat-primary {
      background-color: rgb(143, 68, 2);
    }
  `]
})

export class AdminPageComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  doctors = new MatTableDataSource<Doctor>();
  displayedColumns: string[] = ['city', 'name', 'specs', 'buttons'];
  subscription: Subscription = new Subscription;
  interval!: any;

  constructor(private doctorService: DoctorService, public dialog: MatDialog) { }
  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.updateDoctors();
    }, 500);
    this.subscription = this.interval;
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.subscription.unsubscribe;
  }

  ngAfterViewInit(): void {
    this.doctors.paginator = this.paginator;
  }

  openAddDoctorDialog(): void {
    const dialogRef = this.dialog.open(DoctorAddDialog, {
      width: '500px',
      height: '325px',
      autoFocus: false,
      data: { newName: '', newSurname: '', newCity: '', doctor: {} }
    });

    dialogRef.afterClosed().pipe(
      switchMap(
        (newDoctor) => this.doctorService.addDoctor(newDoctor)),
    ).subscribe(() => { })

  }

  openEditDoctorDialog(doctor: Doctor): void {
    const dialogRef = this.dialog.open(DoctorEditDialog, {
      width: '500px',
      height: '600px',
      autoFocus: false,
      data: {
        doctor: doctor, newName: doctor.name, newSurname: doctor.surname, newCity: doctor.city,
        newSpecializations: doctor.specializations, newSchedule: doctor.schedule
      }
    });

    dialogRef.afterClosed().pipe(
      switchMap(
        (updatedDoctor) => this.doctorService.editDoctor(updatedDoctor)),
      switchMap(
        () => this.doctorService.getDoctors())
    ).subscribe(() => { })
  }

  openSchedulesDialog(doctor: Doctor): void {
    const dialogRef = this.dialog.open(SchedulesDialog, {
      width: '600px',
      height: '700px',
      autoFocus: false,
      data: { doctor: doctor, newSchedule: doctor.schedule, newStartDate: new Date(), newFinishDate: new Date(), newVisitTime: 0 }
    });

    dialogRef.afterClosed().pipe(
      switchMap(
        () => this.doctorService.getDoctors())
    ).subscribe(() => { })

  }

  updateDoctors(): void {
    this.doctorService.getDoctors().subscribe((doctors: Doctor[]) => {
      if (JSON.stringify(this.doctors.data) !== JSON.stringify(doctors)) {
        this.doctors.data = doctors;
      }
    })
  }

  removeDoctor(doctor: Doctor): void {
    this.doctorService.removeDoctor(doctor).subscribe(() => { })
  }

  onRemove(e: Event): void {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
}
