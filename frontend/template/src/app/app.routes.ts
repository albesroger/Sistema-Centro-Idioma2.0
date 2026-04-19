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
import { ReviewTaskComponent } from './components/seeTask/reviewTask/reviewTask.component';
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
      {
        path: 'inicio',
        component: HomeComponent,
        data: { breadcrumb: 'Control Panel' },
      },
      {
        path: 'users',
        component: CurrentUsersComponent,
        data: { breadcrumb: 'Users' },
      },
    ],
    data: { breadcrumb: 'Dashboard' },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [guardGuard],
    data: { breadcrumb: 'Profile' },
  },
  {
    path: 'seeTask',
    component: SeeTaskComponent,
    canActivate: [guardGuard],
    data: { breadcrumb: 'See Task' },
    children: [
      {
        path: 'addListeningTask',
        component: AddListeningTaskComponent,
        data: { breadcrumb: 'Add Listening Task' },
      },
      {
        path: 'addReadingTask',
        component: AddReadingTaskComponent,
        data: { breadcrumb: 'Add Reading Task' },
      },
      {
        path: 'addSpeakingTask',
        component: AddSpeakingTaskComponent,
        data: { breadcrumb: 'Add Speaking Task' },
      },
      {
        path: 'addWritingTask',
        component: AddWritingTaskComponent,
        data: { breadcrumb: 'Add Writing Task' },
      },
      {
        path: 'review/:id',
        component: ReviewTaskComponent,
        data: { breadcrumb: 'Revisar Tarea' },
      },
    ],
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
    data: { breadcrumb: 'Home' },
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
