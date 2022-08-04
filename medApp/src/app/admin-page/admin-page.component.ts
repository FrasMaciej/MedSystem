import { Component, Inject, OnInit } from '@angular/core';
import { Doctor } from '../models/doctor';
import { DoctorService } from '../services/doctor.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  name: string,
  surname: string,
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

  openDialog(doctor: Doctor): void {
    const dialogRef = this.dialog.open(DoctorEditDialog, {
      width: '500px',
      height: '500px',
      data: {name: doctor.name, surname: doctor.surname}
    });

    dialogRef.afterClosed().subscribe( {
      
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
  selector: 'app-doctor-edit-dialog',
  templateUrl: 'doctor-edit-dialog.html',
  styleUrls: ['doctor-edit-dialog.css']
})

export class DoctorEditDialog {

  constructor(
    public dialogRef: MatDialogRef<DoctorEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  backClick(): void {
    this.dialogRef.close();
  }

  saveClick(): void {
    console.log(this.data.name);
  }

}
