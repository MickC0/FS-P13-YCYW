package org.mick.ycywbackend.controller;

import lombok.RequiredArgsConstructor;
import org.mick.ycywbackend.dto.ChatSessionDto;
import org.mick.ycywbackend.service.ChatSessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chats")
@RequiredArgsConstructor
public class ChatSessionController {

    private final ChatSessionService chatSessionService;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping
    public ResponseEntity<ChatSessionDto> createSession() {
        messagingTemplate.convertAndSend("/topic/waiting-sessions", "refresh");
        return ResponseEntity.ok(chatSessionService.createSession());
    }

    @GetMapping("/waiting")
    public ResponseEntity<List<ChatSessionDto>> getWaitingSessions() {
        return ResponseEntity.ok(chatSessionService.getWaitingSessions());
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<ChatSessionDto> assignToSav(@PathVariable Long id) {
        ChatSessionDto dto = chatSessionService.assignToSav(id);
        messagingTemplate.convertAndSend("/topic/waiting-sessions", "refresh");
        return ResponseEntity.ok(dto);
    }


    @PostMapping("/{id}/close")
    public ResponseEntity<ChatSessionDto> closeSession(@PathVariable Long id) {
        return ResponseEntity.ok(chatSessionService.closeSession(id));
    }
}
