package com.c3.Social.Bunny.User.Repository;

import com.c3.Social.Bunny.User.Entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    Optional<User> findByUsername(String username);
    List<User> findByUsernameContaining(String username);
}
