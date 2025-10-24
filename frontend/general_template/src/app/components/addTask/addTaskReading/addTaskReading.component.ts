import { Component } from '@angular/core';
import { Task } from '../../../interfaces/task';
import { Router } from 'express';
import { ToastrService } from 'ngx-toastr';
import { ErrorsService } from '../../../services/errors.service';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'add-task-reading',
  imports: [],
  templateUrl: './addTaskReading.component.html',
})
export class AddTaskReadingComponent {
  task_type: string = 'reading';
  task_id: number = 0;
  team: string = '';
  name_of_item_writer: string = '';
  date: Date | string = '';

  /////////////////////////
  text_source: string = '';
  where_found: string = '';
  authenticity: string = '';
  text_type: string = '';
  form: string = '';
  discourse_type: string = '';
  main_topic_area: string = '';
  nature_of_content: string = '';
  vocabulary: string = '';
  grammar: string = '';
  number_of_words: number = 0;
  comprehensible_cefr_level: string = '';

  /////////////////////////
  item_characteristics: string = '';

  /////////////////////////
  time_to_do_total_task_minutes: number = 0;
  task_level_estimated: string = '';

  test_task: string = '';

  answer_key: string = '';

  comments: string = '';

  feedback_provided_by: string = '';
  feedback_team: string = '';
  feedback_date: string = '';

  feedback_text: string = '';

  constructor(
    private location: Location,
    private toastr: ToastrService,
    private _taskService: TaskService,
    private router: Router,
    private _errorsService: ErrorsService
  ) {}

  addReadingTask() {
    if (
      (this.task_id == null,
      this.task_type == '',
      this.team == '',
      this.name_of_item_writer == '',
      this.date == '')
    ) {
      this.toastr.error('Por favor, complete todos los campos', 'Error');
      return;
    }
  }
}
