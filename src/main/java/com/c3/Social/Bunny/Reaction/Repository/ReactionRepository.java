package com.c3.Social.Bunny.Reaction.Repository;

import com.c3.Social.Bunny.Reaction.Entity.Reaction;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReactionRepository extends CrudRepository<Reaction, Long> {
    List<Reaction> findByPostId(Long postId);
    Optional<Reaction> findByPostIdAndUserId(Long postId, Long userId);
    void deleteByPostIdAndUserId(Long postId, Long userId);
    boolean existsByPostIdAndUserId(Long postId, Long userId);
}
