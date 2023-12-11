package com.tshegofatso.B_Geeks4Chatting_V4.Controller;

import com.tshegofatso.B_Geeks4Chatting_V4.Helper.PasswordHelper;
import com.tshegofatso.B_Geeks4Chatting_V4.Model.User;
import com.tshegofatso.B_Geeks4Chatting_V4.Model.UserRequest;
import com.tshegofatso.B_Geeks4Chatting_V4.Model.UserResponse;
import com.tshegofatso.B_Geeks4Chatting_V4.Repository.UserRepository;
import com.tshegofatso.B_Geeks4Chatting_V4.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User newUser){

        System.out.println("login starting");
        try {
            if(userRepository.findByUsername(newUser.getUsername()) != null)
            {
                return ResponseEntity.status(400).body("Username already exists");
            }
            newUser.setPassword(PasswordHelper.encryptPassword(newUser.getPassword()));
            userRepository.save(newUser);
            System.out.println("saved + " + newUser);
            return ResponseEntity.ok(newUser);
        } catch (UsernameNotFoundException | BadCredentialsException ex) {
            // Handle invalid credentials or user
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("invalid credentials");
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserRequest userRequest){

        System.out.println("login starting");
        try {
            UserResponse user = authService.loginUser(userRequest);
            return ResponseEntity.ok(user);
        } catch (UsernameNotFoundException | BadCredentialsException ex) {
            // Handle invalid credentials or user
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("invalid credentials");
        }
    }




}
