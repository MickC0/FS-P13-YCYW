import { ChangeDetectionStrategy, Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../core/service/chat.service';
import { AuthService } from '../../../core/service/auth.service';
import { MATERIAL_IMPORTS } from '../../../shared/material';
import { IMessage } from '@stomp/stompjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ...MATERIAL_IMPORTS],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit {
  @Input() sessionId!: number;
  @Input() senderRole!: 'CLIENT' | 'SAV';
  messages = signal<string[]>([]);
  private messageValue = signal('');

  get message(): string {
    return this.messageValue();
  }
  set message(val: string) {
    this.messageValue.set(val);
  }


  private chatService = inject(ChatService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token && this.sessionId) {
      this.chatService.connect(token);

      this.chatService.subscribe(`/topic/chat.${this.sessionId}`, (msg: IMessage) => {
        const body = JSON.parse(msg.body);
        this.messages.update(list => [...list, body.content]);
      });
    }
  }

  send(): void {
    if (this.message.trim()) {
      this.chatService.sendMessage('/app/chat.send', {
        sessionId: this.sessionId,
        content: this.message
      });
      this.message = '';
    }
  }

}
