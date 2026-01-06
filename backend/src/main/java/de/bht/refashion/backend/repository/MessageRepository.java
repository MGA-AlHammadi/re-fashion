package de.bht.refashion.backend.repository;

import de.bht.refashion.backend.model.Message;
import de.bht.refashion.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByRecipientOrderByCreatedAtDesc(User recipient);
    List<Message> findBySenderOrderByCreatedAtDesc(User sender);
    
    @Query("SELECT m FROM Message m WHERE (m.sender = :user OR m.recipient = :user) ORDER BY m.createdAt ASC")
    List<Message> findAllMessagesByUser(@Param("user") User user);
}
