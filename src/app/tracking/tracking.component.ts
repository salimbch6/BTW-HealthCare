import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {
  username: string | null = '';
  role: string | null = '';

  selectedFile: File | null = null;
  isLoading = false;
  videos: string[] = [];

  constructor(private http: HttpClient, private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('user');
    this.role = localStorage.getItem('role');
    this.fetchProcessedVideos();

    // ✅ Fallback timeout in case nothing loads
    setTimeout(() => {
      this.hidePreloader();
    }, 3000); // Max wait time before hiding anyway
  }

  logout(): void {
    this.apiService.logout().subscribe(() => {
      localStorage.clear();
      this.router.navigate(['/login']);
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onUpload(): void {
    if (!this.selectedFile) return;

    this.isLoading = true;

    const formData = new FormData();
    formData.append('video', this.selectedFile);

    this.http.post('http://localhost:5000/', formData).subscribe({
      next: () => {
        this.fetchProcessedVideos();
        this.isLoading = false;
      },
      error: err => {
        console.error('Upload failed:', err);
        this.isLoading = false;
      }
    });
  }

  fetchProcessedVideos(): void {
    this.http.get<string[]>('http://localhost:5000/api/videos').subscribe({
      next: (res) => {
        this.videos = res;
        this.hidePreloader(); // ✅ Hide on success
      },
      error: err => {
        console.error('Failed to fetch videos:', err);
        this.hidePreloader(); // ✅ Still hide on error
      }
    });
  }

  private hidePreloader(): void {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.display = 'none';
    }
  }
}