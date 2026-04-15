package com.ratonblanco.backend.repository;

import com.ratonblanco.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Transactional //Esta anotacion es necesaria para operaciones de escritura personalizadas
    void deleteByEmail(String email);

    boolean existsByEmail(String email);
}