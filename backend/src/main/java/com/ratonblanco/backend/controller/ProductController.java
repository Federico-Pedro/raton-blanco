package com.ratonblanco.backend.controller;

import com.ratonblanco.backend.dto.ProductRequest;
import com.ratonblanco.backend.entity.Product;
import com.ratonblanco.backend.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody ProductRequest request) {
        Product createdProduct = productService.createProduct(
                request.getName(),
                request.getDescription(),
                request.getImages(),
                request.getCategoryIds(),
                request.getCharacteristicIds(),
                request.getPolitics()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }


    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @Valid
            @RequestBody ProductRequest request) {
        Product updateProduct = productService.updateProduct(
                id,
                request.getName(),
                request.getDescription(),
                request.getImages(),
                request.getCategoryIds(),
                request.getCharacteristicIds(),
                request.getPolitics()
        );
        return ResponseEntity.ok(updateProduct);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

}
