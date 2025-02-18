package com.c3.Social.Bunny.Follower.Repository;

import com.c3.Social.Bunny.Follower.Entity.Follower;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowerRepository extends CrudRepository<Follower, Long> {
    List<Follower> findByFollowedId(Long followedId);
    List<Follower> findByFollowerId(Long followerId);
    Optional<Follower> findByFollowedIdAndFollowerId(Long followedId, Long followerId);
    void deleteByFollowedIdAndFollowerId(Long followedId, Long followerId);
}
