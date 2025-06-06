import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-stroke',
  templateUrl: './stroke.component.html',
  styleUrls: ['./stroke.component.css']
})
export class StrokeComponent implements OnInit {
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  prediction: string | null = null;

  username: string = '';
  role: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // ✅ Récupération dynamique depuis localStorage
    this.username = localStorage.getItem('username') || 'Guest';
    this.role = localStorage.getItem('role') || 'Unknown';
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.imagePreview = null;
    }
  }

  predictStroke(): void {
    if (!this.selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];

      this.apiService.predictStroke({ image: base64 }).subscribe({
        next: (response: any) => {
          this.prediction = response.prediction;
        },
        error: (error: any) => {
          console.error('Prediction error', error);
        }
      });
    };
    reader.readAsDataURL(this.selectedFile);
  }

  logout(): void {
    localStorage.clear();
    window.location.href = '/login';
  }
}