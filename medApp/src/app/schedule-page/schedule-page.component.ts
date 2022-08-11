import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Doctor } from '../models/doctor';

@Component({
  selector: 'app-schedule-page',
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.css']
})
export class SchedulePageComponent implements OnInit {
  schedule_id: any;
  doctor_id: any;

  constructor(private actRoute: ActivatedRoute) { 
    this.schedule_id = this.actRoute.snapshot.params['schId'];
    this.doctor_id = this.actRoute.snapshot.params['docId'];
  }

  ngOnInit(): void {
  }

}
