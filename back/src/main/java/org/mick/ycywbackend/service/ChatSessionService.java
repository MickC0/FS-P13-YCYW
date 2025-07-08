package org.mick.ycywbackend.service;

import lombok.RequiredArgsConstructor;
import org.mick.ycywbackend.dto.ChatSessionDto;
import org.mick.ycywbackend.entity.*;
import org.mick.ycywbackend.mapper.ChatSessionMapper;
import org.mick.ycywbackend.repository.ChatSessionRepository;
import org.mick.ycywbackend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatSessionService {

    private final ChatSessionRepository chatSessionRepository;
    private final UserRepository userRepository;
    private final ChatSessionMapper chatSessionMapper;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    public ChatSessionDto createSession() {
        User current = getCurrentUser();

        ChatSession session = new ChatSession();
        session.setClient(current);

        return chatSessionMapper.toDto(chatSessionRepository.save(session));
    }

    public List<ChatSessionDto> getWaitingSessions() {
        return chatSessionRepository.findByStatus(ChatStatus.WAITING)
                .stream()
                .map(chatSessionMapper::toDto)
                .toList();
    }

    public ChatSessionDto assignToSav(Long sessionId) {
        User current = getCurrentUser();

        if (current.getRole() != Role.SAV) {
            throw new RuntimeException("Forbidden: only SAV users can assign sessions.");
        }

        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (session.getStatus() != ChatStatus.WAITING) {
            throw new RuntimeException("Session is not in waiting state.");
        }

        session.setSavUser(current);
        session.setStatus(ChatStatus.IN_PROGRESS);

        return chatSessionMapper.toDto(chatSessionRepository.save(session));
    }

    public ChatSessionDto closeSession(Long sessionId) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        session.setStatus(ChatStatus.CLOSED);
        return chatSessionMapper.toDto(chatSessionRepository.save(session));
    }
}
