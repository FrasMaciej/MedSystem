import { Component, OnInit } from '@angular/core';
import { Doctor } from '../models/doctor';
import { DoctorService } from '../services/doctor.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  doctors: Doctor[] | any;

  constructor(private doctorService: DoctorService) { } 

  ngOnInit(): void {
    this.doctorService.getDoctors().subscribe(data => {
      console.log(data);
      this.doctors = data;
      this.doctors.sort((a:any,b:any) => (a.surname < b.surname ? -1 : 1));
    })
  }

  onRemove(e: Event) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }

}
