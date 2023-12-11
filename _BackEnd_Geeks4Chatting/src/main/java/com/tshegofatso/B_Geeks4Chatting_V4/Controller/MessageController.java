package com.tshegofatso.B_Geeks4Chatting_V4.Controller;

import com.tshegofatso.B_Geeks4Chatting_V4.Model.Message;
import com.tshegofatso.B_Geeks4Chatting_V4.Model.MessageStatus;
import com.tshegofatso.B_Geeks4Chatting_V4.Repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController

public class MessageController {


    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageRepository messageRepository;

    @MessageMapping("/api/chat/{conversationId}")
    public void sendMessage(@DestinationVariable String conversationId, Message message) {
        // Save the message to the database
        message.setTimestamp(LocalDateTime.now());
        message.setConversationId(conversationId);
        messageRepository.save(message);
        // Send the message to the specified conversation
        messagingTemplate.convertAndSend("/topic/messages/" + conversationId, message);
        System.out.println("sent to topic");
    }

    @PutMapping("api/messages/updateStatus/{messageId}")
    public void updateMessageStatus(@PathVariable int messageId) {

        Message message = messageRepository.findById(messageId).orElse(null);
        System.out.println("updating status");
        // Update the status
        if (message != null) {
            message.setStatus(MessageStatus.RECEIVED);

            // Save the updated message back to the database
            messageRepository.save(message);
        }

    }

    @PutMapping("api/messages/updateStatusToRead/{conversationId}")
    public void updateMessageStatusREad(@PathVariable String conversationId) {

        List<Message> messagesToUpdate = messageRepository.findByConversationIdAndStatus(conversationId, MessageStatus.RECEIVED);

        // Update the status for each received message to READ
        messagesToUpdate.forEach(message -> {
            message.setStatus(MessageStatus.READ);
            messageRepository.save(message);
        });

    }



    @GetMapping("api/messages/{conversationId}")
    public List<Message> getMessages(@PathVariable String conversationId) {
        // Retrieve messages for the specified conversation from the database
        return messageRepository.findByConversationId(conversationId);
    }

    @GetMapping("api/messages/{userid}/oldMessages")
    public List<Message> getOldMessages(@PathVariable int userid) {
        // Retrieve messages for the specified conversation from the database
        String pattern1 = userid + "_%";
        String pattern2 = "%_" + userid;
        List<Message> messages = messageRepository.findMessagesByUserId(userid,pattern1,pattern2);

        System.out.println(messages);
        return messages;
    }
}
