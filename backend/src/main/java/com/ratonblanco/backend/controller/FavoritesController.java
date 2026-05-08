package com.ratonblanco.backend.controller;


import com.ratonblanco.backend.dto.FavoritesRequest;
import com.ratonblanco.backend.entity.Favorite;
import com.ratonblanco.backend.entity.Product;
import com.ratonblanco.backend.service.FavoritesService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:5173")
public class FavoritesController {

    private final FavoritesService favoritesService;


    public FavoritesController(FavoritesService favoritesService) {

        this.favoritesService = favoritesService;

    }

    @PostMapping
    public ResponseEntity<Favorite> createFavorites(@Valid @RequestBody FavoritesRequest request) {
        Favorite createdFavorite = favoritesService.createFavorite(

                request.getProductId(),
                request.getUserId()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(createdFavorite);
    }


    @GetMapping
    public ResponseEntity<List<Favorite>> getAllFavorites() {
        List<Favorite> favorites = favoritesService.getAllFavorites();
        return ResponseEntity.ok(favorites);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Favorite> getFavoritesById(@PathVariable Long id) {
        Favorite favorite = favoritesService.getFavoriteById(id);
        return ResponseEntity.ok(favorite);
    }

    //@DeleteMapping("/{id}")
    //public ResponseEntity<Void> deleteFavorites(@PathVariable Long id) {
    //    favoritesService.deleteFavorite(id);
    //    return ResponseEntity.noContent().build();
    //}

    @DeleteMapping("/product/{productId}")
    public ResponseEntity<Void> deleteFavorites(@PathVariable Long productId) {
        favoritesService.deleteFavorite(productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Product>> getProducts(@PathVariable Long userId) {
        return ResponseEntity.ok(favoritesService.getProductByUserId(userId));
    }

}