import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb";

@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent, RouterOutlet, SidebarComponent, BreadcrumbComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}
