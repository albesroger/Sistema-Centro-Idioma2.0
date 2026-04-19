import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  private AppUrl: string;
  private APIUrl: string;

  constructor(private http: HttpClient) {
    this.AppUrl = environment.apiUrl;
    this.APIUrl = 'api/user';
  }

  signIn(user: User): Observable<any> {
    return this.http.post(`${this.AppUrl}${this.APIUrl}/register`, user);
  }

  login(user: User): Observable<string> {
    return this.http.post<string>(`${this.AppUrl}${this.APIUrl}/login`, user);
  }

  getUser(): Observable<User[]> {
    const token = localStorage.getItem('myToken');
    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User[]>(`${this.AppUrl}${this.APIUrl}/getUser`, {
      headers: header,
    });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.AppUrl}${this.APIUrl}/deleteUser/${id}`);
  }

  updateUser(user: User): Observable<any> {
    const token = localStorage.getItem('myToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.put(
      `${this.AppUrl}${this.APIUrl}/updateUser/${user.id}`,  
      user,
      { headers }
    );
  }

  loadUser(): Observable<User> {
    const token = localStorage.getItem('myToken');

    if (!token) {
      return throwError(
        () => new Error('No se encontró token de autenticación')
      );
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .get<{ success: boolean; data: User }>(
        `${this.AppUrl}${this.APIUrl}/loadUser`,
        {
          headers,
        }
      )
      .pipe(
        tap(() => {}),
        map((response) => {
          if (!response.success || !response.data) {
            throw new Error('Formato de respuesta inesperado del servidor');
          }
          return response.data;
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}
