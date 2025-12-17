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

        var ownerOpt = userRepository.findById(req.getOwnerId() == null ? -1L : req.getOwnerId());
        if (req.getOwnerId() != null && ownerOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Owner not found");
        }

        Product p = new Product();
        p.setTitle(req.getTitle());
        p.setDescription(req.getDescription());
        p.setPrice(req.getPrice());
        p.setSize(req.getSize());
        p.setCondition(req.getCondition());
        p.setImageUrl(req.getImageUrl());
        p.setCategory(category);
        ownerOpt.ifPresent(p::setOwner);

        Product saved = productRepository.save(p);
        URI location = URI.create("/api/products/" + saved.getId());
        if (location != null) {
            return ResponseEntity.created(location).body(saved);
        }
        return ResponseEntity.ok(saved);
    }
}
