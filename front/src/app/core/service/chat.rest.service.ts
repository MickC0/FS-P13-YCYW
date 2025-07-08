import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ChatSession} from '../models/chat-session';
import {ChatMessageResponse} from "../models/chat-message-response";

@Injectable({
  providedIn: 'root'
})
export class ChatRestService {

  private readonly API = `${environment.apiUrl}/api/v1/chats`;
  private readonly MESSAGES_API = `${environment.apiUrl}/api/v1/messages`;

  private http = inject(HttpClient);

  createSession(): Observable<ChatSession> {
    return this.http.post<ChatSession>(this.API, {});
  }

  getWaitingSessions(): Observable<ChatSession[]> {
    return this.http.get<ChatSession[]>(`${this.API}/waiting`);
  }

  getMessages(sessionId: number): Observable<ChatMessageResponse[]> {
    return this.http.get<ChatMessageResponse[]>(`${this.API.replace('/chats', '/messages')}/${sessionId}`);
  }

  assignSession(id: number): Observable<ChatSession> {
    return this.http.post<ChatSession>(`${this.API}/${id}/assign`, {});
  }

  getSessionById(id: number): Observable<ChatSession> {
    return this.http.get<ChatSession>(`${this.API}/${id}`);
  }

  closeSession(id: number): Observable<ChatSession> {
    return this.http.post<ChatSession>(`${this.API}/${id}/close`, {});
  }
}
