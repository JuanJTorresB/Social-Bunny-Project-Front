package com.c3.Social.Bunny.Follower.Controller;

import com.c3.Social.Bunny.Follower.Entity.Follower;
import com.c3.Social.Bunny.Follower.Service.FollowerService;
import com.c3.Social.Bunny.User.Service.UserService;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/follower")
public class FollowerController {
    @Autowired
    FollowerService followerService;

    @Autowired
    UserService userService;

    @PostMapping("/save/{userId}/{followedId}") // Usuario que sigue a -> /Usuario
    public void saveFollower(@PathVariable Long userId, @PathVariable Long followedId) {
        Follower follower = new Follower();
        follower.setFollower(userService.getUserById(userId));
        follower.setFollowed(userService.getUserById(followedId));
        followerService.createFollower(follower);
    }

    @GetMapping("/getFollowers/{id}")
    public Iterable<Follower> getFollowers(@PathVariable Long id) {
        return followerService.getAllUserFollowers(id);
    }

    @GetMapping("/getFollowing/{id}")
    public Iterable<Follower> getFollowing(@PathVariable Long id) {
        return followerService.getAllUserFollowed(id);
    }

    @DeleteMapping("/unfollow/{userId}/{followedId}")
    public void unfollow(@PathVariable Long userId, @PathVariable Long followedId) {
        followerService.unfollowUser(followedId, userId); // Usuario que de dejara de ser seguido por -> /Usuario
    }

    @Transactional
    @GetMapping("/checkFollower/{userId}/{followerId}")
    public boolean checkFollower(@PathVariable Long userId, @PathVariable Long followerId) {
        return followerService.checkFollower(userId, followerId);
    }
}
