package de.bht.refashion.backend;

import de.bht.refashion.backend.model.Category;
import de.bht.refashion.backend.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner initCategories(CategoryRepository categoryRepository) {
		return args -> {
			if (categoryRepository.count() == 0) {
				categoryRepository.save(new Category("women", "Dresses, Blouses & More"));
				categoryRepository.save(new Category("men", "Shirts, Pants & More"));
				categoryRepository.save(new Category("kids", "Playful & Comfortable"));
				categoryRepository.save(new Category("shoes", "Sneakers, Boots & More"));
			}
		};
	}

}
