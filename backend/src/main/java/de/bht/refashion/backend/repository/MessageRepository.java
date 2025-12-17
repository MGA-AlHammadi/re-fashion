package de.bht.refashion.backend.repository;

import de.bht.refashion.backend.model.Message;
import de.bht.refashion.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByRecipientOrderByCreatedAtDesc(User recipient);
    List<Message> findBySenderOrderByCreatedAtDesc(User sender);
}
