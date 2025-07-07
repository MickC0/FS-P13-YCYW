package org.mick.ycywbackend.repository;


import org.mick.ycywbackend.entity.ChatSession;
import org.mick.ycywbackend.entity.ChatStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {

    List<ChatSession> findByStatus(ChatStatus status);

    List<ChatSession> findByClientId(Long clientId);

    List<ChatSession> findBySavUserId(Long savUserId);
}
