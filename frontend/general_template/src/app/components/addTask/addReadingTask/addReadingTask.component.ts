import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReadingTask } from '../../../interfaces/task';
import { ErrorsService } from '../../../services/errors.service';
import { TaskService } from '../../../services/task.service';
import { NavbarComponent } from '../../navbar/navbar.component';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-reading-task',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './addReadingTask.component.html',
})
export class AddReadingTaskComponent {
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

  loading: boolean = false;

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

    const readingTask: ReadingTask = {
      task_type: 'reading',
      task_id: this.task_id,
      team: this.team,
      name_of_item_writer: this.name_of_item_writer,
      date: this.date,

      text_source: this.text_source,
      where_found: this.where_found,
      authenticity: this.authenticity,
      text_type: this.text_type,
      form: this.form,
      discourse_type: this.discourse_type,
      main_topic_area: this.main_topic_area,
      nature_of_content: this.nature_of_content,
      vocabulary: this.vocabulary,
      grammar: this.grammar,
      number_of_words: this.number_of_words,
      comprehensible_cefr_level: this.comprehensible_cefr_level,

      item_characteristics: this.item_characteristics,

      time_to_do_total_task_minutes: this.time_to_do_total_task_minutes,
      task_level_estimated: this.task_level_estimated,

      test_task: this.test_task,

      answer_key: this.answer_key,

      comments: this.comments,

      feedback_provided_by: this.feedback_provided_by,
      feedback_team: this.feedback_team,
      feedback_date: this.feedback_date,

      feedback_text: this.feedback_text,
    };
    this.loading = true;

    this._taskService.addTask(readingTask).subscribe({
      next: (v) => {
        this.loading = false;
        this.toastr.success(
          `Tarea de ${readingTask.task_type} agregada correctamente`,
          'Exito'
        );
        this.router.navigate(['/seeTask']);
      },
      error: (e: HttpErrorResponse) => {
        this.loading = false;
        this._errorsService.messageError(e);
      },
      complete: () => console.info('complete'),
    });
  }
  goBack(): void {
    this.location.back();
  }
}
