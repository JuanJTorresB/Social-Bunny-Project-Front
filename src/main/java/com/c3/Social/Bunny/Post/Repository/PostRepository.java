package com.c3.Social.Bunny.Post.Repository;

import com.c3.Social.Bunny.Post.Entity.Post;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface PostRepository extends CrudRepository<Post, Long> {

    @Query("SELECT p FROM Post p WHERE p.user.id IN (SELECT f.followed.id FROM Follower f WHERE f.follower.id = :userId) ORDER BY p.creationDate desc")
    List<Post> findPostsByFollowedUsers(Long userId);

    @Query("SELECT p FROM Post p WHERE p.user.id IN (SELECT f.followed.id FROM Follower f WHERE f.follower.id = :userId) ORDER BY p.countReactions desc, p.countComments desc")
    List<Post> findPostsByFollowedUsersRelevance(Long userId);

    List<Post> findByUserIdOrderByCreationDateDesc(Long userId);

    Optional<Post> findByCommentsId(Long id);
}
