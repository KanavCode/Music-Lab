package com.musiclab.backend.controller;

import com.musiclab.backend.domain.StudioSyncMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

/**
 * WebSocket controller for real-time studio collaboration.
 * Receives sync messages from one client and broadcasts them to all
 * subscribers of the same project topic.
 *
 * AJT Syllabus: Unit 3 — Java Networking (WebSocket communication)
 */
@Controller
public class LiveStudioController {

    private static final Logger logger = LoggerFactory.getLogger(LiveStudioController.class);

    private final SimpMessagingTemplate messagingTemplate;

    public LiveStudioController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Handles incoming studio sync messages sent to /app/studio.sync.
     * Broadcasts the message to /topic/project/{projectId} so all collaborators
     * in the same project session receive the update.
     *
     * @param message the studio sync payload (playhead move, track mute, etc.)
     */
    @MessageMapping("/studio.sync")
    public void syncStudioEvent(StudioSyncMessage message) {
        logger.info("Studio sync event: {} -> project {}", message.getActionType(), message.getProjectId());

        // Broadcast to all subscribers of this project's topic
        String destination = "/topic/project/" + message.getProjectId();
        messagingTemplate.convertAndSend(destination, message);

        logger.debug("Broadcasted to {}: {}", destination, message);
    }
}
