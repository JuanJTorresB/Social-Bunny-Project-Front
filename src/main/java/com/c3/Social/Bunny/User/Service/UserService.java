package com.c3.Social.Bunny.User.Service;

import com.c3.Social.Bunny.User.DTO.UpdateUserDTO;
import com.c3.Social.Bunny.User.Entity.User;
import com.c3.Social.Bunny.User.Repository.UserRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void saveUser(User user) {
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public boolean checkIfUserExists(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    public List<User> getUsersByUsernameContaining(String username) {
        return userRepository.findByUsernameContaining(username);
    }

    public boolean updateUserById(Long id, UpdateUserDTO newUser) {
        User user = userRepository.findById(id).orElse(null);
        if (user!= null) {
            user.setBiography(newUser.getBiography());
            user.setProfilePhoto(newUser.getProfilePhoto());
            userRepository.save(user);
            return true;
        }
        return false;
    }
}
