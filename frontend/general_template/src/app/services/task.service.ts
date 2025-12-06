import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import {
  ListeningTask,
  ReadingTask,
  SpeakingTask,
  Task,
  WritingTask,
} from '../interfaces/task';
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

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('myToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  addTask(task: Task): Observable<any> {
    return this.http.post(
      `${this.AppUrl}${this.APIUrl}/createTask`,
      task,
      { headers: this.authHeaders() }
    );
  }

  getTask(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.AppUrl}${this.APIUrl}/getTasks`, {
      headers: this.authHeaders(),
    });
  }

  getTaskById(id: string | number): Observable<Task> {
    return this.http.get<Task>(
      `${this.AppUrl}${this.APIUrl}/getTaskById/${id}`,
      { headers: this.authHeaders() }
    );
  }

  getTasksByUser(itemWriter: string): Observable<Task[]> {
    return this.http.get<Task[]>(
      `${this.AppUrl}${this.APIUrl}/getTasksByUser/${encodeURIComponent(itemWriter)}`,
      { headers: this.authHeaders() }
    );
  }

  getTaskByTypeLi(type: string): Observable<ListeningTask[]> {
    return this.http.get<ListeningTask[]>(
      `${this.AppUrl}${this.APIUrl}/getTaskByType/${type}`,
      { headers: this.authHeaders() }
    );
  }

  getTaskByTypeSp(type: string): Observable<SpeakingTask[]> {
    return this.http.get<SpeakingTask[]>(
      `${this.AppUrl}${this.APIUrl}/getTaskByType/${type}`,
      { headers: this.authHeaders() }
    );
  }

  getTaskByTypeWr(type: string): Observable<WritingTask[]> {
    return this.http.get<WritingTask[]>(
      `${this.AppUrl}${this.APIUrl}/getTaskByType/${type}`,
      { headers: this.authHeaders() }
    );
  }

  getTaskByTypeRe(type: string): Observable<ReadingTask[]> {
    return this.http.get<ReadingTask[]>(
      `${this.AppUrl}${this.APIUrl}/getTaskByType/${type}`,
      { headers: this.authHeaders() }
    );
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(
      `${this.AppUrl}${this.APIUrl}/deleteTask/${id}`,
      { headers: this.authHeaders() }
    );
  }

  updateTask(task: Task): Observable<any> {
    return this.http.put(
      `${this.AppUrl}${this.APIUrl}/updateTask/${task.task_id}`,
      task,
      { headers: this.authHeaders() }
    );
  }
}
