import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb';
import { NavbarComponent } from '../../navbar/navbar.component';
import { Task } from '../../../interfaces/task';

@Component({
  selector: 'app-review-task',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reviewTask.component.html',
})
export class ReviewTaskComponent implements OnInit {
  loading = signal(true);
  taskDetails: any = null;
  feedback_provided_by = '';
  feedback_team = '';
  feedback_text = '';
  feedback_date = '';
  private readonly excludedKeys = new Set([
    'feedback_provided_by',
    'feedback_team',
    'feedback_text',
    'feedback_date',
    'createdAt',
    'updatedAt',
    'speaking',
    'listening',
    'reading',
    'writing',
  ]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTask(id);
    }
  }

  loadTask(id: string) {
    this.loading.set(true);
    this.taskService.getTaskById(id).subscribe({
      next: (task: any) => {
        const subtype = task[task.task_type] ?? {};
        this.taskDetails = { ...task, ...subtype };
        this.feedback_provided_by = this.taskDetails.feedback_provided_by || '';
        this.feedback_team = this.taskDetails.feedback_team || '';
        this.feedback_text = this.taskDetails.feedback_text || '';
        this.feedback_date = this.taskDetails.feedback_date
          ? String(this.taskDetails.feedback_date).slice(0, 10)
          : '';
        this.loading.set(false);
      },
      error: () => {
        this.toastr.error('No se pudo cargar la tarea');
        this.loading.set(false);
      },
    });
  }

  displayEntries() {
    if (!this.taskDetails) return [];
    return Object.entries(this.taskDetails)
      .filter(
        ([key, value]) =>
          !this.excludedKeys.has(key) &&
          value !== null &&
          value !== undefined &&
          value !== ''
      )
      .map(([key, value]) => ({
        key,
        label: this.formatLabel(key),
        value: this.formatValue(value),
      }));
  }

  private formatLabel(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/task id/i, 'ID')
      .replace(/\b\w/g, (m) => m.toUpperCase());
  }

  private formatValue(value: unknown): string {
    if (value instanceof Date) {
      return value.toISOString().slice(0, 10);
    }
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      return value.slice(0, 10);
    }
    return String(value);
  }

  saveFeedback() {
    if (!this.taskDetails) return;
    const payload: Task = {
      ...this.taskDetails,
      task_type: this.taskDetails.task_type,
      task_id: this.taskDetails.task_id,
      feedback_provided_by: this.feedback_provided_by,
      feedback_team: this.feedback_team,
      feedback_text: this.feedback_text,
      feedback_date: this.feedback_date || new Date().toISOString().slice(0, 10),
    } as Task;

    this.taskService.updateTask(payload).subscribe({
      next: () => this.toastr.success('Feedback guardado'),
      error: () => this.toastr.error('No se pudo guardar el feedback'),
    });
  }

  goBack() {
    this.router.navigate(['/seeTask']);
  }
}
