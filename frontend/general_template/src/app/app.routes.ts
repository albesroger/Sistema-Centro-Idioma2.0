import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SingInComponent } from './components/singIn/singIn.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { guardGuard } from './utils/guard.guard';
import { InicioPageComponent } from './components/home/inicio_page/inicio_page.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SeeTaskComponent } from './components/seeTask/seeTask.component';
import { AddListeningTaskComponent } from './components/addTask/addListeningTask/addListeningTask.component';
import { AddReadingTaskComponent } from './components/addTask/addReadingTask/addReadingTask.component';
import { AddSpeakingTaskComponent } from './components/addTask/addSpeakingTask/addSpeakingTask.component';
import { AddWritingTaskComponent } from './components/addTask/addWritingTask/addWritingTask';
import { HomeComponent } from './components/dashboard/home/home.component';
import { CurrentUsersComponent } from './components/dashboard/currentUsers/currentUsers.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'singIn',
    component: SingInComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: HomeComponent },
      { path: 'users', component: CurrentUsersComponent },
      // Agrega más rutas según sea necesario
    ]
  },
  {
    path: 'addListeningTask',
    component: AddListeningTaskComponent,
    canActivate: [guardGuard],
  },
  {
    path: 'addReadingTask',
    component: AddReadingTaskComponent,
    canActivate: [guardGuard],
  },
  {
    path: 'addSpeakingTask',
    component: AddSpeakingTaskComponent,
    canActivate: [guardGuard],
  },
  {
    path: 'addWritingTask',
    component: AddWritingTaskComponent,
    canActivate: [guardGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [guardGuard],
  },
  {
    path: 'seeTask',
    component: SeeTaskComponent,
    canActivate: [guardGuard],
  },
  {
    path: 'maintenance',
    component: MaintenanceComponent,
  },
  {
    path: 'errorPage',
    component: ErrorPageComponent,
  },
  {
    path: 'homePage',
    component: InicioPageComponent,
    canActivate: [guardGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: '**',
    redirectTo: 'errorPage',
  },
];
