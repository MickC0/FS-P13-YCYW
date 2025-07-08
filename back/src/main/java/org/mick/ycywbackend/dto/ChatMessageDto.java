package org.mick.ycywbackend.dto;

import lombok.*;
import org.mick.ycywbackend.entity.MessageType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDto {

    private String content;
    private String sender;
    private Long sessionId;
    private MessageType type;
}
