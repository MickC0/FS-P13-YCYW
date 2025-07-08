package org.mick.ycywbackend.mapper;

import org.mick.ycywbackend.dto.ChatMessageResponseDto;
import org.mick.ycywbackend.entity.ChatMessage;
import org.springframework.stereotype.Component;

@Component
public class ChatMessageMapper {

    public ChatMessageResponseDto toDto(ChatMessage message) {
        ChatMessageResponseDto dto = new ChatMessageResponseDto();
        dto.setId(message.getId());
        dto.setSessionId(message.getChatSession().getId());
        dto.setSender(message.getSender().getRole().name());
        dto.setType(message.getType().name());
        dto.setContent(message.getContent());
        return dto;
    }
}
