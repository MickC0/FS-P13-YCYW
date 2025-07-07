package org.mick.ycywbackend.repository;


import org.mick.ycywbackend.entity.ChatMessage;
import org.mick.ycywbackend.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByChatSession(ChatSession session);
}