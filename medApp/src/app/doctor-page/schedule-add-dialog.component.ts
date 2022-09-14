import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, ValidationErrors } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DoctorI } from '@shared/doctor';
import { ScheduleI } from '@shared/schedule';
import { DoctorService } from "../services/doctor.service";
import { DoctorData } from "./doctor-page.component";

@Component({
    selector: 'app-schedule-add-dialog',
    template: `
    <div mat-dialog-content align="center">

    <form [formGroup]="addScheduleForm">
        <mat-form-field>
            <input matInput type="datetime-local" placeholder="Data początkowa" formControlName="startDate" required>
        </mat-form-field>   
        <br>
        <mat-form-field>
            <input matInput type="datetime-local" placeholder="Data końcowa" formControlName="endDate" valid="dateOrderValidator(addScheduleForm)" required>
        </mat-form-field> 
        <br>
        <mat-form-field>
            <input matInput placeholder="Czas pojedynczej wizyty (w min)" formControlName="singleVisitTime" type="number" required>
            <mat-hint>(wielokrotność 5 min)</mat-hint>

        </mat-form-field>   
    </form>

    </div>
        <br>
        <div class="addNewSchedule" align="center">
            <button mat-raised-button color="addScheduleButton" [disabled]="!addScheduleForm.valid || dateOrderValidator(addScheduleForm)" (click)="addNewSchedule()">Dodaj grafik</button>
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
export class ScheduleAddDialogComponent {
    addScheduleForm = new FormGroup({
        startDate: new FormControl(''),
        endDate: new FormControl(''),
        singleVisitTime: new FormControl(''),

    });
    constructor(
        public dialogRef: MatDialogRef<ScheduleAddDialogComponent>,
        private doctorService: DoctorService,
        @Inject(MAT_DIALOG_DATA) public data: DoctorData) { }

    dateOrderValidator(formGroup: FormGroup): boolean {
        const startDate = formGroup.controls['startDate']?.value;
        const endDate = formGroup.controls['endDate']?.value;
        const singleVisitTime = formGroup.controls['singleVisitTime']?.value;

        if ((Date.parse(startDate) >= Date.parse(endDate)) || ((singleVisitTime % 5) !== 0)) {
            return true;
        }
        else {
            return false;
        }
    }

    addNewSchedule(): void {
        const startDateStr = this.addScheduleForm.get('startDate')?.value;
        const endDateStr = this.addScheduleForm.get('endDate')?.value;
        const singleVisitTime = this.addScheduleForm.get('singleVisitTime')?.value;

        if (startDateStr && endDateStr && singleVisitTime) {
            const startDate: Date = new Date(startDateStr);
            const finishDate: Date = new Date(endDateStr);
            this.data.newStartDate = new Date(startDate.setHours(startDate.getHours() - (startDate.getUTCHours() - startDate.getHours())));
            this.data.newFinishDate = new Date(finishDate.setHours(finishDate.getHours() - (finishDate.getUTCHours() - finishDate.getHours())));
            const schedule: ScheduleI = {
                scheduleDate: startDate, finishHour: finishDate,
                singleVisitTime: Number.parseInt(singleVisitTime), _id: '', visits: []
            };
            this.doctorService.addTerminsSlots(schedule, this.data.doctor).subscribe((doctor: DoctorI) => {
                this.data.doctor = doctor;
            })
            this.data.newSchedule.push(schedule);
            this.closeDialogRef();
        }

    }

    closeDialogRef(): void {
        this.dialogRef.close();
    }
}
