import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { SpeakingTask } from '../../../interfaces/task';
import { ErrorsService } from '../../../services/errors.service';
import { TaskService } from '../../../services/task.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-speaking-task',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './addSpeakingTask.component.html',
})
export class AddSpeakingTaskComponent implements OnInit {
  task_type: string = 'speaking';
  task_id: number = 0;
  team: string = '';
  name_of_item_writer: string = '';
  date: Date | string = '';
  status: string = 'pendiente';

  main_topic_area: string = '';
  nature_of_content: string = '';
  expected_vocabulary: string = '';
  prompt_type: string = '';
  time_to_do_total_task_minutes: number = 0;
  task_level_estimated: string = '';
  targetted_outcomes: string = '';
  task_section_task: string = '';
  expected_outcomes: string = '';
  test_task: string = '';

  ///////////////////////
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

  ngOnInit(): void {}

  addSpeakingTask() {
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

    const speakingTask: SpeakingTask = {
      task_type: 'speaking',
      task_id: this.task_id,
      team: this.team,
      name_of_item_writer: this.name_of_item_writer,
      date: this.date,
      status: this.status,

      main_topic_area: this.main_topic_area,
      nature_of_content: this.nature_of_content,
      expected_vocabulary: this.expected_vocabulary,
      prompt_type: this.prompt_type,
      time_to_do_total_task_minutes: this.time_to_do_total_task_minutes,
      task_level_estimated: this.task_level_estimated,
      targetted_outcomes: this.targetted_outcomes,
      task_section_task: this.task_section_task,
      comments: this.comments,
      feedback_provided_by: this.feedback_provided_by,
      feedback_team: this.feedback_team,
      feedback_date: this.feedback_date,
      feedback_text: this.feedback_text,
      expected_outcomes: this.expected_outcomes,
      test_task: this.test_task,
    };
    this.loading = true;

    this._taskService.addTask(speakingTask).subscribe({
      next: (v) => {
        this.loading = false;
        this.toastr.success(
          `Tarea de ${speakingTask.task_type} agregada correctamente`,
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
