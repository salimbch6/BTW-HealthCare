import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data, {
      withCredentials: true
    });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, {
      withCredentials: true
    });
  }

  predictPatientStay(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/patientstay/predict`, data);
  }

  predictSentiment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sentiment/predict`, data);
  }

  predictStroke(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/stroke/predict`, data);
  }

  getReclamations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sentiment/reclamations`);
  }

  // ✅ Login facial avec image encodée en base64
  faceLogin(image: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/face-login`, { image }, {
      withCredentials: true
    });
  }
}
