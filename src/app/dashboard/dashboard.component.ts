import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  username: string | null = '';
  role: string | null = '';
  powerBIUrl!: SafeResourceUrl; // 👈 added

  constructor(
    private apiService: ApiService,
    private router: Router,
    private sanitizer: DomSanitizer // 👈 added
  ) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('user');
    this.role = localStorage.getItem('role');
  
    let baseUrl = '';
  
    if (this.role === 'admin') {
      // 👉 Admin public embed report
      baseUrl = 'https://app.powerbi.com/reportEmbed?reportId=868f213c-b5f3-434f-8710-1d1c5f02b13b&autoAuth=true&ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730';
    } else if (this.role === 'head') {
      // 👉 Doctor/head public embed report
      baseUrl ="https://app.powerbi.com/reportEmbed?reportId=5d13d479-5de5-4006-9e33-729ddea14a1f&autoAuth=true&ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730" ;
    }
  
    this.powerBIUrl = this.sanitizer.bypassSecurityTrustResourceUrl(baseUrl);
  }
  
  

  ngAfterViewInit(): void {
    setTimeout(() => {
      const preloader = document.querySelector('.preloader') as HTMLElement;
      if (preloader) {
        preloader.style.display = 'none';
      }
    }, 300);
  }

  logout(): void {
    this.apiService.logout().subscribe(() => {
      localStorage.clear();
      this.router.navigate(['/login']);
    });
  }
}