package com.tshegofatso.B_Geeks4Chatting_V4.Service;

import com.tshegofatso.B_Geeks4Chatting_V4.Helper.PasswordHelper;
import com.tshegofatso.B_Geeks4Chatting_V4.Model.User;
import com.tshegofatso.B_Geeks4Chatting_V4.Model.LoginRequest;
import com.tshegofatso.B_Geeks4Chatting_V4.Model.LoginResponse;
import com.tshegofatso.B_Geeks4Chatting_V4.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    public LoginResponse loginUser(LoginRequest userRequest){
        User user = userRepository.findByUsername(userRequest.getUsername());

        // Check if the user exists and the password matches
        if (user != null && PasswordHelper.matchPassword(userRequest.getPassword(), user.getPassword())) {
            // Return UserResponse
            return new LoginResponse(user.getUserid(), user.getUsername());
        }

        // If authentication fails, return null or throw an exception
        return null;
    }
}
