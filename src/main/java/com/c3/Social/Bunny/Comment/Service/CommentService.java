package com.c3.Social.Bunny.Comment.Service;

import com.c3.Social.Bunny.Comment.Entity.Comment;
import com.c3.Social.Bunny.Comment.Repository.CommentRepository;
import com.c3.Social.Bunny.Notification.Entity.Notification;
import com.c3.Social.Bunny.Notification.Service.NotificationService;
import com.c3.Social.Bunny.Post.Entity.Post;
import com.c3.Social.Bunny.Post.Service.PostService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostService postService;

    @Autowired
    private NotificationService notificationService;

    @Transactional(readOnly = true)
    public Optional<Comment> getCommentById(Long id) {
        return commentRepository.findById(id);
    }

    @Transactional
    public Comment saveComment(Comment comment) {
        Comment savedComment = commentRepository.save(comment);
        Notification notification = new Notification(null, comment.getPost().getUser(), "COMMENT", savedComment, null,
                null, null,
                false);
        Post post = comment.getPost();
        post.preGuardar();
        postService.updatePost(post);
        commentRepository.save(savedComment);
        notificationService.saveNotification(notification);
        notificationService.sendNotificationToUser(notification);
        return savedComment;
    }

    @Transactional
    public void deleteComment(Long id) {
        Comment comment = commentRepository.findById(id).orElse(null);
        if (comment == null) {
            throw new RuntimeException("Comment not found");
        }
        Post post = comment.getPost();
        post.getComments().remove(comment);
        commentRepository.delete(comment);
        post.preGuardar();
        postService.updatePost(post);
    }

    @Transactional(readOnly = true)
    public List<Comment> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostId(postId);
    }

    @Transactional
    public Comment updateComment(Long id, Comment updatedComment) {
        Optional<Comment> commentOptional = commentRepository.findById(id);
        if (commentOptional.isPresent()) {
            Comment comment = commentOptional.get();
            comment.setBody(updatedComment.getBody());
            return commentRepository.save(comment);
        }
        return null;
    }
}
