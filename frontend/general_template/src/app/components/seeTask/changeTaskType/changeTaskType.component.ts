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

  TaskItem = [
    {
      title: 'Listening Task',
      ariaHidden: 'true',
      xlmsn: 'http://www.w3.org/2000/svg',
      fill: 'currentColor',
      path: 'M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z',
    },
    {
      title: 'Listening Task',
      ariaHidden: 'true',
      xlmsn: 'http://www.w3.org/2000/svg',
      fill: 'currentColor',
      path: 'M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z',
    },
    {
      title: 'Listening Task',
      ariaHidden: 'true',
      xlmsn: 'http://www.w3.org/2000/svg',
      fill: 'currentColor',
      path: 'M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z',
    },
    {
      title: 'Listening Task',
      ariaHidden: 'true',
      xlmsn: 'http://www.w3.org/2000/svg',
      fill: 'currentColor',
      path: 'M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z',
    },
  ];

  constructor() {}

  changeTaskType(taskType: string) {
    this.seeTask.set(taskType);
    console.log(this.seeTask());
  }

  changeActivate() {
    this.isActivate.set(!this.isActivate());
  }
}
