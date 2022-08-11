import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Doctor } from '../models/doctor';
import { DoctorService } from '../services/doctor.service';

@Component({
  selector: 'app-schedule-page',
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.css']
})
export class SchedulePageComponent implements OnInit {
  schedule_id: string;
  doctor_id: string;
  doctor!: Doctor;

  constructor(
    private actRoute: ActivatedRoute,
    private doctorService: DoctorService,
    ) { 
    this.schedule_id = this.actRoute.snapshot.params['schId'];
    this.doctor_id = this.actRoute.snapshot.params['docId'];
  }

  ngOnInit(): void {
    this.getDoctor();
  }

  getDoctor(): void {
    this.doctorService.getDoctor(this.doctor_id).subscribe((doctor: Doctor) => {
      this.doctor = doctor;
    })
  }

  getD(){
    console.log(this.doctor.schedule);
  }

}
