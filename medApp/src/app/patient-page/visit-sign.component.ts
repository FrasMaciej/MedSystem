import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DoctorService } from '../services/doctor.service';
import { VisitData } from './patient-page.component';

@Component({
  selector: 'app-visit-sign',
  template: `
    <p>
      visit-sign works!
    </p>
  `,
  styles: [`
    h1 {
      text-align: center;
    }
  `]
})
export class VisitSignComponent {
  constructor(
    public dialogRef: MatDialogRef<VisitSignComponent>,
    private doctorService: DoctorService,
    @Inject(MAT_DIALOG_DATA) public data: VisitData) { }

  backClick() {
    this.dialogRef.close();
  }
  
  saveClick() {
    this.data.visitInfo.visit.isFree = false;
    this.data.visitInfo.visit.patientInfo.name = this.data.name;
    this.data.visitInfo.visit.patientInfo.surname = this.data.surname;
    this.data.visitInfo.visit.visitNote = this.data.note;
  }

}
