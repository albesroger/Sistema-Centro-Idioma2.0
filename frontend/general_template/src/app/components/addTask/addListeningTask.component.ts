import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorsService } from '../../services/errors.service';
import { TaskService } from '../../services/task.service';
import { ListeningTask } from '../../interfaces/task';
import { HttpErrorResponse } from '@angular/common/http';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'add-task',
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './addListeningTask.component.html',
})
export class AddTaskComponent implements OnInit {
  task_type: string = 'listening';
  task_id: number = 0;
  team: string = '';
  name_of_item_writer: string = '';
  date: Date | string = '';

  ////////////////////////
  text_source: string = '';
  authenticity: string = '';
  discourse_type: string = '';
  nature_of_content: string = '';
  grammar: string = '';
  number_of_participants: number = 0;
  speed_of_delivery: string = '';

  ////////////////////////
  comprehensible_cefr_level: string = '';
  where_found: string = '';
  text_input_type: string = '';
  main_topic_area: string = '';
  vocabulary: string = '';
  length_of_input: string = '';
  accents: string = '';
  clarity_of_articulation: string = '';

  ////////////////////////
  task_level_estimated: string = '';

  ///////////////////////
  time_to_do_total_task_minutes: number = 0;
  item_characteristics: string = '';
  test_task: string = '';
  answer_key: string = '';

  ///////////////////////
  comments: string = '';
  feedback_date: string = '';
  feedback_provided_by: string = '';
  feedback_text: string = '';
  feedback_team: string = ''; //  ********ELIMINAR******

  loading: boolean = false;

  constructor(
    private location: Location,
    private toastr: ToastrService,
    private _taskService: TaskService,
    private router: Router,
    private _errorsService: ErrorsService
  ) {}

  ngOnInit(): void {}

  addListeningTask() {
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

    const listeningTask: ListeningTask = {
      task_type: 'listening',
      task_id: this.task_id,
      team: this.team,
      name_of_item_writer: this.name_of_item_writer,
      date: this.date,
      text_source: this.text_source,
      authenticity: this.authenticity,
      discourse_type: this.discourse_type,
      nature_of_content: this.nature_of_content,
      grammar: this.grammar,
      number_of_participants: this.number_of_participants,
      speed_of_delivery: this.speed_of_delivery,
      comprehensible_cefr_level: this.comprehensible_cefr_level,
      where_found: this.where_found,
      text_input_type: this.text_input_type,
      main_topic_area: this.main_topic_area,
      vocabulary: this.vocabulary,
      length_of_input: this.length_of_input,
      accents: this.accents,
      clarity_of_articulation: this.clarity_of_articulation,
      task_level_estimated: this.task_level_estimated,
      time_to_do_total_task_minutes: this.time_to_do_total_task_minutes,
      item_characteristics: this.item_characteristics,
      test_task: this.test_task,
      answer_key: this.answer_key,
      comments: this.comments,
      feedback_date: this.feedback_date,
      feedback_provided_by: this.feedback_provided_by,
      feedback_text: this.feedback_text,
      feedback_team: this.feedback_team,
    };
    this.loading = true;

    this._taskService.addTask(listeningTask).subscribe({
      next: (v) => {
        this.loading = false;
        this.toastr.success(
          `Tarea de ${listeningTask.task_type} agregada correctamente`,
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
