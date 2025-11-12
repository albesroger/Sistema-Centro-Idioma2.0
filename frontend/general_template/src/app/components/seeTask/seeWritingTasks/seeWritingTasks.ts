import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { WritingTask } from '../../../interfaces/task';

@Component({
  selector: 'app-see-writing-tasks',
  imports: [],
  templateUrl: './seeWritingTasks.html',
})
export class SeeWritingTasks implements OnInit {
  listTasks: WritingTask[] = [];

  task_id: number = 0;
  task_type: string = 'writing';
  team: string = '';
  date: Date | string = '';
  name_of_item_writer: string = '';
  status: string = '';

  section: string = '';
  main_topic_area: string = '';
  nature_of_content: string = '';
  expected_vocabulary: string = '';
  prompt_type: string = '';
  time_to_do_total_task_minutes: number = 0;
  task_level_estimated: string = '';
  targetted_outcomes: string = '';
  task_section_task: string = '';
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
    this.getWritingTasks();
  }

  getWritingTasks() {
    this._taskService
      .getTaskByTypeWr('writing')
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

  addWritingTask() {
    const task: WritingTask = {
      task_id: this.task_id,
      task_type: 'writing',
      team: this.team,
      date: String(this.date).slice(0, 2),
      name_of_item_writer: this.name_of_item_writer,
      status: this.status,
      section: this.section,
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
    };

    this._taskService.addTask(task).subscribe({
      next: (response) => {
        this.toastr.success('Task created successfully', 'Success');
        this.getWritingTasks();
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
        this.getWritingTasks();
        this.toastr.success('Task eliminada');
      },
      error: (error) => {
        this.toastr.error('Error al eliminar Task');
      },
    });
    this.getWritingTasks();
  }
}
