package de.bht.refashion.backend.repository;

import de.bht.refashion.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory_Name(String name);
}
