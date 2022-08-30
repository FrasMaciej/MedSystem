import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-doctor-page',
  template: `
    <p>
      <mat-toolbar color="primary">
        <button mat-icon-button class="icon" (click)="click()">
          <mat-icon>menu</mat-icon>
        </button>
        <a [routerLink]="['/']">
          <button mat-icon-button class="icon">
            <mat-icon>exit_to_app</mat-icon>
          </button>
        </a>
        <span>Panel Lekarza</span>
      </mat-toolbar>
    </p>
  `,
  styles: [`
  `]
})
export class DoctorPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  click() {
    
  }

}
