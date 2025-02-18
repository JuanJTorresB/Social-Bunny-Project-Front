package com.c3.Social.Bunny.Post.Utilities;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.c3.Social.Bunny.User.Entity.User;
import com.c3.Social.Bunny.User.Repository.UserRepository;
import com.c3.Social.Bunny.Notification.Entity.Notification;
import com.c3.Social.Bunny.Notification.Service.NotificationService;
import com.c3.Social.Bunny.Post.Entity.Post;


@Service
public class MentionHandler {

    @Autowired private UserRepository userRepository;

    @Autowired private NotificationService notificationService;

    public List<User> handleMentions(String description, Post post) {
        List<User> mentionedUsers = new ArrayList<>();
        String[] words = description.split(" ");
        for (String word : words) {
            if (word.startsWith("@")) {
                String username = word.substring(1);
                User user = userRepository.findByUsername(username).orElse(null);
                if (user != null) {
                    mentionedUsers.add(user);
                    Notification notification = new Notification(null, user, "MENTION", null, null, null, post, false);
                    notificationService.saveNotification(notification);
                    notificationService.sendNotificationToUser(notification);
                }
            }
        }
        return mentionedUsers;
    }
}
