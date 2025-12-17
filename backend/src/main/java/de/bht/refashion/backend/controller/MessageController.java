package de.bht.refashion.backend.controller;

import de.bht.refashion.backend.model.Message;
import de.bht.refashion.backend.model.User;
import de.bht.refashion.backend.repository.MessageRepository;
import de.bht.refashion.backend.repository.UserRepository;
import de.bht.refashion.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public MessageController(MessageRepository messageRepository, UserRepository userRepository, UserService userService) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @GetMapping
    public List<Message> inbox(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        User user = userService.getUserProfile(token);
        return messageRepository.findByRecipientOrderByCreatedAtDesc(user);
    }

    record SendMessageRequest(Long recipientId, String content) {}

    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestHeader("Authorization") String authHeader, @RequestBody SendMessageRequest req) {
        String token = authHeader.substring(7);
        User sender = userService.getUserProfile(token);
        Long recipientId = req.recipientId();
        User recipient = recipientId != null ? userRepository.findById(recipientId).orElse(null) : null;
        if (recipient == null) return ResponseEntity.badRequest().body("Recipient not found");
        Message m = new Message(sender, recipient, req.content());
        messageRepository.save(m);
        return ResponseEntity.ok(m);
    }
}
