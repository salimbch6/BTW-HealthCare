import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-prostate',
  templateUrl: './prostate.component.html',
  styleUrls: ['./prostate.component.css']
})
export class ProstateComponent {
  // 🔹 Formulaire de prédiction
  formData = {
    psa_level: '',
    prostate_volume: '',
    alcohol_consumption: 'Moderate',
    smoking_history: 'No',
    cholesterol_level: 'Normal',
    diabetes: 'No',
    hypertension: 'No'
  };

  prediction: string = '';
  error: string = '';

  // 🔹 Infos utilisateur pour affichage dans le header
  username: string = '';
  role: string = '';

  constructor(private http: HttpClient) {
    // Récupérer les données du localStorage
    this.username = localStorage.getItem('user') || 'Guest';
    this.role = localStorage.getItem('role') || 'Unknown';
  }

  // 🔹 Soumettre le formulaire au backend
  onSubmit(): void {
    this.http.post<any>('http://localhost:5000/prostate/predict', this.formData)
      .subscribe({
        next: (res) => {
          this.prediction = res.prediction;
          this.error = '';
        },
        error: (err) => {
          this.error = 'An error occurred.';
          this.prediction = '';
          console.error(err);
        }
      });
  }

  // 🔹 Déconnexion
  logout(): void {
    localStorage.clear();
    window.location.href = '/login'; // ou utiliser le Router si tu l’injectes
  }
}