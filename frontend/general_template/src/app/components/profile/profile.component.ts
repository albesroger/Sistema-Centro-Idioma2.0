import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../services/userService.service';
import { User } from '../../interfaces/user';
import { TitleCasePipe, Location } from '@angular/common';
import { UpperCasePipe } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { Task } from '../../interfaces/task';
import { TaskService } from '../../services/task.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [TitleCasePipe, UpperCasePipe, NavbarComponent],
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
    this.fill_out_tasks();
  }

  loadUser(): void {
    this.loading = true;
    this.error = null;

    this._userService.loadUser().subscribe({
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

  fill_out_tasks() {
    this._taskService
      .getTask()
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
      .subscribe((data) => {
        this.taskForUser = data;
      });
  }

  goBack(): void {
    this.location.back();
  }
}
