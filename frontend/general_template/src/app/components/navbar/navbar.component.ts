import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  computed,
  signal,
  viewChild,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgStyle } from '@angular/common';
import { gsap } from 'gsap';
import { SidebarService } from '../../services/sidebar.service';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../interfaces/notification';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, NgStyle, CommonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  constructor(
    private router: Router,
    private sidebarService: SidebarService,
    private notificationService: NotificationService
  ) {
    this.loadTheme();
  }

  mytoken = localStorage.getItem('myToken');

  isOpen = signal(false);
  showNotifications = signal(false);
  divEl = viewChild<ElementRef>('divEl');
  desplegable = viewChild<ElementRef<HTMLElement>>('desplegable');
  @ViewChild('userButton') userButton!: ElementRef;
  @ViewChild('notifButton') notifButton!: ElementRef;
  @ViewChild('notifPanel') notifPanel!: ElementRef;
  isDarkMode = false;
  notifications = signal<Notification[]>([]);
  unreadCount = computed(
    () => this.notifications().filter((n) => n.status === 'unread').length
  );

  ngOnInit(): void {
    if (this.mytoken) {
      this.loadNotifications();
    }
  }

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

  loadNotifications() {
    this.notificationService.getMyNotifications().subscribe({
      next: (data) => this.notifications.set(data),
      error: (err) => console.error('Error cargando notificaciones', err),
    });
  }

  toggleNotifications() {
    if (!this.mytoken) return;
    this.showNotifications.update((v) => !v);
    if (this.showNotifications()) {
      this.loadNotifications();
    }
  }

  markAsRead(id: number) {
    this.notificationService.markAsRead(id).subscribe({
      next: () => this.loadNotifications(),
      error: (err) => console.error('Error marcando notificación', err),
    });
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe({
      next: () => this.loadNotifications(),
      error: (err) => console.error('Error marcando todas', err),
    });
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
    if (
      this.showNotifications() &&
      !this.notifButton?.nativeElement.contains(event.target as Node) &&
      !this.notifPanel?.nativeElement.contains(event.target as Node)
    ) {
      this.showNotifications.set(false);
    }
  }

  calculateDropdownPosition(target?: HTMLElement) {
    const anchor = target ?? this.userButton?.nativeElement ?? this.notifButton?.nativeElement;
    if (!anchor) return {};

    const buttonRect = anchor.getBoundingClientRect();
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
