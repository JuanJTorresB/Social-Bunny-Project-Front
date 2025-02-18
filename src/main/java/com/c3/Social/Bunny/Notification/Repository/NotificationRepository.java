package com.c3.Social.Bunny.Notification.Repository;

import com.c3.Social.Bunny.Notification.Entity.Notification;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends CrudRepository<Notification, Long> {
    List<Notification> findByUserId(Long userId);
    List<Notification> findByUserIdAndSeen(Long userId, boolean seen);
}
