import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, switchMap } from 'rxjs';
import { DoctorI } from '@shared/doctor';
import { ScheduleI } from '@shared/schedule';
import { DoctorService } from '../services/doctor.service';
import { ScheduleAddDialogComponent } from './schedule-add-dialog.component';

export interface DoctorData {
  doctor: DoctorI;
  newSchedule: ScheduleI[];
  newVisitTime: number;
  newStartDate: Date;
  newFinishDate: Date;
}

@Component({
  selector: 'app-doctor-page',
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
        <span>Panel Lekarza - dr. {{doctor.name}} {{doctor.surname}}</span>
        <span class="spacer"></span>
        <button mat-raised-button color="newScheduleButton" (click)="openAddSheduleDialog()">Dodaj Grafik</button>
      </mat-toolbar>
    </p>

    <div class="schedulesList">
    <table mat-table [dataSource]="schedules" class="mat-elevation-z8">

      <ng-container matColumnDef="date">
        <th mat-header-cell *matHeaderCellDef> Dzień </th>
        <td mat-cell *matCellDef="let element"> {{element.scheduleDate | date:'yyyy-MM-dd':'+0000'}}</td>
      </ng-container>

      <ng-container matColumnDef="hour">
        <th mat-header-cell *matHeaderCellDef> Godzina </th>
        <td mat-cell *matCellDef="let element"> {{element.scheduleDate | date:'HH:mm':'+0000'}} – {{ element.finishHour | date:'HH:mm':'+0000'}} </td>
      </ng-container>

      <ng-container matColumnDef="visitTime">
        <th mat-header-cell *matHeaderCellDef> Czas pojedynczej wizyty </th>
        <td mat-cell *matCellDef="let element"> {{element.singleVisitTime}} min</td>
      </ng-container>

      <ng-container matColumnDef="buttons" id="buttons">
        <th mat-header-cell *matHeaderCellDef>  </th>
        <td mat-cell *matCellDef="let element"> 
        <a [routerLink]="['/schedulePage/doctor/', doctor._id, element._id]">
          <button id ="editButton" mat-icon-button color="black">
            <mat-icon>edit</mat-icon>
          </button>
        </a>
        <button id = "deleteButton" mat-icon-button color="warn" (click)="removeSchedule(element)" (click)="onRemove($event)">
          <mat-icon>remove_circle</mat-icon>
        </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>

    <mat-paginator [pageSizeOptions]="[5, 10, 20]"
                 showFirstLastButtons >
    </mat-paginator>
  `,
  styles: [`
    #schedulesList{
      display: flex;
      align-items: center;
    }

    .mat-newScheduleButton {
      background-color: rgb(255, 255, 255);
      color: black;
    }

    .mat-newScheduleButton:hover {
      background-color: rgb(35, 47, 92);
      color: white;
    }
  `]
})

export class DoctorPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  schedules = new MatTableDataSource<ScheduleI>();
  displayedColumns: string[] = ['date', 'hour', 'visitTime', 'buttons']
  doctorId: string;
  doctor = {} as DoctorI;
  subscription$: Subscription = new Subscription;
  interval$!: any;

  constructor(private doctorService: DoctorService, public dialog: MatDialog) {
    const userInfo = JSON.parse(window.localStorage.getItem('userInfo') || '{}');
    this.doctorId = userInfo.user.user._id;
  }

  ngOnInit(): void {
    this.updateDoctor();
    this.interval$ = setInterval(() => {
      this.updateDoctor();
    }, 250);
    this.subscription$ = this.interval$;
  }

  ngAfterViewInit(): void {
    this.schedules.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    clearInterval(this.interval$);
    this.subscription$.unsubscribe;
  }

  openAddSheduleDialog(): void {
    const dialogRef = this.dialog.open(ScheduleAddDialogComponent, {
      width: '400px',
      height: '350px',
      autoFocus: false,
      data: { doctor: this.doctor, newSchedule: this.schedules.data, newStartDate: new Date(), newFinishDate: new Date(), newVisitTime: 0 }
    });

    dialogRef.afterClosed().pipe(
      switchMap(
        () => this.doctorService.getDoctorByUserId(this.doctorId)),
    ).subscribe(() => { })

  }

  updateDoctor(): void {
    this.doctorService.getDoctorByUserId(this.doctorId).subscribe((updatedDoctor: DoctorI) => {
      if (JSON.stringify(updatedDoctor) !== JSON.stringify(this.doctor)) {
        this.doctor = updatedDoctor;
        this.schedules.data = this.doctor.schedule;
      }
    })
  }

  removeSchedule(schedule: ScheduleI): void {
    const index = this.schedules.data.indexOf(schedule);
    this.schedules.data.splice(index, 1);
    this.doctor.schedule = this.schedules.data;

    this.doctorService.editDoctor(this.doctor).pipe(
      switchMap(
        () => this.doctorService.getDoctorByUserId(this.doctorId)),
    ).subscribe(() => { })

  }

  onRemove(e: Event): void {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
}
