package com.c3.Social.Bunny.Post.Service;

import com.c3.Social.Bunny.Post.Entity.Post;
import com.c3.Social.Bunny.Post.Repository.PostRepository;
import com.c3.Social.Bunny.Post.Utilities.MentionHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private MentionHandler mentionHandler;

    @Transactional
    public Post uploadPost(Post post) {
        post.setMentionedUsers(mentionHandler.handleMentions(post.getDescription(), post));
        return postRepository.save(post);
    }

    public List<Post> getPostsByFollowedUsers(Long userId) {
        return postRepository.findPostsByFollowedUsers(userId);
    }

    public List<Post> getPostsByFollowedUsersWithMostReactionsAndComments(Long userId) {
        return postRepository.findPostsByFollowedUsersRelevance(userId);
    }

    public Post getPostById(Long postId) {
        return postRepository.findById(postId).orElse(null);
    }

    public void deletePost(Long postId) {
        postRepository.deleteById(postId);
    }

    @Transactional
    public void updatePost(Post post) {
        postRepository.save(post);
    }

    public List<Post> getPostsByUserId(Long userId) {
        return postRepository.findByUserIdOrderByCreationDateDesc(userId);
    }

    public Optional<Post> getPostByCommentId(Long commentId) {
        return postRepository.findByCommentsId(commentId);
    }
}
