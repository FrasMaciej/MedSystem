import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Visit, VisitInfo } from '../models/schedule';
import { DoctorService } from '../services/doctor.service';

@Component({
  selector: 'app-patient-details',
  template: `
    <p>
      <mat-toolbar color="primary">
        <button mat-icon-button class="icon">
          <mat-icon>menu</mat-icon>
        </button>
        <a [routerLink]="['/patientPage']">
          <button mat-icon-button class="icon">
            <mat-icon>exit_to_app</mat-icon>
          </button>
        </a>
        <span>Dane pacjenta - moje wizyty</span>
      </mat-toolbar>
    </p>

    <div class="visitsList">
      <table mat-table [dataSource]="selectedVisits" class="mat-elevation-z8">
        <ng-container matColumnDef="city">
          <th mat-header-cell *matHeaderCellDef> Miasto </th>
          <td mat-cell *matCellDef="let element"> {{element.docCity}}</td>
        </ng-container>

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef> Imię i nazwisko lekarza</th>
          <td mat-cell *matCellDef="let element"> {{element.docName}} {{element.docSurname}}</td>
        </ng-container>

        <ng-container matColumnDef="visitDate">
          <th mat-header-cell *matHeaderCellDef> Data wizyty </th>
          <td mat-cell *matCellDef="let element"> {{element.visit.startHour | date:'yyyy-MM-dd HH:mm':'+0000' }} — {{element.visit.finishHour | date:'HH:mm':'+0000' }}</td>
        </ng-container>

        <ng-container matColumnDef="note">
          <th mat-header-cell *matHeaderCellDef> Notatka do wizyty </th>
          <td mat-cell *matCellDef="let element"> {{element.visit.visitNote}} </td>
        </ng-container>

        <ng-container matColumnDef="buttons">
          <th mat-header-cell *matHeaderCellDef>  </th>, 
          <td mat-cell *matCellDef="let element">
            <button id ="editButton" mat-icon-button color="black" (click)="cancelVisit(element.visit, element.doctorId, element.scheduleId)">
              <mat-icon>delete_forever</mat-icon>
            </button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      <mat-paginator [pageSizeOptions]="[10, 20]" showFirstLastButtons >
      </mat-paginator>
    </div>
  `,
  styles: [`
    .mat-toolbar.mat-primary {
      background-color: rgb(71, 106, 141);
    } 
  `]
})
export class PatientDetailsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  patientId: String;
  name: String;
  surname: String;
  selectedVisits = new MatTableDataSource<VisitInfo>();
  displayedColumns: String[] = ['city', 'name', 'visitDate', 'note', 'buttons']

  constructor(private doctorService: DoctorService) {
    const userInfo = JSON.parse(window.localStorage.getItem('userInfo') || '{}');
    this.patientId = userInfo.user.user._id;
    this.name = userInfo.user.user.name
    this.surname = userInfo.user.user.surname;
    this.getFilteredVisits();
  }

  ngOnInit(): void {
    this.getFilteredVisits();
  }

  ngAfterViewInit(): void {
    this.selectedVisits.paginator = this.paginator;
  }

  getFilteredVisits(): void {
    this.doctorService.getVisitsByPatient(this.patientId).subscribe((matchingVisits: VisitInfo[]) => {
      this.selectedVisits.data = matchingVisits;
    })
  }

  cancelVisit(visit: Visit, doctor_id: String, schedule_id: String): void {
    visit.isFree = true;
    this.doctorService.editVisit(visit, doctor_id, schedule_id, visit._id, '').subscribe(() => {
      this.getFilteredVisits();
    })
  }
}