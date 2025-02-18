package com.c3.Social.Bunny.Notification.Controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.c3.Social.Bunny.Notification.Entity.Notification;

@RestController
public class NotificationWebSocketController {
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationWebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping("/api/notification/send")
    public void sendNotification(@RequestBody Notification notification) {
        messagingTemplate.convertAndSend("/topic/notifications", notification); // Envía el mensaje a todos los suscriptores
    }

    // Método para enviar notificación desde el backend
    public void sendNotificationFromBackend(Notification notification) {
        messagingTemplate.convertAndSend("/topic/notifications", notification);
    }
} 