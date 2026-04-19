import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SidebarService } from '../../../services/sidebar.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: string | number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [
    { label: 'Home', icon: 'home', route: '/dashboard/inicio' },
    { label: 'User', icon: 'people', route: '/dashboard/users' },
    //{ label: 'Cursos', icon: 'school', route: '/dashboard/courses' },
    //{ label: 'Configuración', icon: 'settings', route: '/dashboard/settings' },
  ];
  isVisible = true;

  constructor(private router: Router, private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.sidebarVisible$.subscribe(
      (visible) => (this.isVisible = visible)
    );
  }

  closeSidebar() {
    this.sidebarService.hideSidebar();
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = (event.target as Window).innerWidth;
    if (width < 1024) {
      this.sidebarService.hideSidebar();
    } else {
      this.sidebarService.showSidebar();
    }
  }
}
