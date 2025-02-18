package com.c3.Social.Bunny.Reaction.Entity;

import com.c3.Social.Bunny.Post.Entity.Post;
import com.c3.Social.Bunny.Reaction.Enum.ReactionType;
import com.c3.Social.Bunny.User.Entity.User;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "\"Reaction\"")
public class Reaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "idPost", nullable = false)
    @JsonManagedReference
    private Post post;

    @ManyToOne
    @JoinColumn(name = "idUser", nullable = false)
    @JsonManagedReference
    private User user;

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private ReactionType type;

    public Reaction() {
    }

    public Reaction(Long id, Post post, User user, ReactionType type) {
        this.id = id;
        this.post = post;
        this.user = user;
        this.type = type;
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

    public ReactionType getType() {
        return type;
    }

    public void setType(ReactionType type) {
        this.type = type;
    }
}
