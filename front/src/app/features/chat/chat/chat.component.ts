import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
  signal,
  OnDestroy,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../core/service/chat.service';
import { AuthService } from '../../../core/service/auth.service';
import { MATERIAL_IMPORTS } from '../../../shared/material';
import { IMessage, StompSubscription } from '@stomp/stompjs';
import { filter, take } from 'rxjs';
import { ChatRestService } from '../../../core/service/chat.rest.service';
import { MessageDisplay } from '../../../core/models/message-display';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ...MATERIAL_IMPORTS],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit, OnChanges, OnDestroy {
  @Input() sessionId!: number;
  @Input() senderRole!: 'CLIENT' | 'SAV';
  @Output() chatEnded = new EventEmitter<void>();

  messages = signal<MessageDisplay[]>([]);
  private messageValue = signal('');
  readonly ended = signal(false);

  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private chatRest = inject(ChatRestService);

  private subscriptions: StompSubscription[] = [];

  get message(): string {
    return this.messageValue();
  }

  set message(val: string) {
    this.messageValue.set(val);
  }

  ngOnInit(): void {
    const storedId = localStorage.getItem('chatSessionId');

    if (!this.sessionId && storedId) {
      this.sessionId = +storedId;

      this.chatRest.getSessionById(this.sessionId).subscribe(session => {
        if (session.status === 'CLOSED') {
          this.messages.set([]);
          this.sessionId = 0;
          localStorage.removeItem('chatSessionId');
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sessionId'] && this.sessionId) {
      const token = this.authService.getToken();
      if (!token) return;

      localStorage.setItem('chatSessionId', this.sessionId.toString());
      this.chatService.connect(token);

      this.chatRest.getMessages(this.sessionId).subscribe((msgs) => {
        this.messages.set(msgs);
      });

      this.chatService.isConnected$()
          .pipe(filter(c => c), take(1))
          .subscribe(() => {
            const subChat = this.chatService.subscribe(`/topic/chat.${this.sessionId}`, (msg: IMessage) => {
              const body = JSON.parse(msg.body);
              this.messages.update(list => [...list, {
                sender: body.sender,
                content: body.content
              }]);
            });

            const subClose = this.chatService.subscribe('/topic/chat.closed', (msg: IMessage) => {
              const closedId = +msg.body;
              if (closedId === this.sessionId) {
                this.messages.update(list => [...list, {
                  sender: 'SYSTEM',
                  content: 'Le chat a été clôturé par l’autre participant.'
                }]);
                this.ended.set(true);
                localStorage.removeItem('chatSessionId');

                setTimeout(() => {
                  this.chatEnded.emit();
                }, 1500);
              }
            });

            this.subscriptions.push(subChat, subClose);
          });
    }
  }

  send(): void {
    if (this.message.trim()) {
      const content = this.message;

      this.chatService.isConnected$()
          .pipe(filter(c => c), take(1))
          .subscribe(() => {
            this.chatService.sendMessage('/app/chat.send', {
              sessionId: this.sessionId,
              content,
              sender: this.senderRole
            });
            this.message = '';
          });
    }
  }

  terminateChat(): void {
    if (this.sessionId) {
      this.chatService.sendMessage('/app/chat.close', {
        sessionId: this.sessionId
      });

      this.messages.update(list => [...list, {
        sender: 'SYSTEM',
        content: 'Vous avez clôturé le chat.'
      }]);

      this.ended.set(true);
      localStorage.removeItem('chatSessionId');

      setTimeout(() => {
        this.chatEnded.emit();
      }, 1500);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
    localStorage.removeItem('chatSessionId');
  }
}
