import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/service/auth.service';
import { MATERIAL_IMPORTS } from '../../shared/material';
import { ChatRestService } from '../../core/service/chat.rest.service';
import { ChatSession } from '../../core/models/chat-session';
import {ChatComponent} from '../../features/chat/chat/chat.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ...MATERIAL_IMPORTS, ChatComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private chatRest = inject(ChatRestService);
  private auth = inject(AuthService);

  readonly role = this.auth.role;
  readonly isClient = computed(() => this.role() === 'CLIENT');
  readonly isSav = computed(() => this.role() === 'SAV');

  readonly activeSession = signal<ChatSession | null>(null);
  readonly sessions = signal<ChatSession[]>([]);

  constructor() {
    if (this.isSav()) {
      this.loadWaitingSessions();
    }
  }

  loadWaitingSessions(): void {
    this.chatRest.getWaitingSessions().subscribe(this.sessions.set);
  }

  startSession(): void {
    this.chatRest.createSession().subscribe(this.activeSession.set);
  }

  takeSession(id: number): void {
    this.chatRest.assignSession(id).subscribe(this.activeSession.set);
  }
}
