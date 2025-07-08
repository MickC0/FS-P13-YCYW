import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MATERIAL_IMPORTS } from '../../shared/material';
import { ChatComponent } from '../../features/chat/chat/chat.component';
import { AuthService } from '../../core/service/auth.service';
import { ChatRestService } from '../../core/service/chat.rest.service';
import { ChatService } from '../../core/service/chat.service';
import { ChatSession } from '../../core/models/chat-session';
import { filter, retry, switchMap, take, timer } from 'rxjs';
import { IMessage } from '@stomp/stompjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ...MATERIAL_IMPORTS, ChatComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private auth = inject(AuthService);
  private chatRest = inject(ChatRestService);
  private chatService = inject(ChatService);

  readonly role = this.auth.role;
  readonly isClient = computed(() => this.role() === 'CLIENT');
  readonly isSav = computed(() => this.role() === 'SAV');
  readonly isLogged = this.auth.isLoggedSignal;

  readonly sessions = signal<ChatSession[]>([]);
  readonly activeSession = signal<ChatSession | null>(this.restoreClientSession());

  canDisplayChatComponent = signal(false);
  canSubscribeToTopics = signal(false);

  constructor() {
    const token = this.auth.getToken();

    if (this.isSav() && token) {
      this.chatService.connect(token);

      this.chatService.isConnected$()
          .pipe(
              filter(ok => ok),
              take(1),
              retry({ count: 10, delay: (_, retryCount) => timer(100) })
          )
          .subscribe(() => {
            this.canSubscribeToTopics.set(true);
          });

      effect(() => {
        if (this.canSubscribeToTopics()) {
          this.chatService.subscribe('/topic/waiting-sessions', () => {
            this.loadWaitingSessions();
          });

          this.chatService.subscribe('/topic/chat.closed', (msg: IMessage) => {
            const closedId = +msg.body;
            this.sessions.update(list => list.filter(s => s.id !== closedId));

          });
        }
      });
    }

    if (this.isClient() && token && this.activeSession()) {
      this.chatService.connect(token);
      this.chatService.isConnected$()
          .pipe(
              filter(ok => ok),
              take(1),
              retry({ count: 10, delay: (_, retryCount) => timer(100) })
          )
          .subscribe(() => {
            this.canDisplayChatComponent.set(true);
          });
    }

    effect(() => {
      if (!this.isLogged()) {
        this.sessions.set([]);
        this.activeSession.set(null);
        localStorage.removeItem('chatSessionId');
      }
    });
  }

  startSession(): void {
    const token = this.auth.getToken();
    if (!token) return;

    this.chatRest.createSession()
        .pipe(
            switchMap(session => {
              this.activeSession.set(session);

              this.chatService.connect(token);

              return this.chatService.isConnected$().pipe(
                  filter(c => c),
                  take(1)
              );
            })
        )
        .subscribe(() => {
          this.chatService.sendMessage(`/app/chat.${this.activeSession()?.id}`, {
            content: 'Nouvelle session ouverte',
            type: 'SYSTEM',
            sessionId: this.activeSession()?.id,
            sender: this.auth.email()
          });

          this.canDisplayChatComponent.set(true);
        });
  }

  takeSession(id: number): void {
    this.chatRest.assignSession(id).subscribe(session => {
      this.activeSession.set(session);
      this.canDisplayChatComponent.set(true);
    });
  }

  loadWaitingSessions(): void {
    this.chatRest.getWaitingSessions().subscribe(this.sessions.set);
  }

  onChatEnded(): void {
    if (this.isClient()) {
      this.activeSession.set(null);
    }

    if (this.isSav()) {

      setTimeout(() => {
        this.activeSession.set(null);
        this.canDisplayChatComponent.set(false);
        this.loadWaitingSessions();
      }, 1500);
    }
  }

  private restoreClientSession(): ChatSession | null {
    if (this.role() !== 'CLIENT') return null;
    const stored = localStorage.getItem('chatSessionId');
    if (stored) {
      const id = parseInt(stored, 10);
      return { id } as ChatSession;
    }
    return null;
  }
}
