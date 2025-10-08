import { Component, signal } from '@angular/core';
import {} from '../../../../../node_modules/@angular/router/router_module.d-Bx9ArA6K';

@Component({
  selector: 'app-change-task-type',
  imports: [],
  templateUrl: './changeTaskType.component.html',
})
export class ChangeTaskTypeComponent {
  seeTask = signal('listening');
  constructor() {}

  changeTaskType(taskType: string) {
    this.seeTask.set(taskType);
    console.log(this.seeTask());
  }
}
