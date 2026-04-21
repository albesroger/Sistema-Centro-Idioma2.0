import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../services/userService.service';
import { User } from '../../interfaces/user';
import { TitleCasePipe, Location } from '@angular/common';
import { UpperCasePipe } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { Task } from '../../interfaces/task';
import { TaskService } from '../../services/task.service';
import { map } from 'rxjs';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  imports: [
    TitleCasePipe,
    UpperCasePipe,
    NavbarComponent,
    BreadcrumbComponent,
    FormsModule,
  ],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  loading = true;
  error: string | null = null;
  taskForUser: Task[] = [];
  currentPassword = '';
  newPassword = '';
  confirmNewPassword = '';
  changingPassword = false;
  showPasswordModal = false;

  constructor(
    private _userService: UserServiceService,
    private location: Location,
    private _taskService: TaskService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.loading = true;
    this.error = null;

    this._userService.loadUser().subscribe({
      next: (userData: User) => {
        this.user = userData;
        this.loading = false;
        this.loadTasksForUser(userData);
      },
      error: (err) => {
        this.error =
          err.error?.message || err.message || 'Error al cargar el perfil';
        this.loading = false;
        this.user = null;
        this.taskForUser = [];
      },
    });
  }

  private loadTasksForUser(user: User): void {
    const identifierParts = [user.name, user.lastname].filter(
      (value) => !!value,
    );
    let identifier = identifierParts.join(' ').trim();

    if (!identifier && user.email) {
      identifier = user.email;
    }

    if (!identifier) {
      this.taskForUser = [];
      return;
    }

    this._taskService
      .getTasksByUser(identifier)
      .pipe(
        map((item) =>
          item.map((value) => {
            const Data = (value as any) || {};
            return {
              ...value,
              Data,
              date: String(value.date).slice(0, 10),
            };
          }),
        ),
      )
      .subscribe({
        next: (data) => {
          this.taskForUser = data;
        },
        error: () => {
          this.taskForUser = [];
        },
      });
  }

  goBack(): void {
    this.location.back();
  }

  changePassword(): void {
    if (
      !this.currentPassword.trim() ||
      !this.newPassword.trim() ||
      !this.confirmNewPassword.trim()
    ) {
      this.toastr.warning('Completa todos los campos de contraseña');
      return;
    }

    if (this.newPassword.length < 6) {
      this.toastr.warning(
        'La nueva contraseña debe tener al menos 6 caracteres',
      );
      return;
    }

    if (this.newPassword !== this.confirmNewPassword) {
      this.toastr.warning('La confirmación de contraseña no coincide');
      return;
    }

    this.changingPassword = true;

    this._userService
      .changePassword(this.currentPassword, this.newPassword)
      .subscribe({
        next: () => {
          this.toastr.success('Contraseña actualizada correctamente');
          this.resetPasswordForm();
          this.closePasswordModal();
          this.changingPassword = false;
        },
        error: (err) => {
          const msg = err?.error?.msg || 'No se pudo actualizar la contraseña';
          this.toastr.error(msg);
          this.changingPassword = false;
        },
      });
  }

  openPasswordModal(): void {
    this.showPasswordModal = true;
  }

  closePasswordModal(): void {
    this.showPasswordModal = false;
    this.resetPasswordForm();
  }

  resetPasswordForm(): void {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmNewPassword = '';
  }
}
