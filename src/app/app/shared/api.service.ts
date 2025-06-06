  import { Injectable } from '@angular/core';
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { Observable } from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })
  export class ApiService {
    private baseUrl = 'http://localhost:5000';  // ⚠️ adapte si Flask tourne sur un autre port

    constructor(private http: HttpClient) {}
    login(credentials: { username: string; password: string }): Observable<any> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.post(`${this.baseUrl}/auth/login`, credentials, {
        headers,
        withCredentials: true  // ✅ autorise l’envoi du cookie de session
      });
    }
    
  }
