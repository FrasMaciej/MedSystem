import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Doctor } from '../models/doctor';
import { Schedule } from '../models/schedule';
import { Visit } from '../models/schedule';
import { DoctorService } from '../services/doctor.service';

export interface ScheduleData {

}

/*   
  -Praca z rxjs na poczatku jest trudna
  pamietaj zeby zawsze zrobic unsubscibe na zrodle gdy komponent jest odladowywany 
  - staraj sie unikac any, dobrze gdy wszystko jest otypowane
  - jeden komponent per plik
  */

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
  ) {
    this.schedule_id = this.actRoute.snapshot.params['schId'];
    this.doctor_id = this.actRoute.snapshot.params['docId'];
  }

  ngOnInit(): void {
    this.doctor = {} as Doctor;
    this.selectedSchedule = {} as Schedule;
    this.getDoctor();
  }



  getDoctor(): void {
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

@Component({
  selector: 'edit-visit-dialog',
  templateUrl: 'edit-visit-dialog.html',
  styleUrls: ['edit-visit-dialog.css']
})
export class EditVisitDialog {
  constructor(
    public dialogRef: MatDialogRef<EditVisitDialog>,
    private doctorService: DoctorService,
    @Inject(MAT_DIALOG_DATA) public data: ScheduleData) { }

  backClick(): void {
    this.dialogRef.close();
  }

  saveClick(): void {
    //this .. visit .. = newVist ...
  }

  closeDialogRef() {
    this.dialogRef.close();
  }

}
