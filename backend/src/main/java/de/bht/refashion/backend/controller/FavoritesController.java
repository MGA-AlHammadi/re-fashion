package de.bht.refashion.backend.controller;

import de.bht.refashion.backend.model.Favorite;
import de.bht.refashion.backend.model.Product;
import de.bht.refashion.backend.model.User;
import de.bht.refashion.backend.repository.FavoriteRepository;
import de.bht.refashion.backend.repository.ProductRepository;
import de.bht.refashion.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class FavoritesController {

    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    public FavoritesController(FavoriteRepository favoriteRepository, ProductRepository productRepository, UserService userService) {
        this.favoriteRepository = favoriteRepository;
        this.productRepository = productRepository;
        this.userService = userService;
    }

    @GetMapping
    public List<Product> listFavorites(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        User user = userService.getUserProfile(token);
        return favoriteRepository.findByUser(user).stream().map(Favorite::getProduct).collect(Collectors.toList());
    }

    @PostMapping("/{productId}")
    public ResponseEntity<?> addFavorite(@RequestHeader("Authorization") String authHeader, @PathVariable Long productId) {
        String token = authHeader.substring(7);
        User user = userService.getUserProfile(token);
        if (productId == null) return ResponseEntity.badRequest().body("Product ID is required");
        Product p = productRepository.findById(productId).orElse(null);
        if (p == null) return ResponseEntity.badRequest().body("Product not found");
        var existing = favoriteRepository.findByUserAndProduct(user, p);
        if (existing.isPresent()) return ResponseEntity.ok().body("Already favorited");
        Favorite f = new Favorite(user, p);
        favoriteRepository.save(f);
        return ResponseEntity.ok(f.getProduct());
    }

    @Transactional
    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFavorite(@RequestHeader("Authorization") String authHeader, @PathVariable Long productId) {
        String token = authHeader.substring(7);
        User user = userService.getUserProfile(token);
        if (productId == null) return ResponseEntity.badRequest().body("Product ID is required");
        Product p = productRepository.findById(productId).orElse(null);
        if (p == null) return ResponseEntity.badRequest().body("Product not found");
        favoriteRepository.deleteByUserAndProduct(user, p);
        return ResponseEntity.ok().build();
    }
}
