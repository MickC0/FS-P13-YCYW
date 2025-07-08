package org.mick.ycywbackend.controller;

import lombok.RequiredArgsConstructor;
import org.mick.ycywbackend.dto.ChatCloseDto;
import org.mick.ycywbackend.dto.ChatMessageDto;
import org.mick.ycywbackend.dto.ChatMessageResponseDto;
import org.mick.ycywbackend.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    @MessageMapping("/chat.send")
    public void send(ChatMessageDto dto, Principal principal) {
        ChatMessageResponseDto response = chatService.handleMessage(dto, principal.getName());

        messagingTemplate.convertAndSend(
                "/topic/chat." + dto.getSessionId(),
                response
        );
    }

    @MessageMapping("/chat.close")
    public void closeChat(ChatCloseDto dto) {
        chatService.closeChat(dto.sessionId());
        messagingTemplate.convertAndSend("/topic/chat.closed", dto.sessionId());
        messagingTemplate.convertAndSend("/topic/waiting-sessions", "refresh");
    }
}
