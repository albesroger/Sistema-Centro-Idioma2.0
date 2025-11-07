import { Component, Signal } from '@angular/core';
import { SeeTasksComponent } from './seeListeningTasks/seeListeningTasks.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { SeeReadingTasks } from './seeReadingTasks/seeReadingTasks.component';
import { ChangeTaskTypeComponent } from './changeTaskType/changeTaskType.component';
import { TaskTypeService } from '../../services/changeTaskType.service';

@Component({
  selector: 'app-see-task',
  imports: [
    SeeTasksComponent,
    NavbarComponent,
    DropdownComponent,
    SeeReadingTasks,
    ChangeTaskTypeComponent,
  ],
  templateUrl: './seeTask.component.html',
})
export class SeeTaskComponent {
  taskType: Signal<string>;

  constructor(private taskTypeService: TaskTypeService) {
    this.taskType = this.taskTypeService.getCurrentType();
  }
}
