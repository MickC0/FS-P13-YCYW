package org.mick.ycywbackend.mapper;

import org.mick.ycywbackend.dto.ChatSessionDto;
import org.mick.ycywbackend.entity.ChatSession;
import org.springframework.stereotype.Component;

@Component
public class ChatSessionMapper {

    public ChatSessionDto toDto(ChatSession chatSession) {
        return ChatSessionDto.builder()
                .id(chatSession.getId())
                .clientEmail(chatSession.getClient().getEmail())
                .build();
    }
}
