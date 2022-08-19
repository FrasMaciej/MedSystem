import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Doctor } from '../models/doctor';
import { Patient, Schedule } from '../models/schedule';
import { Visit } from '../models/schedule';
import { DoctorService } from '../services/doctor.service';
import { EditVisitDialog } from './edit-visit-dialog.component';

export interface ScheduleData {
  schedule_id: string;
  doctor_id: string;
  visit: Visit;
  newName: String;
  newSurname: String;
  newVisitNote: String;
  newIsFree: Boolean;
}

@Component({
  selector: 'app-schedule-page',
  template: `
  <p>
    <mat-toolbar color="primary">
      <button mat-icon-button class="icon">
        <mat-icon>menu</mat-icon>
      </button>
      <a [routerLink]="['/adminPage']">
        <button mat-icon-button class="icon">
          <mat-icon>exit_to_app</mat-icon>
        </button>
      </a>
      Panel Administratora - obsługa grafiku dr.&nbsp;<div *ngIf="doctor?.name">{{doctor.name}}</div> &nbsp; <div *ngIf="doctor?.name">{{doctor.surname}}</div> 
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

    table {
      width: 100%;
    }

    .mat-column-buttons {
      text-align: right;
    }

  `]
})
export class SchedulePageComponent implements OnInit {
  schedule_id: string;
  doctor_id: string;
  doctor: Doctor;
  scheduleToDisplay: any;
  visitsList= new MatTableDataSource<Visit>();
  displayedColumns: String[] = ['time', 'isFree', 'patientName', 'note', 'buttons']


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.visitsList.paginator = this.paginator;
  }
  
  constructor(
    private actRoute: ActivatedRoute,
    private doctorService: DoctorService,
    public dialog: MatDialog
  ) { 
    this.schedule_id = this.actRoute.snapshot.params['schId'];
    this.doctor_id = this.actRoute.snapshot.params['docId'];
    this.doctor = {_id: '', name: '', surname: '', city: '', specializations: [], schedule: []}
  }

  openEditVisitDialog(visit: Visit): void {
    const dialogRef = this.dialog.open(EditVisitDialog, {
      width: '500px',
      height: '450px',
      autoFocus: false,
      data: {schedule_id: this.schedule_id, doctor_id: this.doctor_id,
        visit: visit, newName: '', newSurname: '', 
        newVisitNote: '', newIsFree: false}
    });

    dialogRef.afterClosed().subscribe( result => {
      if(result!==null){
        this.doctorService.editVisit(result.visit, result.doctor_id, result.schedule_id, result.visit._id).subscribe(() => {
          this.updateDoctor();
        })
      }
    });

  }

  ngOnInit(): void {
    this.doctor = {} as Doctor;
    this.scheduleToDisplay = {} as Schedule;
    this.visitsList.data = this.scheduleToDisplay.visits;
    this.updateDoctor();
  }

  updateDoctor(): void {
    this.doctorService.getDoctor(this.doctor_id).subscribe((doctor: Doctor) => {
      this.doctor = doctor;
      this.getSchedule();
    })
  }

  getSchedule(): Schedule {
    this.scheduleToDisplay = this.doctor.schedule.find(i => i._id === this.schedule_id);
    this.visitsList.data = this.scheduleToDisplay.visits;
    return this.scheduleToDisplay;
  }

}
