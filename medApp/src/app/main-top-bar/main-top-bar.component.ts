import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 


@Component({
  selector: 'app-main-top-bar',
  templateUrl: './main-top-bar.component.html',
  styleUrls: ['./main-top-bar.component.css']
})
export class MainTopBarComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  
  onUserButtonClick() {
    this.router.navigateByUrl('/login');
  }

}
