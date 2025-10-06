import { Component } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  imports: [],
  templateUrl: './dropdown.component.html',
})
export class DropdownComponent {
  isDropdownVisible = false;

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;

    const dropdown = document.querySelector('.absolute');

    if (this.isDropdownVisible) {
      // Animación para mostrar el dropdown
      gsap.fromTo(
        dropdown,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3 }
      );
    } else {
      // Animación para ocultar el dropdown
      gsap.to(dropdown, { opacity: 0, y: -10, duration: 0.3 });
    }
  }
}
