package com.ratonblanco.backend.service;

import com.ratonblanco.backend.entity.Category;
import com.ratonblanco.backend.exception.UserAlreadyExistsException;
import com.ratonblanco.backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;

    }

    public Category createCategory(String name, String description) {

        if (categoryRepository.existsByName(name)) {
            throw new UserAlreadyExistsException("Esta categoria ya existe");
        }

        Category newCategory = new Category();
        newCategory.setName(name);
        newCategory.setDescription(description);


        Category savedCategory = categoryRepository.save(newCategory);

        return savedCategory;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada"));
    }

    public Category updateCategory(Long id, String name, String description) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria no encontrada"));

        existingCategory.setName(name);
        existingCategory.setDescription(description);



        return categoryRepository.save(existingCategory);
    }

    public void deleteCategory(Long id) {

        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Caracteristica no encontrada");
        }

        categoryRepository.deleteById(id);
    }

}

