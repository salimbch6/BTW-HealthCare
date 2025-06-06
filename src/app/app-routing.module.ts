import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { HomeHeadComponent } from './home-head/home-head.component';
import { PatientstayComponent } from './patientstay/patientstay.component';
import { SentimentComponent } from './sentiment/sentiment.component';
import { StrokeComponent } from './stroke/stroke.component';
import { ProstateComponent } from './prostate/prostate.component';
import { TrackingComponent } from './tracking/tracking.component';
import { BreastComponent } from './breast/breast.component';
import { ContactComponent } from './contact/contact.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { LandingPageComponent } from './landing-page/landing-page.component'; 


const routes: Routes = [
  { path: '', component: LandingPageComponent }, // Show landing page on root

  { path: 'login', component: LoginComponent },

  { path: 'home-admin', component: HomeAdminComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'home-head', component: HomeHeadComponent, canActivate: [AuthGuard], data: { roles: ['head'] } },

  { path: 'contact', component: ContactComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'head'] } },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'head'] } },

  // 🧠 Prediction Models
  { path: 'patientstay', component: PatientstayComponent, canActivate: [AuthGuard], data: { roles: ['admin', 'head'] } },
  { path: 'sentiment', component: SentimentComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
  { path: 'stroke', component: StrokeComponent, canActivate: [AuthGuard], data: { roles: ['head'] } },
  { path: 'prostate', component: ProstateComponent, canActivate: [AuthGuard], data: { roles: ['head'] } },
  { path: 'breast', component: BreastComponent, canActivate: [AuthGuard], data: { roles: ['head'] } },

  // 🎥 Admin-only Tracking
  { path: 'tracking', component: TrackingComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },

  // fallback
  { path: '**', redirectTo: '' } // redirect unknown paths to landing page
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
