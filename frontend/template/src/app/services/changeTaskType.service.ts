// task-type.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TaskTypeService {
  private currentTaskType = signal<string>('listening');
  private currentSearchQuery = signal<string>('');

  getCurrentType() {
    return this.currentTaskType.asReadonly();
  }

  setTaskType(type: 'listening' | 'reading' | 'speaking' | 'writing') {
    this.currentTaskType.set(type);
  }

  getSearchQuery() {
    return this.currentSearchQuery.asReadonly();
  }

  setSearchQuery(query: string) {
    this.currentSearchQuery.set(query);
  }

  clearSearchQuery() {
    this.currentSearchQuery.set('');
  }
}
