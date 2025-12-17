package de.bht.refashion.backend.repository;

import de.bht.refashion.backend.model.Favorite;
import de.bht.refashion.backend.model.User;
import de.bht.refashion.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser(User user);
    Optional<Favorite> findByUserAndProduct(User user, Product product);
    void deleteByUserAndProduct(User user, Product product);
}
