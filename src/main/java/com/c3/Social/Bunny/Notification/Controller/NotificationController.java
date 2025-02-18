package com.c3.Social.Bunny.Notification.Controller;

import com.c3.Social.Bunny.Notification.Entity.Notification;
import com.c3.Social.Bunny.Notification.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {
    @Autowired private NotificationService notificationService;

    @GetMapping("/unseen/{id}")
    public List<Notification> getUnseenUserNotifications(@PathVariable Long id) {
        return notificationService.getAllUnseenNotificationsByUserId(id);
    }

    @GetMapping("/all/{id}")
    public List<Notification> getAllUserNotifications(@PathVariable Long id) {
        return notificationService.getAllNotificationsByUserId(id);
    }

    @PutMapping("/mark/seen/{id}")
    public void markNotificationAsSeen(@PathVariable Long id) {
        notificationService.markNotificationAsSeen(id);
    }
}
