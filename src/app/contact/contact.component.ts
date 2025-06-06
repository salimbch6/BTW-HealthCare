import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
declare var google: any;


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, AfterViewInit {
  username: string | null = '';
  role: string | null = '';
  

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('user');
    this.role = localStorage.getItem('role');

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

  // ✅ Add Google Map after view is rendered
  ngAfterViewInit(): void {
    if (!(window as any).google) {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDvO4FEyHlF4Y1E8fdciZ6vW9GDCUsFA0k&callback=initMap';
      script.async = true;
      script.defer = true;
      (window as any).initMap = () => this.initMap();
      document.body.appendChild(script);
    } else {
      this.initMap();
    }
  }

  private initMap(): void {
    const map = new google.maps.Map(document.getElementById('myMap') as HTMLElement, {
      center: { lat: 36.8065, lng: 10.1815 },
      zoom: 12
    });

    new google.maps.Marker({
      position: { lat: 36.8065, lng: 10.1815 },
      map,
      title: 'Clinic Location'
    });
  }
}
