package org.mick.ycywbackend.service;

import lombok.RequiredArgsConstructor;
import org.mick.ycywbackend.entity.*;
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

    // Récupère l'utilisateur connecté
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    /**
     * Crée une session de chat pour l'utilisateur connecté (client)
     */
    public ChatSession createSession() {
        User current = getCurrentUser();

        ChatSession session = new ChatSession();
        session.setClient(current);
        // status + createdAt sont gérés par @PrePersist
        return chatSessionRepository.save(session);
    }

    /**
     * Récupère toutes les sessions en attente
     */
    public List<ChatSession> getWaitingSessions() {
        return chatSessionRepository.findByStatus(ChatStatus.WAITING);
    }

    /**
     * Le SAV prend en charge une session
     */
    public ChatSession assignToSav(Long sessionId) {
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

        return chatSessionRepository.save(session);
    }

    /**
     * Ferme une session (optionnel)
     */
    public ChatSession closeSession(Long sessionId) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        session.setStatus(ChatStatus.CLOSED);
        return chatSessionRepository.save(session);
    }
}
