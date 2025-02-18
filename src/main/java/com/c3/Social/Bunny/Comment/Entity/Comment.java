package com.c3.Social.Bunny.Comment.Entity;

import com.c3.Social.Bunny.Post.Entity.Post;
import com.c3.Social.Bunny.User.Entity.User;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "\"Comment\"")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "idPost", nullable = false)
    @JsonIgnore
    private Post post;

    @ManyToOne
    @JoinColumn(name = "idUser", nullable = false)
    @JsonManagedReference
    private User user;

    @Column(name = "body", nullable = false)
    private String body;

    public Comment() {
    }

    public Comment(Long id, Post post, User user, String body) {
        this.id = id;
        this.post = post;
        this.user = user;
        this.body = body;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }
}
