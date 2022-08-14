import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 


@Component({
  selector: 'app-main-page',
  template: `
    <body  class="background">
      <p>
        <mat-toolbar class="transparent">
          <span class = singleElement>
          <button mat-icon-button class="icon">
              <mat-icon>menu</mat-icon>
          </button>
          </span>
          <span class = singleElement>
          <button mat-icon-button class="icon" onclick="location.href='https://pl-pl.facebook.com/comarchpl/';">
              <mat-icon>facebook-box</mat-icon>
          </button>
          </span>
          <span class = singleElement> &nbsp; Witamy w MedSystem - aplikacji obsługi pacjentów </span>
          <span class="spacer"></span>
          <a [routerLink]="['/login']"><button class="hover-class" id="patient-button" mat-stroked-button>Pacjent</button></a>
          <a [routerLink]="['/login']"><button class="hover-class" id="doctor-button" mat-stroked-button>Lekarz</button></a>
          <a [routerLink]="['/login']"><button class="hover-class" id="admin-button" mat-stroked-button>Administrator</button></a>
        </mat-toolbar>
      </p>
    </body>
  `,
  styles: [`
    body, html {
      height: 100%;
    }

    .background {
      position: fixed;
      height: 100%;
      min-width: 100%;
      background-image: url('../../assets/background.jpg');
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }

    .spacer {
      flex: auto;
    }

    .hover-class:hover {
      background-color: rgb(40, 123, 134);
      color: white;
    }
  `]
})
export class MainPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {}

  onUserButtonClick() {
    this.router.navigateByUrl('/login');
  }

}
