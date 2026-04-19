import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListeningTask } from '../../../interfaces/task';
import { TaskService } from '../../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-see-listeningtasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seeListeningTasks.component.html',
})
export class SeeTasksComponent implements OnInit {
  listTasks: ListeningTask[] = [];

  // ⭐ NUEVO: selección múltiple
  selectedItems: ListeningTask[] = [];
  allSelected = false;
  isEditing = false;
  editingTask: ListeningTask | null = null;

  constructor(
    private _taskService: TaskService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.getListeningTasks();
  }

  getListeningTasks() {
    this._taskService
      .getTaskByTypeLi('listening')
      .pipe(
        map((item) =>
          item.map((value) => {
            const listeningData = (value as any).listening || {};
            return {
              ...value,
              ...listeningData,
              date: String(value.date).slice(0, 10),
            };
          }),
        ),
      )
      .subscribe((data) => {
        this.listTasks = data;
        this.selectedItems = [];
        this.allSelected = false;
      });
  }

  deleteTask(id: number) {
    this._taskService.deleteTask(id).subscribe({
      next: () => {
        this.getListeningTasks();
        this.toastr.success('Task eliminada');
      },
      error: () => this.toastr.error('Error al eliminar Task'),
    });
  }

  startEdit(item: ListeningTask) {
    this.editingTask = { ...item };
    this.isEditing = true;
  }

  cancelEdit() {
    this.editingTask = null;
    this.isEditing = false;
  }

  saveEdit() {
    if (!this.editingTask) return;

    const payload: ListeningTask = {
      ...this.editingTask,
      date:
        typeof this.editingTask.date === 'string'
          ? this.editingTask.date.slice(0, 10)
          : String(this.editingTask.date).slice(0, 10),
      task_type: 'listening',
    };

    this._taskService.updateTask(payload).subscribe({
      next: () => {
        this.toastr.success('Task actualizada');
        this.cancelEdit();
        this.getListeningTasks();
      },
      error: () => this.toastr.error('Error al actualizar Task'),
    });
  }

  // ⭐ NUEVO: manejar selección individual
  toggleSelection(item: ListeningTask) {
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
    this.getListeningTasks();
  }
}
