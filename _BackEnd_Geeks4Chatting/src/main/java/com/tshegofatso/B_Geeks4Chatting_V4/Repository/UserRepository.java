package com.tshegofatso.B_Geeks4Chatting_V4.Repository;

import com.tshegofatso.B_Geeks4Chatting_V4.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsername(String username);
    User findById(int userid);
    List<User> findByUsernameContainingIgnoreCase(String searchTerm);
    @Query(value = "SELECT DISTINCT u.* FROM users u " +
            "WHERE u.userid IN (" +
            "  SELECT user1 FROM contacts WHERE user2 = :userId " +
            "  UNION " +
            "  SELECT user2 FROM contacts WHERE user1 = :userId" +
            ") AND u.userid <> :userId", nativeQuery = true)
    List<User> findContactsForUser(@Param("userId") int userId);

    @Query(value = "SELECT DISTINCT u.* FROM users u " +
            "WHERE u.userid NOT IN (" +
            "  SELECT user1 FROM contacts WHERE user2 = :userId " +
            "  UNION " +
            "  SELECT user2 FROM contacts WHERE user1 = :userId" +
            ") AND u.userid <> :userId " +
            "AND LOWER(u.username) LIKE LOWER(CONCAT('%', :searchTerm, '%'))", nativeQuery = true)
    List<User> findUsersNotInContactsByUsername(
            @Param("userId") int userId,
            @Param("searchTerm") String searchTerm
    );
}
