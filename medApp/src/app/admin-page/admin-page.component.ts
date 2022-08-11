import { DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY } from '@angular/cdk/dialog';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Doctor } from '../models/doctor';
import { Schedule } from '../models/schedule';
import { SchedulePageComponent } from '../schedule-page/schedule-page.component';
import { DoctorService } from '../services/doctor.service';

export interface DoctorData {
  doctor: Doctor;
  newName: string;
  newSurname: string;
  newCity: string;
  newSpecializations: string[];
  newSpec: string;
  newSchedule: Schedule[];
  newVisitTime: number;
  newStartDate: Date;
  newFinishDate: Date;
}

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})

export class AdminPageComponent implements OnInit {
  doctors!: Doctor[];
  constructor(private doctorService: DoctorService, public dialog: MatDialog) {} 

  openEditDoctorDialog(doctor: Doctor): void {
    const dialogRef = this.dialog.open(DoctorEditDialog, {
      width: '500px',
      height: '600px',
      autoFocus: false,
      data: {doctor: doctor, newName: doctor.name, newSurname: doctor.surname, newCity: doctor.city,
         newSpecializations: doctor.specializations, newSchedule: doctor.schedule}
    });

    dialogRef.afterClosed().subscribe( result => {
      if(result!=null){
        this.doctorService.editDoctor(result).subscribe((result)=>{
          this.updateDoctors();
        });
      }
    });
  }

  openAddDoctorDialog(): void {
    const dialogRef = this.dialog.open(DoctorAddDialog, {
      width: '500px',
      height: '325px',
      autoFocus: false,
      data: {newName: '', newSurname: '', newCity: '', doctor: new Doctor}
    });

    dialogRef.afterClosed().subscribe( result => {
      if(result!==null){
        this.doctorService.addDoctor(result).subscribe((result)=>{
          this.updateDoctors();
        });
      }
    });
  }

  openSchedulesDialog(doctor: Doctor): void {
    const dialogRef = this.dialog.open(SchedulesDialog, {
      width: '600px',
      height: '800px',
      autoFocus: false,
      data: {doctor: doctor, newSchedule: doctor.schedule, newStartDate: new Date(), newFinishDate: new Date(), newVisitTime: 0}
    });
    
    dialogRef.afterClosed().subscribe( () => {
      this.updateDoctors();
    });
  }

  ngOnInit(): void {
    this.updateDoctors();
  }

  updateDoctors(): void {
    this.doctorService.getDoctors().subscribe((doctors: Doctor[]) => {
      this.doctors = doctors;
      this.doctors.sort((a:any,b:any) => (a.surname < b.surname ? -1 : 1));
    })
  }

  removeDoctor(doctor: Doctor){
      this.doctorService.removeDoctor(doctor).subscribe( () => {
        this.updateDoctors();
    });
  }

  onRemove(e: Event) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
}

@Component({
  selector: 'doctor-edit-dialog',
  templateUrl: 'doctor-edit-dialog.html',
  styleUrls: ['doctor-edit-dialog.css']
})
export class DoctorEditDialog {
  constructor(
    public dialogRef: MatDialogRef<DoctorEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DoctorData) {}

  backClick(): void {
    this.dialogRef.close();
  }

  saveClick(): void {
    this.data.doctor.name = this.data.newName;
    this.data.doctor.surname = this.data.newSurname;
    this.data.doctor.city = this.data.newCity;
    this.data.doctor.specializations = this.data.newSpecializations;
  }

  onRemove(e: Event) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  removeSpecialization(specialization: string){
    const index = this.data.newSpecializations.indexOf(specialization);
    this.data.newSpecializations.splice(index,1);                              
  }

  addNewSpec(){
    if(this.data.newSpec!=''){
      this.data.newSpecializations.push(this.data.newSpec);
      this.data.newSpec='';
    }
  }
}

@Component({
  selector: 'doctor-add-dialog',
  templateUrl: 'doctor-add-dialog.html',
  styleUrls: ['doctor-add-dialog.css']
})
export class DoctorAddDialog {
  constructor(
    public dialogRef: MatDialogRef<DoctorAddDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DoctorData) {}

  backClick(): void {
    this.dialogRef.close();
  }

  saveClick(): void {
    this.data.doctor.name = this.data.newName;
    this.data.doctor.surname = this.data.newSurname;
    this.data.doctor.specializations = this.data.newSpecializations;
    this.data.doctor.city = this.data.newCity;
  }
}


@Component({
  selector: 'schedules-dialog',
  templateUrl: 'schedules-dialog.html',
  styleUrls: ['schedules-dialog.css']
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
    this.doctorService.addTerminsSlots(schedule, this.data.doctor).subscribe( () => {
    })
    this.data.newSchedule.push(schedule);
  }


}

