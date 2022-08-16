import { Component, OnInit } from '@angular/core';

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
  `,
  styles: [`
    .mat-toolbar.mat-primary {
      background-color: rgb(71, 106, 141);
    }
  `]
})
export class PatientPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
