import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Doctor } from "../models/doctor";
import { Schedule } from "../models/schedule";
import { DoctorService } from "../services/doctor.service";
import { DoctorData } from "./doctor-page.component";

@Component({
    selector: 'schedule-add-dialog',
    template: `
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
        <button mat-button (click)="closeDialogRef()">Powrót</button>
    </div>
    `,
    styles: [`
        h1{
            text-align: center;
        }
    `]
  })
export class ScheduleAddDialog {
    constructor(
        public dialogRef: MatDialogRef<ScheduleAddDialog>,
        private doctorService: DoctorService,
        @Inject(MAT_DIALOG_DATA) public data: DoctorData) { }  

    closeDialogRef() {
        this.dialogRef.close();
    }  

    addNewSchedule() {
        var startDate: Date = new Date(this.data.newStartDate);
        var finishDate: Date = new Date(this.data.newFinishDate);
        this.data.newStartDate = new Date(startDate.setHours(startDate.getHours() - (startDate.getUTCHours() - startDate.getHours())));
        this.data.newFinishDate = new Date(finishDate.setHours(finishDate.getHours() - (finishDate.getUTCHours() - finishDate.getHours())));
        const schedule: Schedule = {
            scheduleDate: this.data.newStartDate, finishHour: this.data.newFinishDate, 
            singleVisitTime: this.data.newVisitTime, _id: '', visits: []
        };
        this.doctorService.addTerminsSlots(schedule, this.data.doctor).subscribe((doctor: Doctor) => {
          this.data.doctor = doctor;
        })
        this.data.newSchedule.push(schedule);
        this.closeDialogRef();
      }
}