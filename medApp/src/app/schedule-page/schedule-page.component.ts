import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Doctor } from '../models/doctor';
import { Schedule } from '../models/schedule';
import { Visit } from '../models/schedule';
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
    this.getSchedule();
  }

  getDoctor(): void {
    this.doctorService.getDoctor(this.doctor_id).subscribe((doctor: Doctor) => {
      this.doctor = doctor;
      this.getSchedule();
    })
  }

  getSchedule(): void{
    this.selectedSchedule = this.doctor.schedule.find(i => i._id === this.schedule_id);
    return this.selectedSchedule;
  }

  openEditVistDialog(visit: Visit){

  }

}
