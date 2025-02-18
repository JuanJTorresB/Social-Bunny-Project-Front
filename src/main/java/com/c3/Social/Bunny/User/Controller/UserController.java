package com.c3.Social.Bunny.User.Controller;

import com.c3.Social.Bunny.User.DTO.UpdateUserDTO;
import com.c3.Social.Bunny.User.Entity.User;
import com.c3.Social.Bunny.User.Service.UserService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired private UserService userService;

    @GetMapping("/id/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @GetMapping("/username/{username}")
    public User getUserByUsername(@PathVariable String username) {
        return userService.getUserByUsername(username);
    }

    @GetMapping("/usernameExists/{username}")
    public boolean checkIfUserExists(@PathVariable String username) {
        return userService.checkIfUserExists(username);
    }

    @GetMapping("/username/like/{username}")
    public List<User> getUsersByUsernameLike(@PathVariable String username) {
        return userService.getUsersByUsernameContaining(username);
    }

    @PutMapping("/id/{id}")
    public boolean updateUserById(@PathVariable Long id, @RequestBody UpdateUserDTO newUser) {
        return userService.updateUserById(id, newUser);
    }
}
