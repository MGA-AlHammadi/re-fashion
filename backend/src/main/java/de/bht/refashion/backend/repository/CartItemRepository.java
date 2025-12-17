package de.bht.refashion.backend.repository;

import de.bht.refashion.backend.model.CartItem;
import de.bht.refashion.backend.model.User;
import de.bht.refashion.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndProduct(User user, Product product);
    void deleteByUserAndProduct(User user, Product product);
}
