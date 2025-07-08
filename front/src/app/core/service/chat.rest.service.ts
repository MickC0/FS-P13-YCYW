import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ChatSession} from '../models/chat-session';

@Injectable({
  providedIn: 'root'
})
export class ChatRestService {

  private readonly API = `${environment.apiUrl}/api/v1/chats`;

  constructor(private http: HttpClient) {}

  createSession(): Observable<ChatSession> {
    return this.http.post<ChatSession>(this.API, {});
  }

  getWaitingSessions(): Observable<ChatSession[]> {
    return this.http.get<ChatSession[]>(`${this.API}/waiting`);
  }

  assignSession(id: number): Observable<ChatSession> {
    return this.http.post<ChatSession>(`${this.API}/${id}/assign`, {});
  }

  closeSession(id: number): Observable<ChatSession> {
    return this.http.post<ChatSession>(`${this.API}/${id}/close`, {});
  }
}
