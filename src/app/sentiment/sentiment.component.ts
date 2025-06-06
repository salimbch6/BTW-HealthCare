import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-sentiment',
  templateUrl: './sentiment.component.html',
  styleUrls: ['./sentiment.component.css']
})
export class SentimentComponent implements OnInit {
  reclamations: any[] = [];
  selectedCode: string = '';
  selectedText: string = '';
  prediction: string | null = null;

  username: string | null = ''; // ✅ For header display
  role: string | null = '';     // ✅ For header display

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    // ✅ Load username and role from localStorage
    this.username = localStorage.getItem('username');
    this.role = localStorage.getItem('role');
    console.log("🟡 Loaded role:", this.role);

    // ✅ Load available reclamations from the backend
    this.apiService.getReclamations().subscribe({
      next: (data: any) => {
        this.reclamations = data;
      },
      error: (error) => {
        console.error('Error loading reclamations', error);
      }
    });
  }

  // ✅ Set selected complaint text based on chosen code
  onCodeSelected() {
    const reclamation = this.reclamations.find(r => r.code_reclamation === this.selectedCode);
    this.selectedText = reclamation ? reclamation.Complaint_Description : '';
  }

  // ✅ Send text to backend for sentiment prediction
  predictSentiment() {
    this.apiService.predictSentiment({ text: this.selectedText }).subscribe({
      next: (response: any) => {
        this.prediction = response.prediction;
      },
      error: (error: any) => {
        console.error('Prediction error', error);
      }
    });
  }

  // ✅ Clear session and redirect to login
  logout() {
    localStorage.clear();
    window.location.href = '/login'; // Or use Angular router if available
  }
}
