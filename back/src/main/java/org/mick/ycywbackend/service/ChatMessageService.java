package org.mick.ycywbackend.service;

import lombok.RequiredArgsConstructor;
import org.mick.ycywbackend.dto.ChatMessageResponseDto;
import org.mick.ycywbackend.mapper.ChatMessageMapper;
import org.mick.ycywbackend.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatMessageRepository messageRepo;
    private final ChatMessageMapper mapper;

    public List<ChatMessageResponseDto> getMessagesBySession(Long sessionId) {
        return messageRepo.findByChatSessionId(sessionId)
                .stream()
                .map(mapper::toDto)
                .toList();
    }
}
