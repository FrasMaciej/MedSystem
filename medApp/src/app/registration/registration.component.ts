import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../login/auth.service';
import { UserI } from '@shared/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  template: `
    <body scroll="no" style="overflow: hidden">
    <div class="registerFormContainer">
      <button id="homeButton" mat-fab color="primary" [routerLink]="['/']">
        <mat-icon>home</mat-icon>
      </button>
      <form [formGroup]="registerForm">
        <p>
          <mat-form-field>
            <mat-label>Imię</mat-label>
            <input type="text" class="form-control" matInput placeholder="Wpisz imię" formControlName="name" required>
          </mat-form-field>
        </p>
        <p>
          <mat-form-field>
            <mat-label>Nazwisko</mat-label>
            <input type="text" class="form-control" matInput placeholder="Wpisz nazwisko" formControlName="surname" required>
          </mat-form-field>
        </p>
        <p>
          <mat-form-field>
            <mat-label>Miasto</mat-label>
            <input type="text" class="form-control" matInput placeholder="Wpisz miasto" formControlName="city" required>
          </mat-form-field>
        </p>
        <p>
          <mat-form-field>
            <mat-label>Login</mat-label>
            <input type="text" class="form-control" matInput placeholder="Wpisz login" formControlName="username" minlength="6" required>
          </mat-form-field>
        </p>
        <p>
          <mat-form-field>
            <mat-label>Hasło</mat-label>
            <input type="password" matInput placeholder="Wpisz hasło" formControlName="password" minlength="6" required>
            <mat-hint>(min. 6 znaków)</mat-hint>
          </mat-form-field>
        </p>
        <p>
          <button type="submit" mat-raised-button [disabled]="!registerForm.valid" (click)="submitRegisterForm()">Zarejestruj się</button>
        </p> 
      </form>
    </div>
  `,
  styles: [`
    .registerFormContainer {
      margin-top: 5%;
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
export class RegistrationComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    surname: new FormControl(''),
    city: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }

  submitRegisterForm() {
    const user: UserI = {
      username: this.registerForm.get('username')?.value,
      password: this.registerForm.get('password')?.value,
      name: this.registerForm.get('name')?.value,
      surname: this.registerForm.get('surname')?.value,
      role: 'Patient',
      city: this.registerForm.get('city')?.value,
    }
    this.authService.register(user).then(() => { });
  }

}
