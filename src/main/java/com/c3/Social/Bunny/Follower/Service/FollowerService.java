package com.c3.Social.Bunny.Follower.Service;

import com.c3.Social.Bunny.Follower.Entity.Follower;
import com.c3.Social.Bunny.Follower.Repository.FollowerRepository;
import com.c3.Social.Bunny.Notification.Entity.Notification;
import com.c3.Social.Bunny.Notification.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FollowerService {
    @Autowired
    private FollowerRepository followerRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public void createFollower(Follower follower) {
        followerRepository.save(follower);
        Notification notification = new Notification(null, follower.getFollowed(), "FOLLOW", null, null, follower, null, false);
        notificationService.saveNotification(notification);
        notificationService.sendNotificationToUser(notification);
    }

    public void deleteFollower(Long followerId) {
        followerRepository.deleteById(followerId);
    }

    public Follower getFollowerById(Long followerId) {
        return followerRepository.findById(followerId).orElse(null);
    }

    public Iterable<Follower> getAllUserFollowers(Long userId) {
        return followerRepository.findByFollowedId(userId); // Todas las relaciones en que el user es el seguido
    }

    public Iterable<Follower> getAllUserFollowed(Long userId) {
        return followerRepository.findByFollowerId(userId); // Todas las relaciones en que el user es el seguidor
    }

    public boolean checkFollower(Long userId, Long followerId) {
        return followerRepository.findByFollowedIdAndFollowerId(userId, followerId).isPresent(); // Verifica si el usuario es seguido por el followerId
    }

    @Transactional
    public void unfollowUser(Long userId, Long followerId) {
        followerRepository.deleteByFollowedIdAndFollowerId(userId, followerId);
    }
}
