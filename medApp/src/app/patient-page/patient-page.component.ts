import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Doctor } from '../models/doctor';
import { DoctorService } from '../services/doctor.service';

@Component({
  selector: 'app-patient-page',
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
        <span>Panel Pacjenta</span>
      </mat-toolbar>
    </p>
    <mat-form-field appearance="fill">
      <mat-label>Toppings</mat-label>
      <mat-select [formControl]="toppings" multiple>
        <mat-select-trigger>
          {{toppings.value?.[0] || ''}}
          <span *ngIf="(toppings.value?.length || 0) > 1" class="example-additional-selection">
            (+{{(toppings.value?.length || 0) - 1}} {{toppings.value?.length === 2 ? 'other' : 'others'}})
          </span>
        </mat-select-trigger>
        <mat-option *ngFor="let topping of toppingList" [value]="topping">{{topping}}</mat-option>
      </mat-select>
    </mat-form-field>
  `,
  styles: [`
    .mat-toolbar.mat-primary {
      background-color: rgb(71, 106, 141);
    }
  `]
})
export class PatientPageComponent implements OnInit {
  //doctorsList: Doctor[] = [];
  cities = new FormControl('');
  specializations = new FormControl('');
  constructor(private doctorService: DoctorService) { }

  ngOnInit(): void {
    //this.updateDoctors();
  }

  // updateDoctors(): void {
  //   this.doctorService.getDoctors().subscribe((doctors: Doctor[]) => {
  //     this.doctorsList = doctors;
  //   })
  // }

}
