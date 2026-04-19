import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { ChangeTaskTypeComponent } from '../changeTaskType/changeTaskType.component';
import { SeeTasksComponent } from '../seeListeningTasks/seeListeningTasks.component';
import { SeeReadingTasks } from '../seeReadingTasks/seeReadingTasks.component';
import { SeeSpeakingTasks } from '../seeSpeakingTasks/seeSpeakingTasks';
import { SeeWritingTasks } from '../seeWritingTasks/seeWritingTasks';
import { TaskTypeService } from '../../../services/changeTaskType.service';

@Component({
  selector: 'app-tabla-task',
  imports: [
    ChangeTaskTypeComponent,
    SeeTasksComponent,
    SeeReadingTasks,
    SeeSpeakingTasks,
    SeeWritingTasks,
  ],
  templateUrl: './tablaTask.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablaTask {
  taskType: Signal<string>;

  constructor(private taskTypeService: TaskTypeService) {
    this.taskType = this.taskTypeService.getCurrentType();
  }
}
