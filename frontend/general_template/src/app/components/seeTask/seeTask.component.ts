import { Component, inject, Signal } from '@angular/core';
import { SeeTasksComponent } from './seeListeningTasks/seeListeningTasks.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { SeeReadingTasks } from './seeReadingTasks/seeReadingTasks.component';
import { ChangeTaskTypeComponent } from './changeTaskType/changeTaskType.component';
import { TaskTypeService } from '../../services/changeTaskType.service';
import { SeeWritingTasks } from './seeWritingTasks/seeWritingTasks';
import { SeeSpeakingTasks } from './seeSpeakingTasks/seeSpeakingTasks';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb';
import { Router, RouterModule } from '@angular/router';
import { TablaTask } from './tablaTask/tablaTask';

@Component({
  selector: 'app-see-task',
  imports: [
    NavbarComponent,
    DropdownComponent,
    SeeReadingTasks,
    ChangeTaskTypeComponent,
    SeeWritingTasks,
    SeeSpeakingTasks,
    BreadcrumbComponent,
    RouterModule,
    SeeTasksComponent,
  ],
  templateUrl: './seeTask.component.html',
})
export class SeeTaskComponent {
  taskType: Signal<string>;
  private router = inject(Router);

  constructor(private taskTypeService: TaskTypeService) {
    this.taskType = this.taskTypeService.getCurrentType();
  }

  get mostrarBloqueDeAbajo(): boolean {
    return this.router.url === '/seeTask';
  }
}
