import { Component, signal } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-change-task-type',
  imports: [NgClass],
  templateUrl: './changeTaskType.component.html',
})
export class ChangeTaskTypeComponent {
  seeTask = signal('listening');
  isActivate = signal(false);

  constructor() {}

  changeTaskType(taskType: string) {
    this.seeTask.set(taskType);
    console.log(this.seeTask());
  }
  changeActivate() {
    this.isActivate.set(!this.isActivate());
  }
}
