import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';                // 👈 ajouté pour [(ngModel)] dans les formulaires
import { HttpClientModule } from '@angular/common/http';     // 👈 ajouté pour utiliser HttpClient
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { PatientstayComponent } from './patientstay/patientstay.component';
import { SentimentComponent } from './sentiment/sentiment.component';
import { StrokeComponent } from './stroke/stroke.component';
import { AboutComponent } from './pages/about/about.component';
import { ProstateComponent } from './prostate/prostate.component';
import { TrackingComponent } from './tracking/tracking.component';
import { BreastComponent } from './breast/breast.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { HomeHeadComponent } from './home-head/home-head.component';
import { ContactComponent } from './contact/contact.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    PatientstayComponent,
    SentimentComponent,
    StrokeComponent,
    AboutComponent,
    ProstateComponent,
    TrackingComponent,
    BreastComponent,
    AccessDeniedComponent,
    HomeAdminComponent,
    HomeHeadComponent,
    ContactComponent,
    DashboardComponent,
    LandingPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,           // 👈 important pour gérer les inputs [(ngModel)]
    HttpClientModule       // 👈 important pour envoyer/recevoir des requêtes à Flask
  ],
  providers: [],
  bootstrap: [AppComponent]
})


export class AppModule { }
