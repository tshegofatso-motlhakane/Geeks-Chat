package com.tshegofatso.B_Geeks4Chatting_V4.Repository;

import com.tshegofatso.B_Geeks4Chatting_V4.Model.Message;
import com.tshegofatso.B_Geeks4Chatting_V4.Model.MessageStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message , Integer> {
    List<Message> findByConversationId(String conversationId);

    List<Message> findByConversationIdAndStatus(String conversationId, MessageStatus status);
    @Modifying
    @Query(value = "UPDATE messages SET status = :status WHERE messageid = :messageId", nativeQuery = true)
    int updateMessageStatusByMessageId(@Param("messageId") int messageId, @Param("status") String status);

    @Query(value = "SELECT * FROM messages " +
            "WHERE sender = :userId " +
            "OR conversation_id IN (SELECT DISTINCT conversation_id FROM messages " +
            "WHERE sender = :userId)", nativeQuery = true)
    List<Message> findMessagesForUser(@Param("userId") int userId);

//    @Query(value = "SELECT * FROM messages " +
//            "WHERE sender = :userId " +
//            "OR conversation_id IN (SELECT DISTINCT conversation_id FROM messages " +
//            "WHERE conversation_id LIKE %:pattern1 OR conversation_id LIKE :pattern2)",
//            nativeQuery = true)
//    List<Message> findMessagesByUserId(@Param("userId") int userId,
//                                       @Param("pattern1") String pattern1,
//                                       @Param("pattern2") String pattern2);

    @Query(value = "SELECT * FROM messages " +
            "WHERE sender = :userId " +
            "OR conversation_id IN (SELECT DISTINCT conversation_id FROM messages " +
            "WHERE conversation_id LIKE %:pattern1 OR conversation_id LIKE :pattern2) " +
            "ORDER BY timestamp", // Add this ORDER BY clause
            nativeQuery = true)
    List<Message> findMessagesByUserId(@Param("userId") int userId,
                                       @Param("pattern1") String pattern1,
                                       @Param("pattern2") String pattern2);


}
