import { Injectable } from '@angular/core';
import {Client, IMessage, StompSubscription} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {BehaviorSubject, Observable} from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class ChatService {
  private stompClient?: Client;
  private connected = new BehaviorSubject<boolean>(false);

  connect(token: string): void {
    if (this.stompClient?.connected) return;

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(`${environment.apiUrl}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: str => console.log(str),
      onConnect: () => {
        this.connected.next(true);
      },
      onStompError: frame => console.error('Broker error:', frame)
    });

    this.stompClient.activate();
  }

  isConnected$(): Observable<boolean> {
    return this.connected.asObservable();
  }

  sendMessage(destination: string, body: any): void {
    this.stompClient?.publish({
      destination,
      body: JSON.stringify(body)
    });
  }

  subscribe(destination: string, callback: (message: IMessage) => void): StompSubscription {
    if (!this.stompClient) throw new Error('STOMP client not initialized');
    return this.stompClient.subscribe(destination, callback);
  }

  disconnect(): void {
    this.stompClient?.deactivate();
  }
}
