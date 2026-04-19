import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { WritingTask } from '../../../interfaces/task';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-see-writing-tasks',
  imports: [CommonModule],
  templateUrl: './seeWritingTasks.html',
})
export class SeeWritingTasks implements OnInit {
  listTasks: WritingTask[] = [];

  selectedItems: WritingTask[] = [];
  allSelected = false;

  constructor(
    private _taskService: TaskService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getWritingTasks();
  }

  getWritingTasks() {
    this._taskService
      .getTaskByTypeWr('writing')
      .pipe(
        map((item) =>
          item.map((value) => {
            const writingData = (value as any).writing || {};
            return {
              ...value,
              ...writingData,
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
        this.getWritingTasks();
        this.toastr.success('Task eliminada');
      },
      error: (error) => {
        this.toastr.error('Error al eliminar Task');
      },
    });
    this.getWritingTasks();
  }

  // ⭐ NUEVO: manejar selección individual
  toggleSelection(item: WritingTask) {
    const index = this.selectedItems.indexOf(item);

    if (index === -1) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems.splice(index, 1);
    }

    this.allSelected = this.selectedItems.length === this.listTasks.length;
  }

  // ⭐ NUEVO: seleccionar/deseleccionar todo
  toggleSelectAll(event: any) {
    this.allSelected = event.target.checked;

    if (this.allSelected) {
      this.selectedItems = [...this.listTasks];
    } else {
      this.selectedItems = [];
    }
  }

  // ⭐ NUEVO: eliminar muchas tareas
  deleteSelected() {
    if (this.selectedItems.length === 0) return;

    const ids = this.selectedItems.map((i) => i.task_id);

    // Backend: eliminar cada una (puedo ayudarte a crear un endpoint deleteMany)
    ids.forEach((id) => {
      this._taskService.deleteTask(id).subscribe({
        next: () => {},
        error: () => this.toastr.error('Error eliminando una tarea'),
      });
    });

    this.toastr.success('Tareas eliminadas');
    this.getWritingTasks();
  }
}
