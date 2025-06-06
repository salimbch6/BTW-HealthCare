import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';
  showCamera: boolean = false;
  loading: boolean = false;

  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;

  constructor(private apiService: ApiService, private router: Router) {}

  // 🔐 Login classique (formulaire)
  login() {
    this.apiService.login({ username: this.username, password: this.password }).subscribe({
      next: (res: any) => {
        localStorage.setItem('user', res.username);
        localStorage.setItem('role', res.role);
  
        // 🚀 Redirect based on role
        if (res.role === 'admin') {
          this.router.navigate(['/home-admin']);
        } else if (res.role === 'head') {
          this.router.navigate(['/home-head']);
        } else {
          this.router.navigate(['/home']); // optional fallback
        }
      },
      error: () => {
        this.error = 'Invalid username or password';
      }
    });
  }
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  

  // 📸 Démarrer la caméra
  toggleCamera() {
    this.error = '';
    this.showCamera = true;
    this.loading = true;

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      const video = this.videoRef.nativeElement;
      video.srcObject = stream;
      video.play();

      const interval = setInterval(() => {
        this.autoCapture().then(success => {
          if (success) {
            clearInterval(interval);
            this.stopCamera();
          }
        });
      }, 2000);

      setTimeout(() => {
        if (this.loading) {
          clearInterval(interval);
          this.stopCamera();
          this.error = 'Face not recognized – timeout';
        }
      }, 30000);

    }).catch((err) => {
      console.error('Erreur caméra :', err);
      this.error = 'Erreur d’accès à la caméra';
      this.loading = false;
    });
  }

  // 🛑 Stopper la caméra
  stopCamera() {
    const video = this.videoRef?.nativeElement;
    const stream = video?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    video.srcObject = null;
    this.showCamera = false;
    this.loading = false;
  }

  // 📤 Capturer et envoyer à l’API de login facial
  async autoCapture(): Promise<boolean> {
    const video = this.videoRef.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
  
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL('image/jpeg');
  
    try {
      const res: any = await this.apiService.faceLogin(base64Image).toPromise();
      console.log("✅ Réponse FaceLogin :", res);
  
      if (res?.username && res?.role) {
        localStorage.setItem('user', res.username);
        localStorage.setItem('role', res.role);
  
        if (res.role === 'admin') {
          this.router.navigate(['/home-admin']);
        } else if (res.role === 'head') {
          this.router.navigate(['/home-head']);
        } else {
          this.router.navigate(['/home']);
        }
  
        return true;
      } else {
        this.error = 'Face not recognized.';
        this.stopCamera();
        return false;
      }
  
    } catch (err) {
      console.error('❌ Erreur faceLogin :', err);
      this.error = 'Face not recognized.';
      this.stopCamera();
      return false;
    }
  }

}
