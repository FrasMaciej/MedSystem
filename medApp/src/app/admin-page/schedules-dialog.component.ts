import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Doctor } from "../models/doctor";
import { Schedule } from "../models/schedule";
import { DoctorService } from "../services/doctor.service";
import { DoctorData } from "./admin-page.component";

@Component({
    selector: 'schedules-dialog',
    template: `
        <div class="schedules"><h1>Grafiki dzienne - Dr. {{data.doctor.name}} {{data.doctor.surname}}</h1></div>
        <mat-selection-list #schedule [multiple]="false" class="custom-scroll-bar" underline="none"> 
            <mat-list-option *ngFor="let singleSchedule of data.doctor.schedule; let i = index" (click)="closeDialogRef()">
                <a [routerLink]="['schedulePage/', data.doctor._id, singleSchedule._id]">
                <div id="schedulesList">
                    <button id = "deleteButton" mat-icon-button color="warn" (click)="removeSchedule(singleSchedule)" (click)="onRemove($event)">
                        <mat-icon>remove_circle</mat-icon>
                    </button>{{singleSchedule.scheduleDate | date:'yyyy-MM-dd HH:mm':'+0000'}} – {{ singleSchedule.finishHour | date:'HH:mm':'+0000'}}
                </div>
                </a>
            </mat-list-option>
        </mat-selection-list>
        <div mat-dialog-content align="center">
            <mat-form-field>
                <input matInput type="datetime-local" placeholder="Data początkowa" [(ngModel)]="data.newStartDate">
            </mat-form-field>   
        <br>
            <mat-form-field>
                <input matInput type="datetime-local" placeholder="Data końcowa" [(ngModel)]="data.newFinishDate">
            </mat-form-field> 
        <br>
            <mat-form-field>
                <input matInput placeholder="Czas pojedynczej wizyty (w min)" [(ngModel)]="data.newVisitTime">
            </mat-form-field>   
        </div>
        <br>
        <div class="addNewSchedule" align="center">
            <button mat-raised-button color="addScheduleButton" (click)="addNewSchedule()">Dodaj grafik</button>
        </div>
        <br>
        <div mat-dialog-actions align="center">
            <button mat-button (click)="backClick()">Powrót</button>
        </div>
    `,
    styles: [`
        h1{
            text-align: center;
        }

        .custom-scroll-bar{
            height:35vh;
            overflow-x: hidden;
        }

        .schedules{
            text-align: center;
        }

        #specializationsList{
            display: flex;
            align-items: center;
        }

        .mat-editScheduleButton {
            background-color: rgb(21, 190, 41);
            color: #fff;
        }

        .content-wrapper .mat-selection-list-underline {
            display: none;
        }
    `]
  })
  export class SchedulesDialog {
    constructor(
      public dialogRef: MatDialogRef<SchedulesDialog>,
      private doctorService: DoctorService,
      @Inject(MAT_DIALOG_DATA) public data: DoctorData) {}
  
  
    backClick(): void {
      this.dialogRef.close();
    }
  
    saveClick(): void {
      this.data.doctor.schedule = this.data.newSchedule;
    }
  
    removeSchedule(schedule: Schedule): void {
      const index = this.data.newSchedule.indexOf(schedule);
      this.data.newSchedule.splice(index,1);   
      
      this.doctorService.editDoctor(this.data.doctor).subscribe( () => {
  
      });
    }
  
    onRemove(e: Event) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  
    closeDialogRef(){
      this.dialogRef.close();
    }
  
    addNewSchedule(){
      var startDate: Date = new Date(this.data.newStartDate);
      var finishDate: Date = new Date(this.data.newFinishDate);
      this.data.newStartDate = new Date(startDate.setHours(startDate.getHours() - (startDate.getUTCHours() - startDate.getHours())));
      this.data.newFinishDate = new Date(finishDate.setHours(finishDate.getHours() - (finishDate.getUTCHours() - finishDate.getHours())));
      const schedule = new Schedule(this.data.newStartDate, this.data.newFinishDate, this.data.newVisitTime);
      this.doctorService.addTerminsSlots(schedule, this.data.doctor).subscribe( (doctor: Doctor) => {
        this.data.doctor = doctor;
      })
      this.data.newSchedule.push(schedule);
    }
  }