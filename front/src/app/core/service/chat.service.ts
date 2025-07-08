import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private stompClient?: Client;
  private connected = new BehaviorSubject<boolean>(false);

  connect(token: string): void {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(`${environment.apiUrl}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: str => console.log(str),
      onConnect: () => {
        this.connected.next(true);
        console.log('✅ WebSocket (SockJS) connected');
      },
      onStompError: frame => console.error('Broker error:', frame)
    });

    this.stompClient.activate();
  }

  sendMessage(destination: string, body: any): void {
    this.stompClient?.publish({
      destination,
      body: JSON.stringify(body)
    });
  }

  subscribe(destination: string, callback: (message: IMessage) => void): void {
    this.stompClient?.subscribe(destination, callback);
  }

  disconnect(): void {
    this.stompClient?.deactivate();
  }
}
