import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  template: `
    <body scroll="no" style="overflow: hidden">
      <div class="logging-form">
        <button id="homeButton" mat-fab color="primary" [routerLink]="['/']">
          <mat-icon>home</mat-icon>
        </button>
        <p>
          <mat-form-field appearance="outline">
            <mat-label>Login</mat-label>
            <input matInput placeholder="Wpisz login">
          </mat-form-field>
        </p>
        <p>
          <mat-form-field appearance="outline">
            <mat-label>Hasło</mat-label>
            <input matInput placeholder="Wpisz hasło">
            <mat-hint>Podaj silne hasło (min 8 znaków)</mat-hint>
          </mat-form-field>
        </p>
        <p>
          <a [routerLink]="['/adminPage']">
            <button mat-raised-button>Zaloguj się</button>
          </a>
        </p>
    </div>
  `,
  styles: [`
    .logging-form{
        margin-top: 10%;
    }

    p{
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #homeButton{
        display: flex;
        justify-content: center;
        margin: auto;
        margin-bottom: 2%;
    }
  `]
})
export class LoginComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
}
