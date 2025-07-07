package org.mick.ycywbackend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.mick.ycywbackend.entity.MessageType;

@Getter
@Setter
@NoArgsConstructor
public class ChatMessageDto {

    private String content;
    private String sender;
    private Long sessionId;
    private MessageType type;
}
