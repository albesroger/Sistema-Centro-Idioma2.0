import { Component, ElementRef, HostListener, signal, viewChild, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgStyle } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, NgStyle],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  constructor(private router: Router) {}

  mytoken = localStorage.getItem('myToken');

  isOpen = signal(false);
  divEl = viewChild<ElementRef>('divEl');
  desplegable = viewChild<ElementRef<HTMLElement>>('desplegable');
  @ViewChild('userButton') userButton!: ElementRef;

  toggleArrow() {
    this.isOpen.update((isOpen) => !isOpen);
    setTimeout(() => {
      this.animationButton();
    }, 0);
  }

  logOut() {
    localStorage.removeItem('myToken');
    this.router.navigate(['/homePage']);
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
    if (!this.desplegable()?.nativeElement.contains(event.target as Node) && this.isOpen()) {
      this.isOpen.set(false);
    }
  }

  calculateDropdownPosition() {
    if (!this.userButton?.nativeElement) return {};
    
    const buttonRect = this.userButton.nativeElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const dropdownWidth = 192; // w-48 = 12rem = 192px
    
    // Calculate right position based on viewport width
    const right = Math.min(
      viewportWidth - buttonRect.right - 10, // 10px from right edge
      viewportWidth - 20 // Leave at least 20px from the right edge
    );
    
    // Position below the button
    const top = buttonRect.bottom + window.scrollY + 4; // 4px offset from button
    
    return {
      top: `${top}px`,
      right: `${Math.max(10, right)}px`,
      minWidth: '12rem',
      maxHeight: 'calc(100vh - ' + (top + 20) + 'px)', // 20px from bottom
      overflowY: 'auto'
    };
  }
}
