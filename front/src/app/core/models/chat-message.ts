export interface ChatMessage {
  id?: number;
  content: string;
  senderEmail: string;
  sessionId: number;
  timestamp: string;
  type: 'CHAT';
}
