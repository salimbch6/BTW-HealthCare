import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-breast',
  templateUrl: './breast.component.html',
  styleUrls: ['./breast.component.css']
})
export class BreastComponent {
  formData = {
    mean_radius: '',
    mean_texture: '',
    mean_perimeter: '',
    mean_area: '',
    mean_smoothness: ''
  };

  prediction: string = '';
  error: string = '';

  // 🔹 Ajout pour la navbar
  username: string = 'salim'; // Remplace par ton système d'authentification si besoin
  role: string = 'head';

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.prediction = '';
    this.error = '';

    this.http.post<any>('http://localhost:5000/breast/predict', this.formData)
      .subscribe({
        next: (res) => {
          this.prediction = res.prediction;
        },
        error: (err) => {
          console.error('❌ API error:', err);
          this.error = err.error?.error || 'An unexpected error occurred.';
        }
      });
  }

  // 🔹 Méthode pour le bouton logout
  logout() {
    console.log("🔐 Logged out");
    // Redirection, suppression de token, etc.
    // Par exemple :
    // localStorage.clear();
    // window.location.href = '/login';
  }
}