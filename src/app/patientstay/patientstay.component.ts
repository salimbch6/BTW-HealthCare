import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-patientstay',
  templateUrl: './patientstay.component.html',
  styleUrls: ['./patientstay.component.css']
})
export class PatientstayComponent implements OnInit, AfterViewInit {
  username: string | null = '';
  role: string | null = '';
  homeLink: string = '/home';

  formData: { [key: string]: any } = {
    AgeGroup: '',
    Gender: '',
    AdmissionType: '',
    CareUnit: '',
    HadDiabetes: '',
    HadStroke: '',
    DifficultyWalking: '',
    CovidPos: '',
    procedure_cost: null,
    medication_cost: null,
    lab_test_cost: null
  };

  prediction: number | null = null;
  showResult: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('user');
    this.role = localStorage.getItem('role');

    if (this.role === 'admin') {
      this.homeLink = '/home-admin';
    } else if (this.role === 'head') {
      this.homeLink = '/home-head';
    } else {
      this.homeLink = '/home';
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.style.display = 'none';
      }
    }, 300); // délai optionnel pour un effet de transition
  }

  logout(): void {
    this.apiService.logout().subscribe(() => {
      localStorage.clear();
      this.router.navigate(['/login']);
    });
  }

  predictStay() {
    if (this.isFormValid()) {
      console.log('📤 Sending form data:', this.formData);

      this.apiService.predictPatientStay(this.formData).subscribe({
        next: (response) => {
          console.log('📦 Response from API:', response);

          if (response && typeof response.prediction === 'number') {
            this.prediction = response.prediction;
            this.showResult = true;
          } else {
            console.error('❌ Invalid prediction format:', response);
            this.prediction = null;
            this.showResult = false;
          }
        },
        error: (error) => {
          console.error('❌ API Error:', error);
          this.prediction = null;
          this.showResult = false;
        }
      });
    } else {
      alert('Please fill all required fields correctly.');
    }
  }

  isFormValid(): boolean {
    const requiredFields = [
      'AgeGroup', 'Gender', 'AdmissionType', 'CareUnit',
      'HadDiabetes', 'HadStroke', 'DifficultyWalking', 'CovidPos'
    ];

    return requiredFields.every(field => this.formData[field] !== '') &&
      this.formData['procedure_cost'] !== null &&
      this.formData['medication_cost'] !== null &&
      this.formData['lab_test_cost'] !== null;
  }
}
