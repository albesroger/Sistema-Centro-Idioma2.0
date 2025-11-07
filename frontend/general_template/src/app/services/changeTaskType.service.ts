// task-type.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TaskTypeService {
  private currentTaskType = signal<string>('listening');

  getCurrentType() {
    return this.currentTaskType.asReadonly();
  }

  setTaskType(type: 'listening' | 'reading' | 'speaking' | 'writing') {
    this.currentTaskType.set(type);
  }
}
