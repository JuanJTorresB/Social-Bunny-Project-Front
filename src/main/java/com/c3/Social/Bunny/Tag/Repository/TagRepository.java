package com.c3.Social.Bunny.Tag.Repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.c3.Social.Bunny.Tag.Entity.Tag;

import java.util.Optional;

@Repository
public interface TagRepository extends CrudRepository<Tag, Long> {
    Optional<Tag> findByTagBody(String tagBody);
} 