import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { HttpClient } from '@angular/common/http';


declare var $: any;

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css']
})
export class HomeAdminComponent implements OnInit, AfterViewInit {
  username: string | null = '';
   role: string | null = '';
   isSidebarCollapsed = false;
 
   articles: any[] = [];
   visibleArticles: any[] = [];
   loading = false;
 
   currentIndex = 0;
 intervalId: any;
 isPaused = false;
   constructor(
     private apiService: ApiService,
     private router: Router,
     private http: HttpClient
   ) {}
 
   ngOnInit(): void {
     this.username = localStorage.getItem('user');
     this.role = localStorage.getItem('role');
 
     setTimeout(() => {
       const preloader = document.querySelector('.preloader') as HTMLElement;
       if (preloader) {
         preloader.style.display = 'none';
       }
     }, 300);
 
     this.loadArticles();
   }
 
   ngAfterViewInit(): void {
     const script = document.createElement('script');
     script.src = 'https://www.chatbase.co/embed.min.js';
     script.id = 'MsuYO9cRf_wRFOWFwHelF';
     script.setAttribute('domain', 'www.chatbase.co');
     document.body.appendChild(script);
   }
 
   toggleSidebar(): void {
     this.isSidebarCollapsed = !this.isSidebarCollapsed;
   }
 
   logout(): void {
     this.apiService.logout().subscribe(() => {
       localStorage.clear();
       this.router.navigate(['/login']);
     });
   }
 
   refreshArticles(): void {
     this.stopAutoRotate();
     this.loadArticles();
   }
   private stopAutoRotate(): void {
   if (this.intervalId) {
     clearInterval(this.intervalId);
     this.intervalId = null;
   }
 }
 
 
   private loadArticles(): void {
     this.loading = true;
this.http.get<any[]>('http://localhost:5000/api/articles_admin').subscribe({
       next: (data) => {
         this.articles = data;
         this.updateVisibleArticles();
         this.startAutoRotate();
         this.loading = false;
       },
       error: (error) => {
         console.error('Error loading articles:', error);
         this.loading = false;
       }
     });
   }
 
   private updateVisibleArticles(): void {
     const count = 3;
     const end = this.currentIndex + count;
     const total = this.articles.length;
 
     if (total === 0) {
       this.visibleArticles = [];
     } else {
       this.visibleArticles = this.articles.slice(this.currentIndex, end);
 
       if (this.visibleArticles.length < count && total > 0) {
         // wrap-around
         this.visibleArticles = [
           ...this.visibleArticles,
           ...this.articles.slice(0, count - this.visibleArticles.length)
         ];
       }
     }
   }
 
  private startAutoRotate(): void {
   this.intervalId = setInterval(() => {
     if (!this.isPaused && this.articles.length > 0) {
       this.currentIndex = (this.currentIndex + 3) % this.articles.length;
       this.updateVisibleArticles();
     }
   }, 5000);
 }
 
 pauseRotation(): void {
   this.isPaused = true;
 }
 
 resumeRotation(): void {
   this.isPaused = false;
 }
 slideDirection: string = '';
 
 nextSlide(): void {
   this.stopAutoRotate();
   this.slideDirection = 'slide-left';
   this.currentIndex = (this.currentIndex + 3) % this.articles.length;
   this.updateVisibleArticles();
   this.resetSlideDirection();
   this.startAutoRotate();
 }
 
 prevSlide(): void {
   this.stopAutoRotate();
   this.slideDirection = 'slide-right';
   this.currentIndex =
     (this.currentIndex - 3 + this.articles.length) % this.articles.length;
   this.updateVisibleArticles();
   this.resetSlideDirection();
   this.startAutoRotate();
 }
 
 resetSlideDirection(): void {
   setTimeout(() => (this.slideDirection = ''), 500);
 }
 
 
 }