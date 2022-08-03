import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  doctors;
  

  constructor(private doctorService: DoctorService) { 
    this.doctors = this.doctorService.getDoctors();
  } 

  ngOnInit(): void {
  }

}
