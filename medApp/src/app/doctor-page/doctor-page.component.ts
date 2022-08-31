import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Doctor } from '../models/doctor';
import { Schedule } from '../models/schedule';
import { DoctorService } from '../services/doctor.service';

@Component({
  selector: 'app-doctor-page',
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
        <span>Panel Lekarza</span>
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
        <button id ="editButton" mat-icon-button color="black" (click)="editSchedule(element)" (click)="updateDoctor()">
          <mat-icon>edit</mat-icon>
        </button>
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
  </div>

  `,
  styles: [`
    table {
      width: 100%;
    }

    #schedulesList{
      display: flex;
      align-items: center;
    }

    .mat-column-buttons {
      text-align: right;
    }

  `]
})
export class DoctorPageComponent implements OnInit {
  ngOnInit(): void { 
    this.updateDoctor();
  }

  schedules = new MatTableDataSource<Schedule>();
  displayedColumns: String[] = ['date', 'hour', 'visitTime', 'buttons']

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.schedules.paginator = this.paginator;
  }

  doctorId: String;
  doctor?: Doctor;

  constructor(private doctorService: DoctorService) { 
    const userInfo = JSON.parse(window.localStorage.getItem('userInfo') || '{}');
    this.doctorId = userInfo.user.user._id;
    this.updateDoctor();
  }

  updateDoctor() {
    this.doctorService.getDoctorByUserId(this.doctorId).subscribe( (response: Doctor) => {
      this.doctor = response;
      this.schedules.data = this.doctor.schedule;
    })
  }

  removeSchedule(schedule: Schedule) {

  }

  editSchedule(schedule: Schedule) {

  }

  click() { }

  onRemove(e: Event) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }

}
