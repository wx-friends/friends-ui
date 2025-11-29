package com.example.chatdemo;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class ChatMessageHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(ChatMessageHandler.class);
    private static final String REDIS_MESSAGES_KEY = "chat_messages";
    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    private final ObjectMapper objectMapper;
    private final StringRedisTemplate redisTemplate;

    public ChatMessageHandler(ObjectMapper objectMapper, StringRedisTemplate redisTemplate) {
        this.objectMapper = objectMapper;
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        logger.info("New WebSocket connection established: {}", session.getId());
        sessions.add(session);
        // Send previous messages to the new user
        List<String> previousMessages = redisTemplate.opsForList().range(REDIS_MESSAGES_KEY, 0, -1);
        if (previousMessages != null) {
            for (String msg : previousMessages) {
                session.sendMessage(new TextMessage(msg));
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        logger.info("WebSocket connection closed: {} with status: {}", session.getId(), status);
        sessions.remove(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        ChatMessage chatMessage = objectMapper.readValue(payload, ChatMessage.class);

        logger.info("Received message from sender '{}': {}", chatMessage.getSender(), chatMessage.getContent());

        // Save to Redis
        String messageJson = objectMapper.writeValueAsString(chatMessage);
        redisTemplate.opsForList().rightPush(REDIS_MESSAGES_KEY, messageJson);

        // Broadcast to all sessions
        for (WebSocketSession webSocketSession : sessions) {
            try {
                webSocketSession.sendMessage(new TextMessage(messageJson));
            } catch (IOException e) {
                logger.error("Error sending message to session {}: {}", webSocketSession.getId(), e.getMessage());
            }
        }
    }
}
