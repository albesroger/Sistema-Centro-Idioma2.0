import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ListeningTask, Task } from '../interfaces/task';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  
  private AppUrl: string;
  private APIUrl: string;

  constructor(private http: HttpClient) {
    this.AppUrl = environment.apiUrl;
    this.APIUrl = 'api/tasks';
  }

  addTask(task: Task): Observable<any> {
    return this.http.post(`${this.AppUrl}${this.APIUrl}/createTask`, task);
  }

  getTask(): Observable<Task[]> {
    const token = localStorage.getItem('myToken');
    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Task[]>(`${this.AppUrl}${this.APIUrl}/getTasks`, {
      headers: header,
    });
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(
      `${this.AppUrl}${this.APIUrl}/getTaskById/${id}`
    );
  }

  getTaskByType(type: string): Observable<ListeningTask[]> {
    return this.http.get<ListeningTask[]>(
      `${this.AppUrl}${this.APIUrl}/getTaskByType/${type}`
    );
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.AppUrl}${this.APIUrl}/deleteTask/${id}`);
  }

  updateTask(task: Task): Observable<any> {
    return this.http.put(
      `${this.AppUrl}${this.APIUrl}/updateTask/${task.task_id}`,
      task
    );
  }
}
