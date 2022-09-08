import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { Doctor } from '../models/doctor';
import { Visit } from '../models/schedule';
import { DoctorService } from '../services/doctor.service';
import { EditVisitDialog } from './edit-visit-dialog.component';

export interface ScheduleData {
  schedule_id: string;
  doctor_id: string;
  patient_id: string;
  visit: Visit;
  newName: string;
  newSurname: string;
  newVisitNote: string;
  newIsFree: boolean;
}

@Component({
  selector: 'app-schedule-page',
  template: `
  <p>
    <mat-toolbar color="primary">
      <button mat-icon-button class="icon">
        <mat-icon>menu</mat-icon>
      </button>
      <button mat-icon-button class="icon" (click)="backToPreviousPage()">
        <mat-icon>exit_to_app</mat-icon>
      </button>
      Obsługa grafiku dr.&nbsp;<div *ngIf="doctor?.name">{{doctor.name}}</div> &nbsp; <div *ngIf="doctor?.name">{{doctor.surname}}</div> 
      &nbsp; <div *ngIf="scheduleToDisplay?.scheduleDate">[{{scheduleToDisplay?.scheduleDate | date:'yyyy-MM-dd':'+0000'}}]</div>
      <span class="spacer"></span>
    </mat-toolbar>
  </p>
  
  <div class="visitsList">
    <table mat-table [dataSource]="visitsList" class="mat-elevation-z8">
      <ng-container matColumnDef="time">
        <th mat-header-cell *matHeaderCellDef> Godzina </th>
        <td mat-cell *matCellDef="let element"> 
          {{ element.startHour | date:'HH:mm':'+0000'}} – {{element.finishHour | date:'HH:mm':'+0000'}}
        </td>
      </ng-container>

      <ng-container matColumnDef="isFree">
        <th mat-header-cell *matHeaderCellDef> Dostępność</th>
        <td mat-cell *matCellDef="let element">
          <span id="freeVisit" *ngIf="element.isFree">Wolne</span> <span id="occupiedVisit" *ngIf="!element.isFree">Zajęte</span>
        </td>
      </ng-container>

      <ng-container matColumnDef="patientName">
        <th mat-header-cell *matHeaderCellDef> Imię i nazwisko pacjenta </th>
        <td mat-cell *matCellDef="let element"> 
          <span *ngIf="element.patientInfo.name && element.patientInfo.surname"> {{element.patientInfo.name}} {{element.patientInfo.surname}}</span> 
        </td>
      </ng-container>


      <ng-container matColumnDef="note">
        <th mat-header-cell *matHeaderCellDef> Notatka do wizyty </th>
        <td mat-cell *matCellDef="let element"> {{element.visitNote}} </td>
      </ng-container>

      <ng-container matColumnDef="buttons">
        <th mat-header-cell *matHeaderCellDef>  </th>
        <td mat-cell *matCellDef="let element"> 
          <button id ="editButton" mat-icon-button color="black" (click)="openEditVisitDialog(element)">
            <mat-icon>edit</mat-icon>
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
    .custom-scroll-bar {
      height:50vh;
      overflow-y: scroll;
      overflow-x: hidden;
    }

    #freeVisit {
      color: green;
    }

    #occupiedVisit {
      color: red;
    }

    .mat-toolbar.mat-primary {
      background-color: rgb(143, 68, 2);
    }
  `]
})

export class SchedulePageComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  schedule_id: string;
  doctor_id: string;
  doctor: Doctor;
  scheduleToDisplay: any;
  visitsList = new MatTableDataSource<Visit>();
  displayedColumns: string[] = ['time', 'isFree', 'patientName', 'note', 'buttons']
  backRoute: string = '';
  subscription$: Subscription = new Subscription;
  interval$!: any;

  constructor(
    private router: Router,
    private actRoute: ActivatedRoute,
    private doctorService: DoctorService,
    public dialog: MatDialog,
  ) {
    if (this.router.url.includes('/schedulePage/doctor'))
      this.backRoute = '/doctorPage'
    else if (this.router.url.includes('/schedulePage/admin'))
      this.backRoute = '/adminPage'
    this.schedule_id = this.actRoute.snapshot.params['schId'];
    this.doctor_id = this.actRoute.snapshot.params['docId'];
    this.doctor = { _id: '', name: '', surname: '', city: '', specializations: [], schedule: [] }
  }

  ngOnInit(): void {
    this.interval$ = setInterval(() => {
      this.updateDoctor();
    }, 500);
    this.subscription$ = this.interval$;
  }

  ngOnDestroy(): void {
    clearInterval(this.interval$);
    this.subscription$.unsubscribe;
  }

  ngAfterViewInit(): void {
    this.visitsList.paginator = this.paginator;
  }

  openEditVisitDialog(visit: Visit): void {
    const dialogRef = this.dialog.open(EditVisitDialog, {
      width: '500px',
      height: '450px',
      autoFocus: false,
      data: {
        schedule_id: this.schedule_id, doctor_id: this.doctor_id,
        visit: visit, newName: '', newSurname: '',
        newVisitNote: '', newIsFree: false
      }
    });

    dialogRef.afterClosed().pipe(
      switchMap(
        (result) => this.doctorService.editVisit(result.visit, result.doctor_id, result.schedule_id, result.visit._id, '')
      )
    ).subscribe(() => { })
  }

  updateDoctor(): void {
    this.doctorService.getDoctor(this.doctor_id).subscribe((doctor: Doctor) => {
      if (JSON.stringify(this.doctor) !== JSON.stringify(doctor)) {
        this.doctor = doctor;
        this.getSchedule();
      }
    })
  }

  getSchedule(): void {
    this.scheduleToDisplay = this.doctor.schedule.find(i => i._id === this.schedule_id);
    this.visitsList.data = this.scheduleToDisplay.visits;
  }

  backToPreviousPage(): void {
    this.router.navigate([this.backRoute]);
  }
}
