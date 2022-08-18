import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
      &nbsp; <div *ngIf="selectedSchedule?.scheduleDate">[{{selectedSchedule?.scheduleDate | date:'yyyy-MM-dd':'+0000'}}]</div>
      <span class="spacer"></span>
    </mat-toolbar>
  </p>
  <mat-selection-list #schedule [multiple]="false" class="custom-scroll-bar"> 
    <ng-container *ngIf="selectedSchedule">
      <mat-list-option *ngFor="let visit of selectedSchedule.visits">
        <div id="visitsList">

          <button id ="editButton" mat-icon-button color="black" (click)="openEditVisitDialog(visit)">
            <mat-icon>edit</mat-icon>
          </button>

          {{ visit.startHour | date:'HH:mm':'+0000'}} – {{visit.finishHour | date:'HH:mm':'+0000'}}          
          <span id="freeVisit" *ngIf="visit.isFree">[Wolne]</span> <span id="occupiedVisit" *ngIf="!visit.isFree">[Zajęte]</span>
          <span *ngIf="visit.patientInfo.name"> [{{visit.patientInfo.name}} </span>
          <span *ngIf="visit.patientInfo.surname"> {{visit.patientInfo.surname}}] </span>
          <span *ngIf="visit.visitNote"> [{{visit.visitNote}}] </span>
          
        </div>
      </mat-list-option>
    </ng-container>
  </mat-selection-list>
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
  `]
})
export class SchedulePageComponent implements OnInit {
  schedule_id: string;
  doctor_id: string;
  doctor: Doctor;
  selectedSchedule: any;

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
    this.selectedSchedule = {} as Schedule;
    this.updateDoctor();
  }

  updateDoctor(): void {
    this.doctorService.getDoctor(this.doctor_id).subscribe((doctor: Doctor) => {
      this.doctor = doctor;
      this.getSchedule();
    })
  }

  getSchedule(): Schedule {
    this.selectedSchedule = this.doctor.schedule.find(i => i._id === this.schedule_id);
    return this.selectedSchedule;
  }

  openEditVistDialog(visit: Visit) {
 
  }

}
