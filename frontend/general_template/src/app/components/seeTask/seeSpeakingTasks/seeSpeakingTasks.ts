import { Component, OnInit } from '@angular/core';
import { SpeakingTask } from '../../../interfaces/task';
import { TaskService } from '../../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-see-speaking-tasks',
  imports: [CommonModule],
  templateUrl: './seeSpeakingTasks.html',
})
export class SeeSpeakingTasks implements OnInit {
  listTasks: SpeakingTask[] = [];

  selectedItems: SpeakingTask[] = [];
  allSelected = false;

  constructor(
    private _taskService: TaskService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getSpeakingTasks();
  }

  getSpeakingTasks() {
    this._taskService
      .getTaskByTypeSp('speaking')
      .pipe(
        map((item) =>
          item.map((value) => {
            const speakingData = (value as any).speaking || {};
            return {
              ...value,
              ...speakingData,
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
        this.getSpeakingTasks();
        this.toastr.success('Task eliminada');
      },
      error: (error) => {
        this.toastr.error('Error al eliminar Task');
      },
    });
    this.getSpeakingTasks();
  }

  toggleSelection(item: SpeakingTask) {
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

    // Backend: eliminar cada una (puedo ayudarte a crear un endpoint deleteMany)
    ids.forEach((id) => {
      this._taskService.deleteTask(id).subscribe({
        next: () => {},
        error: () => this.toastr.error('Error eliminando una tarea'),
      });
    });

    this.toastr.success('Tareas eliminadas');
    this.getSpeakingTasks();
  }
}
