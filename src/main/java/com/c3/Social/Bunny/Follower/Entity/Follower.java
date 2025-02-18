package com.c3.Social.Bunny.Follower.Entity;

import com.c3.Social.Bunny.User.Entity.User;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "\"Follower\"")
public class Follower {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "idFollowed", nullable = false)
    @JsonManagedReference
    private User followed;

    @ManyToOne
    @JoinColumn(name = "idFollower", nullable = false)
    @JsonManagedReference
    private User follower;

    public Follower() {
    }

    public Follower(Long id, User followed, User follower) {
        this.id = id;
        this.followed = followed;
        this.follower = follower;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getFollowed() {
        return followed;
    }

    public void setFollowed(User followed) {
        this.followed = followed;
    }

    public User getFollower() {
        return follower;
    }

    public void setFollower(User follower) {
        this.follower = follower;
    }
}
