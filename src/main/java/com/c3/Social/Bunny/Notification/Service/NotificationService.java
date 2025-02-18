package com.c3.Social.Bunny.Notification.Service;

import com.c3.Social.Bunny.Notification.Controller.NotificationWebSocketController;
import com.c3.Social.Bunny.Notification.Entity.Notification;
import com.c3.Social.Bunny.Notification.Repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationWebSocketController notificationWebSocketController;

    public void saveNotification(Notification notification) {
        notificationRepository.save(notification);
    }

    public List<Notification> getAllNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    public List<Notification> getAllUnseenNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserIdAndSeen(userId, false);
    }

    public void markNotificationAsSeen(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElse(null);
        if (notification != null) {
            notification.setSeen(true);
            notificationRepository.save(notification);
        }
    }

    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    public void sendNotificationToUser(Notification notification) {
        notificationRepository.save(notification);
        notificationWebSocketController.sendNotificationFromBackend(notification);
    }
}
