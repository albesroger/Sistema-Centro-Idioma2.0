import { Component, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { TaskTypeService } from '../../../services/changeTaskType.service';

@Component({
  selector: 'app-change-task-type',
  imports: [NgClass],
  templateUrl: './changeTaskType.component.html',
})
export class ChangeTaskTypeComponent {
  isActivate = signal(false);
  taskType = signal<string>('listening');

  constructor(private taskTypeService: TaskTypeService) {}

  setTaskType(type: 'listening' | 'reading' | 'speaking' | 'writing') {
    this.taskType.set(type);
    this.taskTypeService.setTaskType(type);
  }

  changeActivate() {
    this.isActivate.set(!this.isActivate());
  }
}
