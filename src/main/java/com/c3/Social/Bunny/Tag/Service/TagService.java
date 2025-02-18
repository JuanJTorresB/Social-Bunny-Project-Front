package com.c3.Social.Bunny.Tag.Service;

import com.c3.Social.Bunny.Tag.Entity.Tag;
import com.c3.Social.Bunny.Tag.Repository.TagRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TagService {
    @Autowired private TagRepository tagRepository;

    public void saveTag(Tag tag) {
        tagRepository.save(tag);
    }

    public Tag findById(Long id) {
        return tagRepository.findById(id).orElse(null);
    }

    public void deleteById(Long id) {
        tagRepository.deleteById(id);
    }

    public List<Tag> findAll() {
        return (List<Tag>) tagRepository.findAll();
    }

    public Tag findByName(String name) {
        return tagRepository.findByTagBody(name).orElse(null);
    }
}
