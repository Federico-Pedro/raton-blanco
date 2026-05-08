package com.ratonblanco.backend.service;

import com.ratonblanco.backend.entity.Category;
import com.ratonblanco.backend.entity.Product;
import com.ratonblanco.backend.repository.CategoryRepository;
import com.ratonblanco.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import com.ratonblanco.backend.exception.ProductAlreadyExistsException;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }


    public Product createProduct(String name, String description, List<String> images, List<Long> categoryIds) {
        if (productRepository.existsByName(name)) {
            throw new ProductAlreadyExistsException("Ya existe un producto con el nombre: " + name);
        }
        Product newProduct = new Product();
        newProduct.setName(name);
        newProduct.setDescription(description);
        newProduct.setImages(images);
        newProduct.setActive(true);

        List<Category> categories = categoryRepository.findAllById(categoryIds);
        newProduct.setCategories(categories);



        Product savedProduct = productRepository.save(newProduct);

        return savedProduct;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
    }

    public Product updateProduct(Long id, String name, String description, List<String> images, List<Long> categoryIds) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));

        existingProduct.setName(name);
        existingProduct.setDescription(description);
        existingProduct.setImages(images);


        List<Category> categories = categoryRepository.findAllById(categoryIds);
        existingProduct.setCategories(categories);



        return productRepository.save(existingProduct);
    }

    public void deleteProduct(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cannot delete: Product not found with ID: " + id));
        //ELIMINA ARCHIVOS DE IMAGENES ANTES DE BORRAR EL PRODUCTO DE LA BASE DE DATOS

        //Crea el path absoluto a la carpeta imagenes
        Path uploadPath = Paths.get(System.getProperty("user.dir"), "..", "frontend", "public", "images").normalize();

        try {
            for (String imageUrl : product.getImages()) {
                //Quita el /images/ dejando solo el nombre del archivo
                String filename = imageUrl.replace("/images/", "");
                //crea la direccion del archivo
                Path filePath = uploadPath.resolve(filename);
                //elimina el archivo si existe
                Files.deleteIfExists(filePath);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        productRepository.deleteById(id);
    }

}
