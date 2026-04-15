package com.ratonblanco.backend.repository;

import com.ratonblanco.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {


    Optional<Category> findById(Long id);


    void deleteById(Long id);

    boolean existsById(Long id);
    boolean existsByName(String name);
}
