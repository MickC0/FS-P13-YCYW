package org.mick.ycywbackend.controller;


import lombok.RequiredArgsConstructor;
import org.mick.ycywbackend.dto.ChatMessageDto;
import org.mick.ycywbackend.entity.ChatMessage;
import org.mick.ycywbackend.entity.ChatSession;
import org.mick.ycywbackend.entity.MessageType;
import org.mick.ycywbackend.entity.User;
import org.mick.ycywbackend.repository.ChatMessageRepository;
import org.mick.ycywbackend.repository.ChatSessionRepository;
import org.mick.ycywbackend.repository.UserRepository;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatSessionRepository sessionRepo;
    private final ChatMessageRepository messageRepo;
    private final UserRepository userRepo;

    @MessageMapping("/chat.send")
    public void send(ChatMessageDto dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User sender = userRepo.findByEmail(email).orElseThrow();
        ChatSession session = sessionRepo.findById(dto.getSessionId()).orElseThrow();

        ChatMessage message = new ChatMessage();
        message.setChatSession(session);
        message.setSender(sender);
        message.setContent(dto.getContent());
        message.setType(MessageType.CHAT);

        messageRepo.save(message);

        messagingTemplate.convertAndSend(
                "/topic/chat." + dto.getSessionId(),
                message
        );
    }
}