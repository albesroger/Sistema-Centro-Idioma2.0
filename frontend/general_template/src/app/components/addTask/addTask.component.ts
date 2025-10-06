import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'add-task',
  imports: [],
  templateUrl: './addTask.component.html',
})
export class AddTaskComponent {
  constructor(private location: Location) {}
  goBack(): void {
    this.location.back();
  }
}
