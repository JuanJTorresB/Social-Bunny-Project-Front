package com.c3.Social.Bunny.Comment.DTO;

import com.c3.Social.Bunny.User.Entity.User;

public class UploadComment {
    private User user;
    private String body;
    
    public UploadComment() {
    }

    public UploadComment(User user, String body) {
        this.user = user;
        this.body = body;
    }

    public User getUser() {
        return user;
    }

    public String getBody() {
        return body;
    }
}
