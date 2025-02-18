package com.c3.Social.Bunny.Notification.Entity;

import com.c3.Social.Bunny.Comment.Entity.Comment;
import com.c3.Social.Bunny.Follower.Entity.Follower;
import com.c3.Social.Bunny.Post.Entity.Post;
import com.c3.Social.Bunny.Reaction.Entity.Reaction;
import com.c3.Social.Bunny.User.Entity.User;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "\"Notification\"")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "idUser", nullable = false)
    @JsonManagedReference
    private User user;

    @Column(name = "type", nullable = false)
    private String type;

    @ManyToOne
    @JoinColumn(name = "idComment")
    @JsonManagedReference
    private Comment comment;

    @ManyToOne
    @JoinColumn(name = "idReaction")
    @JsonManagedReference
    private Reaction reaction;

    @ManyToOne
    @JoinColumn(name = "idFollower")
    @JsonManagedReference
    private Follower follower;

    @ManyToOne
    @JoinColumn(name = "idPost")
    @JsonManagedReference
    private Post post;

    @Column(name = "seen")
    private Boolean seen = false;

    public Notification() {
    }

    public Notification(Long id, User user, String type, Comment comment, Reaction reaction, Follower follower, Post post, Boolean seen) {
        this.id = id;
        this.user = user;
        this.type = type;
        this.comment = comment;
        this.reaction = reaction;
        this.follower = follower;
        this.post = post;
        this.seen = seen;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Comment getComment() {
        return comment;
    }

    public void setComment(Comment comment) {
        this.comment = comment;
    }

    public Reaction getReaction() {
        return reaction;
    }

    public void setReaction(Reaction reaction) {
        this.reaction = reaction;
    }

    public Follower getFollower() {
        return follower;
    }

    public void setFollower(Follower follower) {
        this.follower = follower;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public Boolean getSeen() {
        return seen;
    }

    public void setSeen(Boolean seen) {
        this.seen = seen;
    }
}
