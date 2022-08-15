import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { Doctor } from '../models/doctor';
import { Schedule } from '../models/schedule';
import { DoctorService } from '../services/doctor.service';
import { DoctorAddDialog } from './doctor-add-dialog.component';
import { DoctorEditDialog } from './doctor-edit-dialog.component';
import { SchedulesDialog } from './schedules-dialog.component';

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
  template: `
    <p>
      <mat-toolbar color="primary">
        <button mat-icon-button class="icon">
          <mat-icon>menu</mat-icon>
        </button>
        <a [routerLink]="['/']">
          <button mat-icon-button class="icon">
            <mat-icon>exit_to_app</mat-icon>
          </button>
        </a>
        <span>Panel Administratora</span>
        <span class="spacer"></span>
        <button mat-raised-button color="newDoctorButton" (click)="openAddDoctorDialog()">Dodaj lekarza</button>
      </mat-toolbar>
    </p>
    <!-- To-do -> Ładniejsze wyświetlanie lekarzy wraz z ładnym skalowaniem oraz oddzieleniem ich na liście -->
    <div id="doctorsString">
      <h2>Lista lekarzy:</h2>
    </div>
    <mat-selection-list #doctor [multiple]="false" class="custom-scroll-bar"> 
      <mat-list-option *ngFor="let doctor of doctors" [value]="doctor">
        <div id="doctorsList">
          <button id = "deleteButton" mat-icon-button color="warn" (click)="removeDoctor(doctor)" (click)="onRemove($event)">
            <mat-icon>remove_circle</mat-icon>
          </button>
          <button id ="editButton" mat-icon-button color="black" (click)="openEditDoctorDialog(doctor)" (click)="updateDoctors()">
            <mat-icon>edit</mat-icon>
          </button>
          <button id ="editSchedule" mat-icon-button color="black" (click)="openSchedulesDialog(doctor)" (click)="updateDoctors()">
            <mat-icon>schedule</mat-icon>
          </button>

          {{ doctor.name }} {{doctor.surname}}, {{doctor.city}} : [{{doctor.specializations}}]

        </div>
      </mat-list-option>
    </mat-selection-list>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }

    #doctorsString{
      margin: 1%;
    }

    #doctorsList{
      display: flex;
      align-items: center;
    }

    .mat-newDoctorButton {
      background-color: rgb(21, 190, 41);
      color: #fff;
    }

    .mat-toolbar.mat-primary {
      background-color: rgb(18, 190, 216);
    }

    .custom-scroll-bar{
      height:50vh;
      overflow-y: scroll;
      overflow-x: hidden;
    }
  `]
})

export class AdminPageComponent implements OnInit {
  doctors: Doctor[] = [];
  constructor(private doctorService: DoctorService, public dialog: MatDialog) { } 

  openEditDoctorDialog(doctor: Doctor): void {
    const dialogRef = this.dialog.open(DoctorEditDialog, {
      width: '500px',
      height: '600px',
      autoFocus: false,
      data: {
        doctor: doctor, newName: doctor.name, newSurname: doctor.surname, newCity: doctor.city,
        newSpecializations: doctor.specializations, newSchedule: doctor.schedule
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== null) {
        this.doctorService.editDoctor(result).subscribe((result) => {
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
      data: { newName: '', newSurname: '', newCity: '', doctor: { } }
    });

    dialogRef.afterClosed().subscribe(result => {
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
      this.doctors.sort((a: Doctor, b: Doctor) => (a.surname < b.surname ? -1 : 1));
    })
  }

  removeDoctor(doctor: Doctor) {
    this.doctorService.removeDoctor(doctor).subscribe(() => {
      this.updateDoctors();
    });
  }

  onRemove(e: Event) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
}








