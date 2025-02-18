package com.c3.Social.Bunny.Post.Controller;

import com.c3.Social.Bunny.Comment.Entity.Comment;
import com.c3.Social.Bunny.Comment.Service.CommentService;
import com.c3.Social.Bunny.Post.Entity.Post;
import com.c3.Social.Bunny.Post.Service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/post")
public class PostController {
    @Autowired private PostService postService;
    @Autowired private CommentService commentService;

    @GetMapping("/{id}/comments")
    public List<Comment> getCommentsByPostId(@PathVariable Long id) {
        return commentService.getCommentsByPostId(id);
    }

    @PostMapping("/upload")
    public ResponseEntity<Post> uploadPost(@RequestBody Post post) {
        return ResponseEntity.ok(postService.uploadPost(post));
    }

    @GetMapping("/feed/{id}")
    public List<Post> getFeed(@PathVariable Long id) {
        return postService.getPostsByFollowedUsers(id);
    }

    @GetMapping("/feed/{id}/mostRelevant")
    public List<Post> getFeedMostReactedAndCommented(@PathVariable Long id) {
        return postService.getPostsByFollowedUsersWithMostReactionsAndComments(id);
    }

    @DeleteMapping("/delete/{id}")
    public void deletePost(@PathVariable Long id) {
        postService.deletePost(id);
    }

    @PutMapping("/update")
    public void updatePost(@RequestBody Post newPost) {
        postService.updatePost(newPost);
    }

    @GetMapping("/user/{id}")
    public List<Post> getPostsByUserId(@PathVariable Long id) {
        return postService.getPostsByUserId(id);
    }

    @GetMapping("/{id}")
    public Post getPostById(@PathVariable Long id) {
        return postService.getPostById(id);
    }

    @GetMapping("/comment/{id}")
    public Optional<Post> getPostByCommentId(@PathVariable Long id) {
        return postService.getPostByCommentId(id);
    }
}
