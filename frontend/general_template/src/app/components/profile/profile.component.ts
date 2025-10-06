import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../services/userService.service';
import { User } from '../../interfaces/user';
import { TitleCasePipe } from '@angular/common';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [TitleCasePipe, UpperCasePipe],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  loading = true;
  error: string | null = null;

  constructor(private userService: UserServiceService) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.loading = true;
    this.error = null;

    this.userService.loadUser().subscribe({
      next: (userData: User) => {
        this.user = userData;
        this.loading = false;
      },
      error: (err) => {
        this.error =
          err.error?.message || err.message || 'Error al cargar el perfil';
        this.loading = false;
        this.user = null;
      },
    });
  }
}
