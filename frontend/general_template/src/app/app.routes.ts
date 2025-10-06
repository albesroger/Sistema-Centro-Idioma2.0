import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SingInComponent } from './components/singIn/singIn.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { guardGuard } from './utils/guard.guard';
import { AddTaskComponent } from './components/addTask/addTask.component';
import { InicioPageComponent } from './components/home/inicio_page/inicio_page.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SeeTaskComponent } from './components/seeTask/seeTask.component';

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
    data: {
      roles: ['admin'],
    },
    component: DashboardComponent,
    canActivate: [guardGuard],
  },
  {
    path: 'addTask',
    component: AddTaskComponent,
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
    //canActivate: [guardGuard],
  },
  {
    path: '',
    redirectTo: 'homePage',
    pathMatch: 'full',
  },

  {
    path: '**',
    redirectTo: 'errorPage',
  },
];
