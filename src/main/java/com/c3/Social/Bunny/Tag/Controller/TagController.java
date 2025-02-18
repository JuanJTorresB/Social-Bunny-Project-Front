package com.c3.Social.Bunny.Tag.Controller;

import com.c3.Social.Bunny.Tag.Entity.Tag;
import com.c3.Social.Bunny.Tag.Service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tag")
public class TagController {
    @Autowired private TagService tagService;

    @PostMapping("/create")
    public void createTag(@RequestBody Tag tag) {
        tagService.saveTag(tag);
    }

    @PutMapping("/update/{id}")
    public void updateTag(@RequestBody Tag tag, @PathVariable Long id) {
        tag.setId(id);
        tagService.saveTag(tag);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteTag(@PathVariable Long id) {
        tagService.deleteById(id);
    }

    @GetMapping("/{name}")
    public Tag findByName(@PathVariable String name) {
        return tagService.findByName(name);
    }

    @GetMapping("/all")
    public List<Tag> findAll() {
        return tagService.findAll();
    }

}
