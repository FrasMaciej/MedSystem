import { Component, Inject, OnInit } from '@angular/core';
import { Doctor } from '../models/doctor';
import { DoctorService } from '../services/doctor.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface EditDoctorData {
  doctorToChange: Doctor;
  newName: string;
  newSurname: string;
}

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})

export class AdminPageComponent implements OnInit {
  doctors!: Doctor[];
  doctor: Doctor = new Doctor();

  constructor(private doctorService: DoctorService, public dialog: MatDialog) { } 

  openEditDoctorDialog(doctor: Doctor): void {
    const dialogRef = this.dialog.open(DoctorEditDialog, {
      width: '500px',
      height: '300px',
      autoFocus: false,
      data: {doctorToChange: doctor, newName: doctor.name, newSurname: doctor.surname}
      
    });

    dialogRef.afterClosed().subscribe( result => {
      if(result!=null){
        this.doctorService.editDoctor(result).subscribe((result)=>{
          this.ngOnInit();
        });
      }
    });
  }

  openAddDoctorDialog(): void {
    const dialogRef = this.dialog.open(DoctorAddDialog, {
      width: '500px',
      height: '300px',
      autoFocus: false,
      data: {newName: '', newSurname: '', doctorToChange: new Doctor}
    });

    dialogRef.afterClosed().subscribe( result => {
      if(result!=null){
        this.doctorService.addDoctor(result).subscribe((result)=>{
          this.ngOnInit();
        });
      }
    });

  }

  ngOnInit(): void {
    this.doctorService.getDoctors().subscribe((doctors: Doctor[]) => {
      this.doctors = doctors;
      this.doctors.sort((a:any,b:any) => (a.surname < b.surname ? -1 : 1));
    })
  }

  removeDoctor(doctor: Doctor){
      this.doctorService.removeDoctor(doctor).subscribe( () => {
        this.ngOnInit();
        console.log(this.doctorService.getDoctors());
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
    @Inject(MAT_DIALOG_DATA) public data: EditDoctorData) {}

  backClick(): void {
    this.dialogRef.close();
  }

  saveClick(): void {
    this.data.doctorToChange.name = this.data.newName;
    this.data.doctorToChange.surname = this.data.newSurname;
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
    @Inject(MAT_DIALOG_DATA) public data: EditDoctorData) {}

  backClick(): void {
    this.dialogRef.close();
  }

  saveClick(): void {
    this.data.doctorToChange.name = this.data.newName;
    this.data.doctorToChange.surname = this.data.newSurname;
  }

}
