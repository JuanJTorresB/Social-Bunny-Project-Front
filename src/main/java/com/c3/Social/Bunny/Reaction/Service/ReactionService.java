package com.c3.Social.Bunny.Reaction.Service;

import com.c3.Social.Bunny.Post.Entity.Post;
import com.c3.Social.Bunny.Post.Service.PostService;
import com.c3.Social.Bunny.Reaction.Entity.Reaction;
import com.c3.Social.Bunny.Reaction.Enum.ReactionType;
import com.c3.Social.Bunny.Reaction.Repository.ReactionRepository;
import com.c3.Social.Bunny.User.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.c3.Social.Bunny.Notification.Service.NotificationService;
import com.c3.Social.Bunny.Notification.Entity.Notification;
import java.util.List;

@Service
public class ReactionService {
    @Autowired
    private ReactionRepository reactionRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PostService postService;

    @Autowired
    private NotificationService notificationService;

    public List<Reaction> getAllReactionPost(Long postId) {
        return reactionRepository.findByPostId(postId);
    }

    public Reaction setReaction(Long postId, Long userId) {
        Reaction reaction = reactionRepository.findByPostIdAndUserId(postId, userId).orElse(null);
        Post post = postService.getPostById(postId);
        
        if (reaction == null) {
            reaction = new Reaction();
            reaction.setPost(post);
            reaction.setUser(userService.getUserById(userId));
            reaction.setType(ReactionType.LOVE);
            reactionRepository.save(reaction);
            Notification notification = new Notification(null, post.getUser(), "REACTION", null, reaction, null, null, false);
            notificationService.saveNotification(notification);
            notificationService.sendNotificationToUser(notification);
        } else {
            reactionRepository.delete(reaction);
        }
        
        post.preGuardar(); // Actualiza el contador de reacciones
        postService.updatePost(post); // Guarda el post actualizado
        return reaction;
    }

    public void deleteReaction(Long postId, Long userId) {
        reactionRepository.deleteByPostIdAndUserId(postId, userId);
    }

    public boolean isReacted(Long postId, Long userId) {
        return reactionRepository.existsByPostIdAndUserId(postId, userId);
    }
}
