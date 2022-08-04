import { Component, OnInit } from '@angular/core';
import { Doctor } from '../models/doctor';
import { DoctorService } from '../services/doctor.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  doctors!: Doctor[];
  doctor: Doctor = new Doctor();

  constructor(private doctorService: DoctorService) { } 

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
