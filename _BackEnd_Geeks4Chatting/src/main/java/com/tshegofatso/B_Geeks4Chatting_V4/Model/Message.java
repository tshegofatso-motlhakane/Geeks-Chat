package com.tshegofatso.B_Geeks4Chatting_V4.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int messageid;
    private int sender;
    private String conversationId;
    private String content;
    private LocalDateTime timestamp;
    @Enumerated(EnumType.STRING)
    private MessageStatus status;
}
