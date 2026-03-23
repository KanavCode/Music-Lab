package com.musiclab.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * STOMP over WebSocket configuration for real-time studio collaboration.
 * Enables live synchronization of playhead position, track muting, and other
 * studio events between collaborators in the same project.
 *
 * AJT Syllabus: Unit 3 — Java Networking (WebSockets)
 *               Unit 8 — Configuration Pattern (Singleton via Spring)
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /**
     * Configures the message broker:
     * - /topic: prefix for broadcast destinations (clients subscribe here)
     * - /app: prefix for messages routed to @MessageMapping methods
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    /**
     * Registers the STOMP endpoint that the Next.js frontend will connect to.
     * AllowedOriginPatterns("*") prevents CORS blocking from the frontend dev server.
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-studio")
                .setAllowedOriginPatterns("*");
    }
}
