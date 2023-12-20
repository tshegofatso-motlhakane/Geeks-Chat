package com.tshegofatso.B_Geeks4Chatting_V4.Controller;

import com.tshegofatso.B_Geeks4Chatting_V4.Helper.PasswordHelper;
import com.tshegofatso.B_Geeks4Chatting_V4.Model.ResponseObject;
import com.tshegofatso.B_Geeks4Chatting_V4.Model.User;
import com.tshegofatso.B_Geeks4Chatting_V4.Model.LoginRequest;
import com.tshegofatso.B_Geeks4Chatting_V4.Model.LoginResponse;
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
    public ResponseObject<?> register(@RequestBody User newUser){

        try {
            return authService.register(newUser);
        } catch (UsernameNotFoundException | BadCredentialsException ex) {
            // Handle invalid credentials or user
            return ResponseObject.builder()
                    .status(HttpStatus.BAD_REQUEST).
                    message("Could not register new User").build();
        }

    }
    @PostMapping("/login")
    public ResponseObject<?> login(@RequestBody LoginRequest userRequest){

        System.out.println("login starting");
        try {

            return authService.loginUser(userRequest);
        } catch (UsernameNotFoundException | BadCredentialsException ex) {
            // Handle invalid credentials or user
            return ResponseObject.builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .message("Could not login : Bad Request")
                    .Data(null).build();
        }
    }




}
