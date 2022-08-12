import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DoctorEditDialog } from '../admin-page/admin-page.component';
import { Doctor } from '../models/doctor';
import { Schedule } from '../models/schedule';
import { Visit } from '../models/schedule';
import { DoctorService } from '../services/doctor.service';

export interface ScheduleData{
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
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.css']
})
export class SchedulePageComponent implements OnInit {
  schedule_id: string;
  doctor_id: string;
  doctor!: Doctor;
  selectedSchedule: any;

  constructor(
    private actRoute: ActivatedRoute,
    private doctorService: DoctorService,
    public dialog: MatDialog
    ) { 
    this.schedule_id = this.actRoute.snapshot.params['schId'];
    this.doctor_id = this.actRoute.snapshot.params['docId'];
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


    // To-do ------------------------------------------------
    dialogRef.afterClosed().subscribe( result => {
      if(result!==null){
        this.doctorService.editVisit(result.visit, result.doctor_id, result.schedule_id, result.visit._id).subscribe(() => {
          //this.updateDoctor();
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

  getSchedule(): Schedule{
    this.selectedSchedule = this.doctor.schedule.find(i => i._id === this.schedule_id);
    return this.selectedSchedule;
  }

  openEditVistDialog(visit: Visit){

  }

}

@Component({
  selector: 'edit-visit-dialog',
  templateUrl: 'edit-visit-dialog.html',
  styleUrls: ['edit-visit-dialog.css']
})
export class EditVisitDialog{
  constructor(
    public dialogRef: MatDialogRef<EditVisitDialog>,
    private doctorService: DoctorService,
    @Inject(MAT_DIALOG_DATA) public data: ScheduleData) {}

    backClick(): void {
      this.dialogRef.close();
    }
  
    saveClick(): void {
      this.data.visit.isFree = this.data.newIsFree;
      this.data.visit.patientInfo.name = this.data.newName;
      this.data.visit.patientInfo.surname = this.data.newSurname;
      this.data.visit.visitNote = this.data.newVisitNote;
    }

    closeDialogRef(){
      this.dialogRef.close();
    }

}
