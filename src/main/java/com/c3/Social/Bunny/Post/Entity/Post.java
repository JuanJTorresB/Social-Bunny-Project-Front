package com.c3.Social.Bunny.Post.Entity;

import com.c3.Social.Bunny.Comment.Entity.Comment;
import com.c3.Social.Bunny.Reaction.Entity.Reaction;
import com.c3.Social.Bunny.User.Entity.User;
import com.c3.Social.Bunny.Tag.Entity.Tag;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.sql.Date;
import java.util.List;

@Entity
@Table(name = "\"Post\"")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "idUser", nullable = false)
    private User user;

    @Column(name = "description")
    private String description;

    @Column(name = "img")
    private String img;

    @Column(name = "creationDate", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date creationDate;

    @Column(name = "countComments")
    private int countComments = 0;

    @Column(name = "countReactions")
    private int countReactions = 0;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Comment> comments;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Reaction> reactions;

    @ManyToMany
    @JoinTable(
        name = "\"Mention\"",
        joinColumns = @JoinColumn(name = "idPost"),
        inverseJoinColumns = @JoinColumn(name = "idUser")
    )
    @JsonIgnore
    private List<User> mentionedUsers;

    @ManyToMany
    @JoinTable(
        name = "\"Post_X_Tag\"",
        joinColumns = @JoinColumn(name = "idPost"),
        inverseJoinColumns = @JoinColumn(name = "idTag")
    )
    @JsonIgnore
    private List<Tag> tags;

    public Post() {
    }

    public Post(Long id, User user, String description, String img, Date creationDate, int countComments, int countReactions, List<Comment> comments, List<Reaction> reactions, List<User> mentionedUsers, List<Tag> tags) {
        this.id = id;
        this.user = user;
        this.description = description;
        this.img = img;
        this.creationDate = creationDate;
        this.countComments = countComments;
        this.countReactions = countReactions;
        this.comments = comments;
        this.reactions = reactions;
        this.mentionedUsers = mentionedUsers;
        this.tags = tags;
    }

    private Integer calcularTotalComments() {
        if (comments == null) {
            return 0;
        }
        return comments.size();
    }

    private void actualizarCountComments() {
        countComments = calcularTotalComments();
    }

    private Integer calcularTotalReactions() {
        if (reactions == null) {
            return 0;
        }
        return reactions.size();
    }

    private void actualizarCountReactions() {
        countReactions = calcularTotalReactions();
    }

    @PrePersist
    @PreUpdate
    public void preGuardar() {
        actualizarCountComments();
        actualizarCountReactions();
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public int getCountComments() {
        return countComments;
    }

    public void setCountComments(int countComments) {
        this.countComments = countComments;
    }

    public int getCountReactions() {
        return countReactions;
    }

    public void setCountReactions(int countReactions) {
        this.countReactions = countReactions;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public List<Reaction> getReactions() {
        return reactions;
    }

    public void setReactions(List<Reaction> reactions) {
        this.reactions = reactions;
    }

    public List<User> getMentionedUsers() {
        return mentionedUsers;
    }

    public void setMentionedUsers(List<User> mentionedUsers) {
        this.mentionedUsers = mentionedUsers;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }
}
