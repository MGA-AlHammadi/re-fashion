package de.bht.refashion.backend.controller;

import de.bht.refashion.backend.model.CartItem;
import de.bht.refashion.backend.model.Product;
import de.bht.refashion.backend.model.User;
import de.bht.refashion.backend.repository.CartItemRepository;
import de.bht.refashion.backend.repository.ProductRepository;
import de.bht.refashion.backend.service.UserService;
import org.springframework.http.ResponseEntity;import org.springframework.transaction.annotation.Transactional;import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private static final String PRODUCT_NOT_FOUND = "Product not found";
    private static final String PRODUCT_ID_REQUIRED = "Product ID is required";

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    public CartController(CartItemRepository cartItemRepository, ProductRepository productRepository, UserService userService) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userService = userService;
    }

    @GetMapping
    public List<CartItem> getCart(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        User user = userService.getUserProfile(token);
        return cartItemRepository.findByUser(user);
    }

    record AddToCartRequest(Long productId, int quantity) {}

    @PostMapping
    public ResponseEntity<?> addToCart(@RequestHeader("Authorization") String authHeader, @RequestBody AddToCartRequest req) {
        String token = authHeader.substring(7);
        User user = userService.getUserProfile(token);
        if (req.productId() == null) return ResponseEntity.badRequest().body(PRODUCT_ID_REQUIRED);
        Long productId = req.productId();
        if (productId == null) return ResponseEntity.badRequest().body(PRODUCT_ID_REQUIRED);
        Product p = productRepository.findById(productId).orElse(null);
        if (p == null) return ResponseEntity.badRequest().body(PRODUCT_NOT_FOUND);
        var existing = cartItemRepository.findByUserAndProduct(user, p);
        CartItem item;
        if (existing.isPresent()) {
            item = existing.get();
            item.setQuantity(item.getQuantity() + Math.max(1, req.quantity()));
        } else {
            item = new CartItem(user, p, Math.max(1, req.quantity()));
        }
        cartItemRepository.save(item);
        return ResponseEntity.ok(item);
    }

    @PutMapping("/{productId}")
    public ResponseEntity<?> updateQuantity(@RequestHeader("Authorization") String authHeader, @PathVariable Long productId, @RequestBody Integer quantity) {
        String token = authHeader.substring(7);
        User user = userService.getUserProfile(token);
        if (productId == null) return ResponseEntity.badRequest().body(PRODUCT_ID_REQUIRED);
        Product p = productRepository.findById(productId).orElse(null);
        if (p == null) return ResponseEntity.badRequest().body(PRODUCT_NOT_FOUND);
        var existing = cartItemRepository.findByUserAndProduct(user, p);
        if (existing.isEmpty()) return ResponseEntity.notFound().build();
        CartItem item = existing.get();
        item.setQuantity(Math.max(1, quantity));
        cartItemRepository.save(item);
        return ResponseEntity.ok(item);
    }

    @Transactional
    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFromCart(@RequestHeader("Authorization") String authHeader, @PathVariable Long productId) {
        String token = authHeader.substring(7);
        User user = userService.getUserProfile(token);
        if (productId == null) return ResponseEntity.badRequest().body(PRODUCT_ID_REQUIRED);
        Product p = productRepository.findById(productId).orElse(null);
        if (p == null) return ResponseEntity.badRequest().body(PRODUCT_NOT_FOUND);
        cartItemRepository.deleteByUserAndProduct(user, p);
        return ResponseEntity.ok().build();
    }
}
