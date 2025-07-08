package org.mick.ycywbackend.controller;

import lombok.RequiredArgsConstructor;
import org.mick.ycywbackend.dto.ChatMessageResponseDto;
import org.mick.ycywbackend.service.ChatMessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class ChatMessageController {

    private final ChatMessageService chatMessageService;

    @GetMapping("/{sessionId}")
    public ResponseEntity<List<ChatMessageResponseDto>> getMessagesForSession(@PathVariable Long sessionId) {
        return ResponseEntity.ok(chatMessageService.getMessagesBySession(sessionId));
    }
}
