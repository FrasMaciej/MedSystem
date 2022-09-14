import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  template: `
    <body scroll="no" style="overflow: hidden">
    <div class="loginFormContainer">
      <button id="homeButton" mat-fab color="primary" [routerLink]="['/']">
        <mat-icon>home</mat-icon>
      </button>
      <form [formGroup]="loginForm">
        <p>
          <mat-form-field appearance="outline">
            <mat-label>Login</mat-label>
            <input type="text" class="form-control" matInput placeholder="Wpisz login" formControlName="username" minlength="6" required>
            <mat-hint>(min. 6 znaków)</mat-hint>
          </mat-form-field>
        </p>

        <p>
          <mat-form-field appearance="outline">
            <mat-label>Hasło</mat-label>
            <input type="password" matInput placeholder="Wpisz hasło" formControlName="password" minlength="6" required>
            <mat-hint>(min. 6 znaków)</mat-hint>
          </mat-form-field>
        </p>

        <p *ngIf="error" class="error">
          {{ error }}
        </p>

        <p>
          <button type="submit" mat-raised-button [disabled]="!loginForm.valid" (click)="submitLoginForm()">Zaloguj się</button>
        </p>
      </form>
    </div>
  `,
  styles: [`
    .loginFormContainer {
        margin-top: 10%;
    }

    p {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #homeButton {
        display: flex;
        justify-content: center;
        margin: auto;
        margin-bottom: 2%;
    }
  `]
})

export class LoginComponent {
  @Input() error!: string | null;
  @Output() submitEM = new EventEmitter();
  route: string = '';
  role: string = '';
  loginForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private router: Router, private authService: AuthService, private snackBar: MatSnackBar) {
    if (this.router.url === '/login/admin') {
      this.route = '/adminPage';
      this.role = 'Admin';
    }
    else if (this.router.url === '/login/doctor') {
      this.route = '/doctorPage';
      this.role = 'Doctor';
    }
    else if (this.router.url === '/login/patient') {
      this.route = '/patientPage'
      this.role = 'Patient';
    }
  }

  public submitLoginForm(): void {
    let userCreated: boolean = false;
    if (this.router.url === '/login/patient' || this.router.url === '/login/doctor') {

      this.authService.validate(this.loginForm.get('username')?.value, this.loginForm.get('password')?.value, this.role).then((response) => {
        this.authService.setUserInfo({ 'user': response });
        this.router.navigate([this.route]);
        userCreated = true;
      }).then(() => {
        if (userCreated) {
          this.snackBar.open('Użytkonik zalogowany pomyślnie do systemu', '', { duration: 4000 });
        }
      })



    }
    else if (this.router.url === '/login/admin') {
      this.router.navigate([this.route]);
    }
  }
}
