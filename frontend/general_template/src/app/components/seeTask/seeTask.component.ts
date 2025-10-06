import { Component, signal } from '@angular/core';
import { SeeTasksComponent } from './seeListeningTasks/seeListeningTasks.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { DropdownComponent } from "../dropdown/dropdown.component";

@Component({
  selector: 'app-see-task',
  imports: [SeeTasksComponent, NavbarComponent, DropdownComponent],
  templateUrl: './seeTask.component.html',
})
export class SeeTaskComponent {
  seeTask = signal('listening');
  constructor() {}

  changeTaskType(taskType: string) {
    this.seeTask.set(taskType);
    console.log(this.seeTask());
  }
}
