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
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatMessageHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(ChatMessageHandler.class);
    private static final String REDIS_MESSAGES_KEY = "chat_messages";
    private final Map<String, WebSocketSession> userSessions = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper;
    private final StringRedisTemplate redisTemplate;

    public ChatMessageHandler(ObjectMapper objectMapper, StringRedisTemplate redisTemplate) {
        this.objectMapper = objectMapper;
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String username = getUsernameFromSession(session);
        if (username == null || username.trim().isEmpty()) {
            logger.warn("Closing connection with no username provided: {}", session.getId());
            session.close(CloseStatus.BAD_DATA.withReason("Username is required"));
            return;
        }

        logger.info("New WebSocket connection for user '{}': {}", username, session.getId());
        userSessions.put(username, session);

        // For simplicity, we don't send historical messages in private chat mode.
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String username = getUsernameFromSession(session);
        if (username != null) {
            logger.info("WebSocket connection closed for user '{}': {} with status: {}", username, session.getId(), status);
            userSessions.remove(username);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        ChatMessage chatMessage = objectMapper.readValue(payload, ChatMessage.class);

        logger.info("Received message from '{}' to '{}': {}", chatMessage.getSender(), chatMessage.getRecipient(), chatMessage.getContent());

        // Save to Redis (as a general log of all messages)
        String messageJson = objectMapper.writeValueAsString(chatMessage);
        redisTemplate.opsForList().rightPush(REDIS_MESSAGES_KEY, messageJson);

        // Send to recipient
        WebSocketSession recipientSession = userSessions.get(chatMessage.getRecipient());
        if (recipientSession != null && recipientSession.isOpen()) {
            try {
                recipientSession.sendMessage(new TextMessage(messageJson));
                logger.info("Message sent to recipient '{}'", chatMessage.getRecipient());
            } catch (IOException e) {
                logger.error("Error sending message to {}: {}", chatMessage.getRecipient(), e.getMessage());
            }
        } else {
            logger.warn("Recipient '{}' not found or offline.", chatMessage.getRecipient());
            // Optionally, send a 'user offline' message back to the sender
        }

        // Send message back to the sender for confirmation
        try {
            session.sendMessage(new TextMessage(messageJson));
        } catch (IOException e) {
            logger.error("Error sending confirmation message to sender {}: {}", chatMessage.getSender(), e.getMessage());
        }
    }

    private String getUsernameFromSession(WebSocketSession session) {
        URI uri = session.getUri();
        if (uri == null) return null;

        return UriComponentsBuilder.fromUri(uri)
                .build()
                .getQueryParams()
                .getFirst("username");
    }
}
