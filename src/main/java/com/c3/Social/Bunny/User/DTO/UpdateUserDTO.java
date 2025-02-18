package com.c3.Social.Bunny.User.DTO;

public class UpdateUserDTO {
    
    private String biography;

    private String profilePhoto;

    public UpdateUserDTO() {
    }

    public UpdateUserDTO(String biography, String profilePhoto) {
        this.biography = biography;
        this.profilePhoto = profilePhoto;
    }

    public String getBiography() {
        return biography;
    }

    public void setBiography(String biography) {
        this.biography = biography;
    }

    public String getProfilePhoto() {
        return profilePhoto;
    }

    public void setProfilePhoto(String profilePhoto) {
        this.profilePhoto = profilePhoto;
    }
}
