package de.bht.refashion.backend.controller;

import de.bht.refashion.backend.dto.CreateProductRequest;
import de.bht.refashion.backend.model.Category;
import de.bht.refashion.backend.model.Product;
import de.bht.refashion.backend.repository.CategoryRepository;
import de.bht.refashion.backend.repository.ProductRepository;
import de.bht.refashion.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public ProductController(ProductRepository productRepository, CategoryRepository categoryRepository, UserRepository userRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Product> all() {
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> get(@PathVariable Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }
        return productRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{name}")
    public List<Product> byCategory(@PathVariable String name) {
        return productRepository.findByCategory_Name(name);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateProductRequest req) {
        Category category = null;
        Long categoryId = req.getCategoryId();
        if (categoryId != null) {
            category = categoryRepository.findById(categoryId).orElse(null);
        }
        
        // Owner aus dem authentifizierten Benutzer ermitteln
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof org.springframework.security.core.userdetails.User)) {
            return ResponseEntity.status(401).body("Authentication required");
        }
        
        String email = ((org.springframework.security.core.userdetails.User) auth.getPrincipal()).getUsername();
        var ownerOpt = userRepository.findByEmail(email);
        if (ownerOpt.isEmpty()) {
            return ResponseEntity.status(403).body("User not found");
        }

        Product p = new Product();
        p.setTitle(req.getTitle());
        p.setDescription(req.getDescription());
        p.setPrice(req.getPrice());
        p.setSize(req.getSize());
        p.setCondition(req.getCondition());
        p.setImageUrl(req.getImageUrl());
        p.setCategory(category);
        p.setOwner(ownerOpt.get());

        Product saved = productRepository.save(p);
        URI location = URI.create("/api/products/" + saved.getId());
        return ResponseEntity.created(location).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody CreateProductRequest req) {
        var prodOpt = productRepository.findById(id);
        if (prodOpt.isEmpty()) return ResponseEntity.notFound().build();

        Product p = prodOpt.get();

        // Authentifizierung prüfen
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof org.springframework.security.core.userdetails.User)) {
            return ResponseEntity.status(401).body("Authentication required");
        }
        
        String email = ((org.springframework.security.core.userdetails.User) auth.getPrincipal()).getUsername();
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(403).body("User not found");
        }
        
        // Nur Owner darf Produkt bearbeiten
        if (p.getOwner() == null || !p.getOwner().getId().equals(userOpt.get().getId())) {
            return ResponseEntity.status(403).body("Only the owner can edit this product");
        }

        if (req.getTitle() != null) p.setTitle(req.getTitle());
        if (req.getDescription() != null) p.setDescription(req.getDescription());
        if (req.getPrice() != null) p.setPrice(req.getPrice());
        if (req.getSize() != null) p.setSize(req.getSize());
        if (req.getCondition() != null) p.setCondition(req.getCondition());
        if (req.getImageUrl() != null) p.setImageUrl(req.getImageUrl());
        if (req.getCategoryId() != null) {
            var cat = categoryRepository.findById(req.getCategoryId()).orElse(null);
            p.setCategory(cat);
        }

        var saved = productRepository.save(p);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        var prodOpt = productRepository.findById(id);
        if (prodOpt.isEmpty()) return ResponseEntity.notFound().build();

        Product p = prodOpt.get();

        // Authentifizierung prüfen
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof org.springframework.security.core.userdetails.User)) {
            return ResponseEntity.status(401).body("Authentication required");
        }
        
        String email = ((org.springframework.security.core.userdetails.User) auth.getPrincipal()).getUsername();
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(403).body("User not found");
        }
        
        // Nur Owner darf Produkt löschen
        if (p.getOwner() == null || !p.getOwner().getId().equals(userOpt.get().getId())) {
            return ResponseEntity.status(403).body("Only the owner can delete this product");
        }

        productRepository.delete(p);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/claim-orphaned")
    public ResponseEntity<?> claimOrphanedProducts() {
        // Authentifizierung prüfen
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof org.springframework.security.core.userdetails.User)) {
            return ResponseEntity.status(401).body("Authentication required");
        }
        
        String email = ((org.springframework.security.core.userdetails.User) auth.getPrincipal()).getUsername();
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(403).body("User not found");
        }

        // Alle Produkte ohne Owner finden und dem aktuellen Benutzer zuweisen
        var orphanedProducts = productRepository.findAll().stream()
                .filter(p -> p.getOwner() == null)
                .peek(p -> p.setOwner(userOpt.get()))
                .toList();
        
        productRepository.saveAll(orphanedProducts);
        
        return ResponseEntity.ok(java.util.Map.of(
            "message", "Products claimed successfully",
            "count", orphanedProducts.size()
        ));
    }
}
