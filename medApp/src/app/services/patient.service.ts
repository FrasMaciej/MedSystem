import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  // CR-KR
  // tutaj widzę że ten baseUrl pojawia się w kilku miejscach w aplikacji
  // dobrą praktyką do takich rzeczy byłoby założenie jednego pliku z globalnymi ustawieniami 
  // (może być nawet zwykły plik ts z obiektem ustawień w środku do zaimportowania)
  // wtedy jeśli zajdzie potrzeba zmiany tego adresu nie musisz robić tego w kilku miejscach w kodzie tylko w jednym
  public baseUrl = 'http://localhost:8080/api/patient';

  constructor(private httpClient: HttpClient) { }
  // CR-KR 
  // Też zauważyłam że przy żądaniach HTTP nie ma za bardzo nigdzie obsługi błędów
  // przydałoby się dodać, nawet coś najbardziej podstawowego
  // moja sugestia tutaj byłaby taka, żeby dodać gdzieś wyskakujące okienko z komunikatem
  // za każdym razem jak wystąpi błąd podczas wykonywania requestów :)
  login(username: String, password: String) {
    const loginUrl = this.baseUrl+'/'+'login';
    const loginData = {
      username: username,
      password: password,
    }
    return this.httpClient.post(loginUrl, loginData)
  }

  register(username: String, password: String, name: String, surname: String) {
    const registerUrl = this.baseUrl+'/'+'register';
    const newPatient = {
      username: username,
      password: password,
      name: name,
      surname: surname
    }
    return this.httpClient.post(registerUrl, newPatient)
  }

}
