import { Component, OnInit } from '@angular/core';
import { ListeningTask } from '../../../interfaces/task';
import { TaskService } from '../../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-see-listeningtasks',
  imports: [CommonModule],
  templateUrl: './seeListeningTasks.component.html',
})
export class SeeTasksComponent implements OnInit {
  listTasks: ListeningTask[] = [];

  task_id: number = 0;
  task_type: string = 'listening';
  team: string = '';
  date: Date = new Date();
  status: string = '';
  name_of_item_writer: string = '';
  text_source: string = '';
  where_found: string = '';
  authenticity: string = '';
  text_input_type: string = '';
  discourse_type: string = '';
  main_topic_area: string = '';
  nature_of_content: string = '';
  vocabulary: string = '';
  grammar: string = '';
  length_of_input: string = '';
  number_of_participants: number = 0;
  accents: string = '';
  speed_of_delivery: string = '';
  clarity_of_articulation: string = '';
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

  // ⭐ NUEVO: selección múltiple
  selectedItems: ListeningTask[] = [];
  allSelected = false;

  constructor(
    private _taskService: TaskService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getListeningTasks();
  }

  getListeningTasks() {
    this._taskService
      .getTaskByTypeLi('listening')
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
        this.selectedItems = [];
        this.allSelected = false;
      });
  }

  addListeningTask() {
    const task: ListeningTask = {
      task_id: this.task_id,
      task_type: 'listening',
      date: String(this.date).slice(0, 2),
      name_of_item_writer: this.name_of_item_writer,
      team: this.team,
      status: this.status,
      text_source: this.text_source,
      where_found: this.where_found,
      authenticity: this.authenticity,
      text_input_type: this.text_input_type,
      discourse_type: this.discourse_type,
      main_topic_area: this.main_topic_area,
      nature_of_content: this.nature_of_content,
      vocabulary: (this.vocabulary = ''),
      grammar: (this.grammar = ''),
      length_of_input: this.length_of_input,
      number_of_participants: this.number_of_participants,
      accents: (this.accents = ''),
      speed_of_delivery: this.speed_of_delivery,
      clarity_of_articulation: this.clarity_of_articulation,
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
      next: (data) => {
        this.toastr.success('Tarea agregada', 'Éxito');
        this.getListeningTasks();
      },
      error: (error) => {
        this.toastr.error('Error al agregar la tarea', 'Error');
      },
    });
  }

  
  deleteTask(id: number) {
    this._taskService.deleteTask(id).subscribe({
      next: () => {
        this.getListeningTasks();
        this.toastr.success('Task eliminada');
      },
      error: () => this.toastr.error('Error al eliminar Task'),
    });
  }

  // ⭐ NUEVO: manejar selección individual
  toggleSelection(item: ListeningTask) {
    const index = this.selectedItems.indexOf(item);

    if (index === -1) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems.splice(index, 1);
    }

    this.allSelected = this.selectedItems.length === this.listTasks.length;
  }

  // ⭐ NUEVO: seleccionar/deseleccionar todo
  toggleSelectAll(event: any) {
    this.allSelected = event.target.checked;

    if (this.allSelected) {
      this.selectedItems = [...this.listTasks];
    } else {
      this.selectedItems = [];
    }
  }

  // ⭐ NUEVO: eliminar muchas tareas
  deleteSelected() {
    if (this.selectedItems.length === 0) return;

    const ids = this.selectedItems.map((i) => i.task_id);

    // Backend: eliminar cada una (puedo ayudarte a crear un endpoint deleteMany)
    ids.forEach((id) => {
      this._taskService.deleteTask(id).subscribe({
        next: () => {},
        error: () => this.toastr.error('Error eliminando una tarea'),
      });
    });

    this.toastr.success('Tareas eliminadas');
    this.getListeningTasks();
  }
}
