import { Component, Signal, signal } from '@angular/core';
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
  searchQuery = signal('');
  activeSearchQuery: Signal<string>;

  constructor(private taskTypeService: TaskTypeService) {
    this.activeSearchQuery = this.taskTypeService.getSearchQuery();
  }

  setTaskType(type: 'listening' | 'reading' | 'speaking' | 'writing') {
    this.taskType.set(type);
    this.taskTypeService.setTaskType(type);
  }

  applySearch() {
    this.taskTypeService.setSearchQuery(this.searchQuery().trim());
  }

  clearSearch() {
    this.searchQuery.set('');
    this.taskTypeService.clearSearchQuery();
  }

  onSearchInput(value: string) {
    this.searchQuery.set(value);
  }

  changeActivate() {
    this.isActivate.set(!this.isActivate());
  }
}
