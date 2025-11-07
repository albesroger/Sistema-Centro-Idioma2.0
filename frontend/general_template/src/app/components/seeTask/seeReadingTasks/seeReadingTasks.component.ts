import { Component, OnInit } from '@angular/core';
import { ReadingTask } from '../../../interfaces/task';
import { TaskService } from '../../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { error } from 'node:console';
import { request } from 'node:http';
import { map } from 'rxjs';

@Component({
  selector: 'app-see-reading-tasks',
  imports: [],
  templateUrl: './seeReadingTasks.component.html',
})
export class SeeReadingTasks implements OnInit {
  listTasks: ReadingTask[] = [];

  task_id: number = 0;
  task_type: string = 'reading';
  team: string = '';
  date: Date | string = '';
  
  name_of_item_writer: string = '';
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
  item_characteristics: string = '';
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
    private _taskService: TaskService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getReadingTasks();
  }

  getReadingTasks() {
    this._taskService
      .getTaskByTypeRe('reading')
      .pipe(
        map((item) =>
          item.map((value) => ({
            ...value,
            date: String(value.date).slice(0, 10),
          }))
        )
      )
      .subscribe((data) => {
        this.listTasks = data;
      });
  }

  addReadingTask() {
    const task: ReadingTask = {
      task_id: this.task_id,
      task_type: 'reading',
      date: String(this.date).slice(0, 2),
      name_of_item_writer: this.name_of_item_writer,
      team: this.team,
      text_source: this.text_source,
      where_found: this.where_found,
      authenticity: this.authenticity,
      text_type: this.text_type,
      form: this.form,
      discourse_type: this.discourse_type,
      main_topic_area: this.main_topic_area,
      nature_of_content: this.nature_of_content,
      vocabulary: (this.vocabulary = ''),
      grammar: (this.grammar = ''),
      number_of_words: this.number_of_words,
      comprehensible_cefr_level: (this.comprehensible_cefr_level = ''),
      item_characteristics: this.item_characteristics,
      time_to_do_total_task_minutes: this.time_to_do_total_task_minutes,
      task_level_estimated: this.task_level_estimated,
      test_task: this.task_level_estimated,
      answer_key: this.answer_key,
      comments: this.comments,
      feedback_provided_by: this.feedback_provided_by,
      feedback_team: this.feedback_team,
      feedback_date: this.feedback_date,
      feedback_text: this.feedback_text,
    };

    this._taskService.addTask(task).subscribe({
      next: (response) => {
        this.toastr.success('Task created successfully', 'Success');
        this.getReadingTasks();
      },
      error: (error) => {
        this.toastr.error('Error creating task', 'Error');
        console.error('Error creating task:', error);
      },
    });
  }

  deleteTask(id: number) {
    this._taskService.deleteTask(id).subscribe({
      next: (data) => {
        this.getReadingTasks();
        this.toastr.success('Task eliminada');
      },
      error: (error) => {
        this.toastr.error('Error al eliminar Task');
      },
    });
    this.getReadingTasks();
  }
}
