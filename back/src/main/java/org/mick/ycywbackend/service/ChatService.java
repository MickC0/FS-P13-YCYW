package org.mick.ycywbackend.service;

import lombok.RequiredArgsConstructor;
import org.mick.ycywbackend.dto.ChatMessageDto;
import org.mick.ycywbackend.dto.ChatMessageResponseDto;
import org.mick.ycywbackend.entity.*;
import org.mick.ycywbackend.repository.ChatMessageRepository;
import org.mick.ycywbackend.repository.ChatSessionRepository;
import org.mick.ycywbackend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository messageRepo;
    private final ChatSessionRepository sessionRepo;
    private final UserRepository userRepo;

    public ChatMessageResponseDto handleMessage(ChatMessageDto dto, String senderEmail) {
        User sender = userRepo.findByEmail(senderEmail).orElseThrow();
        ChatSession session = sessionRepo.findById(dto.getSessionId()).orElseThrow();

        ChatMessage message = new ChatMessage();
        message.setChatSession(session);
        message.setSender(sender);
        message.setContent(dto.getContent());
        message.setType(MessageType.CHAT);

        messageRepo.save(message);

        return new ChatMessageResponseDto(
                message.getId(),
                message.getContent(),
                sender.getRole().name(),
                session.getId(),
                message.getType().name()
        );
    }

    public void closeChat(Long sessionId) {
        ChatSession session = sessionRepo.findById(sessionId).orElseThrow();
        session.close();
        sessionRepo.save(session);
    }
}
