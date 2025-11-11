import {
  Component,
  ElementRef,
  HostListener,
  signal,
  viewChild,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgStyle } from '@angular/common';
import { gsap } from 'gsap';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, NgStyle, CommonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  constructor(private router: Router, private sidebarService: SidebarService) {
    this.loadTheme();
  }

  mytoken = localStorage.getItem('myToken');

  isOpen = signal(false);
  divEl = viewChild<ElementRef>('divEl');
  desplegable = viewChild<ElementRef<HTMLElement>>('desplegable');
  @ViewChild('userButton') userButton!: ElementRef;
  isDarkMode = false;

  toggleArrow() {
    this.isOpen.update((isOpen) => !isOpen);
    setTimeout(() => {
      this.animationButton();
    }, 0);
  }

  logOut() {
    localStorage.removeItem('myToken');
    this.router.navigate(['/login']);
    window.location.reload();
  }

  animationButton() {
    gsap.from(this.divEl()?.nativeElement, {
      duration: 0.4,
      y: -10,
      opacity: 0,
      ease: 'power1.out',
    });
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (
      !this.desplegable()?.nativeElement.contains(event.target as Node) &&
      this.isOpen()
    ) {
      this.isOpen.set(false);
    }
  }

  calculateDropdownPosition() {
    if (!this.userButton?.nativeElement) return {};

    const buttonRect = this.userButton.nativeElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // Calculate right position based on viewport width
    const right = Math.min(
      viewportWidth - buttonRect.right - 10,
      viewportWidth - 20
    );

    // Position below the button
    const top = buttonRect.bottom + window.scrollY + 4;

    return {
      top: `${top}px`,
      right: `${Math.max(10, right)}px`,
      minWidth: '12rem',
      maxHeight: 'calc(100vh - ' + (top + 20) + 'px)',
      overflowY: 'auto',
    };
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  // Funcionalidad del tema claro / oscuro
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    console.log('Modo actual:', this.isDarkMode);
    const root = document.querySelector('html');
    if (this.isDarkMode) {
      root?.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root?.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  private loadTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    } else {
      this.isDarkMode = false;
      document.documentElement.classList.remove('dark');
    }
  }
}
