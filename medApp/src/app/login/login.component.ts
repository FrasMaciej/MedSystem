import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-login',
  template: `
    <body scroll="no" style="overflow: hidden">
      <div class="logging-form">
        <button id="homeButton" mat-fab color="primary" [routerLink]="['/']">
          <mat-icon>home</mat-icon>
        </button>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <p>
            <mat-form-field appearance="outline">
              <mat-label>Login</mat-label>
              <input type="text" matInput placeholder="Wpisz login" formControlName="username">
            </mat-form-field>
          </p>
          <p>
            <mat-form-field appearance="outline">
              <mat-label>Hasło</mat-label>
              <input type="password" matInput placeholder="Wpisz hasło" formControlName="password">
              <mat-hint>Podaj silne hasło (min 8 znaków)</mat-hint>
            </mat-form-field>
          </p>

          <p *ngIf="error" class="error">
            {{ error }}
          </p>

          <p>
            <button type="submit" mat-raised-button (click)="submit()">Zaloguj się</button>
          </p>
        </form>
    </div>
  `,
  styles: [`
    .logging-form {
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
export class LoginComponent implements OnInit {
  route: String = '';

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private router: Router, private patientService: PatientService) {
    if(this.router.url === '/login/admin')
      this.route = '/adminPage'
    else if(this.router.url === '/login/doctor')
      this.route = '/doctorPage'
    else if(this.router.url === '/login/patient')
      this.route = '/patientPage'
  }

  navigate(){
    console.log(this.route)
    this.router.navigate([this.route]);
  }

  submit() {
    if(this.router.url === '/login/patient') {
        this.patientService.login(this.form.get('username')?.value , this.form.get('password')?.value).subscribe(() => {
          this.router.navigate([this.route]);
        })
    }
    else if(this.router.url === '/login/admin')
      this.router.navigate([this.route]);
  }
  // CR-KR
  // Tutaj to może się wydawać pierdołą, ale tak naprawdę jest to bardzo ważna rzecz :)
  // pisząc komponenty zazwyczaj przyjmujemy pewną ustaloną mniej-więcej kolejność 
  // z czego Inputy i Outputy to jest tak naprawdę absolutnie najważniejsza rzecz jaka Cię interesuje
  // jak czytasz kod komponentu, aby ułatwić sobie i innym pracę dajemy je na samą górę, żeby od razu było widać
  // co ten komponent przyjmuje i jakie emituje eventy :)

  // w wolnej chwili możesz sobie zerknąć na https://angular.io/guide/styleguide#member-sequence
  // później zobaczysz że jakoś bardzo sztywno się nie trzymamy tych zasad, ale niektóre naprawdę warto stosować
  
  // najbardziej preferowana kolejność to: 
  // Inputy, Outputy, 
  // właściwości publiczne, prywatne, 
  // konstruktor, 
  // metody cyklu życia zgodnie z kolejnością wykonywania (ngOnInit, ngOnDestroy)
  // metody publiczne
  // metody prywatne

  // jedyny Wojtek wciąż się opiera tej kolejności :D

  @Input() error!: string | null;
  @Output() submitEM = new EventEmitter();

  ngOnInit() {} 
  
}
