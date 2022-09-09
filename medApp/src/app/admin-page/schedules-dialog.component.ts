import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DoctorI } from '@shared/doctor';
import { ScheduleI } from '@shared/schedule';
import { DoctorService } from "../services/doctor.service";
import { DoctorData } from "./admin-page.component";

@Component({
    selector: 'schedules-dialog',
    template: `
        <div class="schedules"><h1>Grafiki dzienne - Dr. {{data.doctor.name}} {{data.doctor.surname}}</h1></div>
        <mat-selection-list #schedule [multiple]="false" class="custom-scroll-bar" underline="none" > 
            <mat-list-option *ngFor="let singleSchedule of data.doctor.schedule; let i = index"  (click)="closeDialogRef()">
                <a [routerLink]="['schedulePage/admin/', data.doctor._id, singleSchedule._id]">
                    <div id="schedulesList" >
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
            <button mat-raised-button color="addScheduleButton" (click)="addSchedule()">Dodaj grafik</button>
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

        .custom-scroll-bar{
            height:35vh;
            overflow-x: hidden;
        }

        .schedules{
            text-align: center;
        }
    `]
})

export class SchedulesDialog {
    constructor(
        public dialogRef: MatDialogRef<SchedulesDialog>,
        private doctorService: DoctorService,
        @Inject(MAT_DIALOG_DATA) public data: DoctorData) { }

    addSchedule(): void {
        var startDate: Date = new Date(this.data.newStartDate);
        var finishDate: Date = new Date(this.data.newFinishDate);
        this.data.newStartDate = new Date(startDate.setHours(startDate.getHours() - (startDate.getUTCHours() - startDate.getHours())));
        this.data.newFinishDate = new Date(finishDate.setHours(finishDate.getHours() - (finishDate.getUTCHours() - finishDate.getHours())));
        const schedule: ScheduleI = {
            scheduleDate: this.data.newStartDate, finishHour: this.data.newFinishDate,
            singleVisitTime: this.data.newVisitTime, _id: '', visits: []
        };
        this.doctorService.addTerminsSlots(schedule, this.data.doctor).subscribe((doctor: DoctorI) => {
            this.data.doctor = doctor;
        })
        this.data.newSchedule.push(schedule);
    }

    removeSchedule(schedule: ScheduleI): void {
        const index = this.data.newSchedule.indexOf(schedule);
        this.data.newSchedule.splice(index, 1);
        this.data.doctor.schedule = this.data.newSchedule;
        this.doctorService.editDoctor(this.data.doctor).subscribe(() => { });
    }

    onRemove(e: Event): void {
        e.preventDefault();
        e.stopImmediatePropagation();
    }

    closeDialogRef(): void {
        this.dialogRef.close();
    }
}
