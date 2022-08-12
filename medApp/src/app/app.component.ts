import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'medApp';
}

/* 

Ogolnie u nas doszlismy do wnioskow ze o wiele wygodniej komponenty pisze sie inline 
- jeden komponent per plik 
- w pliku znajdziesz zarowno kod html i cms bez adnotacji do innych plikow tak jak powyzej
- dzieki temu jest wszystko czyteleniejsze, jest mniejszy chaos i mniej plikow  
- dlateo tutaj wszystko bym poprzerabial, na komponenty inline,
jest dodatek do vscode nazywa sie angular2-inline i dzieki temu jest intellisense nawet w takich komponentach
 - przy generowaniu projektu w angular mozna zaznaczcyc flage by nie generowac plikow .spec 
    tutaj nie bedziesz pisal testow wiec odrazu mozesz wywalic to 
- obecnie masz tak ze jeden folder to komponent a mozna to zbic do jednego pliku .ts
- na assety zaloz sobie osobny folder /assets i tam to trzymaj, nie obok komponentow bo sie syf robi
*/