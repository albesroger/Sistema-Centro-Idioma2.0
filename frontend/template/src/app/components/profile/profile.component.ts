import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../services/userService.service';
import { User } from '../../interfaces/user';
import { TitleCasePipe, Location } from '@angular/common';
import { UpperCasePipe } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { Task } from '../../interfaces/task';
import { TaskService } from '../../services/task.service';
import { map } from 'rxjs';
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb";

@Component({
  selector: 'app-profile',
  imports: [TitleCasePipe, UpperCasePipe, NavbarComponent, BreadcrumbComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  loading = true;
  error: string | null = null;
  taskForUser: Task[] = [];

  constructor(
    private _userService: UserServiceService,
    private location: Location,
    private _taskService: TaskService
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
      (value) => !!value
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
          })
        )
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
}
