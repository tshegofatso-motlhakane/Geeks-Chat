package com.tshegofatso.B_Geeks4Chatting_V4.Model;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
@Table(name="users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userid;
    private String username;
    private String email;
    private String password;
    private String firstname;
    private String lastname;
    private String bio;
    private String avatar;
}
