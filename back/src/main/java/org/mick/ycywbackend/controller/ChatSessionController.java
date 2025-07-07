package org.mick.ycywbackend.controller;

import lombok.RequiredArgsConstructor;
import org.mick.ycywbackend.entity.ChatSession;
import org.mick.ycywbackend.service.ChatSessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chats")
@RequiredArgsConstructor
public class ChatSessionController {

    private final ChatSessionService chatSessionService;

    /**
     * Un utilisateur client démarre une nouvelle session
     */
    @PostMapping
    public ResponseEntity<ChatSession> createSession() {
        ChatSession session = chatSessionService.createSession();
        return ResponseEntity.ok(session);
    }

    /**
     * L’utilisateur SAV consulte les chats en attente
     */
    @GetMapping("/waiting")
    public ResponseEntity<List<ChatSession>> getWaitingSessions() {
        return ResponseEntity.ok(chatSessionService.getWaitingSessions());
    }

    /**
     * L’utilisateur SAV prend en charge une session
     */
    @PostMapping("/{id}/assign")
    public ResponseEntity<ChatSession> assignToSav(@PathVariable Long id) {
        return ResponseEntity.ok(chatSessionService.assignToSav(id));
    }

    /**
     * Optionnel : fermer une session
     */
    @PostMapping("/{id}/close")
    public ResponseEntity<ChatSession> closeSession(@PathVariable Long id) {
        return ResponseEntity.ok(chatSessionService.closeSession(id));
    }
}
