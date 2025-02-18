package com.c3.Social.Bunny.Comment.Controller;

import com.c3.Social.Bunny.Comment.DTO.UploadComment;
import com.c3.Social.Bunny.Comment.Entity.Comment;
import com.c3.Social.Bunny.Comment.Service.CommentService;
import com.c3.Social.Bunny.Post.Entity.Post;
import com.c3.Social.Bunny.Post.Service.PostService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
@RestController
@RequestMapping("/api/comment")
public class CommentController {
    @Autowired private CommentService commentService;
    @Autowired private PostService postService;

    @GetMapping("/{id}")
    public Comment getCommentById(@PathVariable Long id) {
        return commentService.getCommentById(id).orElse(null);
    }

    @PostMapping("{postId}/save")
    @Transactional
    public Comment createComment(@RequestBody UploadComment updateComment, @PathVariable Long postId) {
        Post post = postService.getPostById(postId);
        Comment comment = new Comment(null, post, updateComment.getUser(), updateComment.getBody());
        return commentService.saveComment(comment);
    }

    @PutMapping("/update/{id}")
    public Comment updateComment(@PathVariable Long id, @RequestBody Comment updatedComment) {
        return commentService.updateComment(id, updatedComment);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
    }
}
