import { Component, OnInit } from '@angular/core';
import { ReadingTask } from '../../../interfaces/task';
import { TaskService } from '../../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-see-reading-tasks',
  imports: [CommonModule],
  templateUrl: './seeReadingTasks.component.html',
})
export class SeeReadingTasks implements OnInit {
  listTasks: ReadingTask[] = [];

  selectedItems: ReadingTask[] = [];
  allSelected = false;

  constructor(
    private _taskService: TaskService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getReadingTasks();
  }

  getReadingTasks() {
    this._taskService
      .getTaskByTypeRe('reading')
      .pipe(
        map((item) =>
          item.map((value) => {
            const readingData = (value as any).reading || {};
            return {
              ...value,
              ...readingData,
              date: String(value.date).slice(0, 10),
            };
          })
        )
      )
      .subscribe((data) => {
        this.listTasks = data;
        this.selectedItems = [];
        this.allSelected = false;
      });
  }

  deleteTask(id: number) {
    this._taskService.deleteTask(id).subscribe({
      next: (data) => {
        this.getReadingTasks();
        this.toastr.success('Task eliminada');
      },
      error: (error) => {
        this.toastr.error('Error al eliminar Task');
      },
    });
    this.getReadingTasks();
  }

  // ⭐ NUEVO: manejar selección individual
  toggleSelection(item: ReadingTask) {
    const index = this.selectedItems.indexOf(item);

    if (index === -1) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems.splice(index, 1);
    }

    this.allSelected = this.selectedItems.length === this.listTasks.length;
  }

  toggleSelectAll(event: any) {
    this.allSelected = event.target.checked;

    if (this.allSelected) {
      this.selectedItems = [...this.listTasks];
    } else {
      this.selectedItems = [];
    }
  }

  deleteSelected() {
    if (this.selectedItems.length === 0) return;

    const ids = this.selectedItems.map((i) => i.task_id);

    ids.forEach((id) => {
      this._taskService.deleteTask(id).subscribe({
        next: () => {},
        error: () => this.toastr.error('Error eliminando una tarea'),
      });
    });

    this.toastr.success('Tareas eliminadas');
    this.getReadingTasks();
  }
}
