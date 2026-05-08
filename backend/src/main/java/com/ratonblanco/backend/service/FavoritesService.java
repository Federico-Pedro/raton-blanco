package com.ratonblanco.backend.service;


import com.ratonblanco.backend.entity.Favorite;
import com.ratonblanco.backend.entity.Product;
import com.ratonblanco.backend.entity.User;
import com.ratonblanco.backend.repository.FavoriteRepository;
import com.ratonblanco.backend.repository.ProductRepository;
import com.ratonblanco.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class FavoritesService {

    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public FavoritesService(FavoriteRepository favoriteRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.favoriteRepository = favoriteRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;

    }

    public Favorite createFavorite(Long productId, Long userId) {

        Favorite newFavorite = new Favorite();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        newFavorite.setProduct(product);
        newFavorite.setUser(user);

        Favorite savedFavorite = favoriteRepository.save(newFavorite);

        return savedFavorite;
    }

    public List<Favorite> getAllFavorites() {
        return favoriteRepository.findAll();
    }

    public Favorite getFavoriteById(Long id) {
        return favoriteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No se encuentra en favoritos"));
    }

    public void deleteFavorite(Long productId) {
        if (!favoriteRepository.existsByProductId(productId)) {
            throw new RuntimeException("No se encuentra en favoritos");
        }
        favoriteRepository.deleteByProductId(productId);
    }

    public List<Product> getProductByUserId(Long userId) {
        return favoriteRepository.findByUserId(userId)
                .stream()
                .map(favorite -> favorite.getProduct())
                .collect(Collectors.toList());

    }
}