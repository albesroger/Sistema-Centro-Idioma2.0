import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { CurrentUsersComponent } from './currentUsers/currentUsers.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    NavbarComponent,
    RouterOutlet,
    CurrentUsersComponent,
    SidebarComponent,
    SidebarComponent,
    HomeComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}
