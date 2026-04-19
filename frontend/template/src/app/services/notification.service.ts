import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Notification } from '../interfaces/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private AppUrl = environment.apiUrl;
  private APIUrl = 'api/notifications';

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('myToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getMyNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${this.AppUrl}${this.APIUrl}/me`,
      { headers: this.authHeaders() }
    );
  }

  markAsRead(id: number): Observable<any> {
    return this.http.post(
      `${this.AppUrl}${this.APIUrl}/mark-read/${id}`,
      {},
      { headers: this.authHeaders() }
    );
  }

  markAllAsRead(): Observable<any> {
    return this.http.post(
      `${this.AppUrl}${this.APIUrl}/mark-all-read`,
      {},
      { headers: this.authHeaders() }
    );
  }
}
