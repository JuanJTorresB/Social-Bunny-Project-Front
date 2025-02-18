package com.c3.Social.Bunny.Tag.Entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;
import com.c3.Social.Bunny.Post.Entity.Post;

@Entity
@Table(name = "\"Tag\"")
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "\"tagBody\"", length = 50)
    private String tagBody;

    @ManyToMany(mappedBy = "tags")
    @JsonManagedReference
    private List<Post> posts;

    public Tag() {}

    public Tag(Long id, String tagBody, List<Post> posts) {
        this.id = id;
        this.tagBody = tagBody;
        this.posts = posts;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTagBody() {
        return tagBody;
    }

    public void setTagBody(String tagBody) {
        this.tagBody = tagBody;
    }

    public List<Post> getPosts() {
        return posts;
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }
}
