package com.c3.Social.Bunny.Reaction.Controller;

import com.c3.Social.Bunny.Reaction.Entity.Reaction;
import com.c3.Social.Bunny.Reaction.Service.ReactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reaction")
public class ReactionController {
    @Autowired private ReactionService reactionService;

    @PostMapping("/{idPost}/{idUser}")
    public Reaction lovePost(@PathVariable Long idPost, @PathVariable Long idUser) {
        return reactionService.setReaction(idPost, idUser);
    }

    @DeleteMapping("/{idPost}/{idUser}")
    public void unlovePost(@PathVariable Long idPost, @PathVariable Long idUser) {
        reactionService.deleteReaction(idPost, idUser);
    }

    @GetMapping("/{idPost}/{idUser}")
    public boolean isReacted(@PathVariable Long idPost, @PathVariable Long idUser) {
        return reactionService.isReacted(idPost, idUser);
    }
}
