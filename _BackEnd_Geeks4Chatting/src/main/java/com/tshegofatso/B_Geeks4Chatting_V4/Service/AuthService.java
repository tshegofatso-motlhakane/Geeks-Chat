package com.tshegofatso.B_Geeks4Chatting_V4.Service;

import com.tshegofatso.B_Geeks4Chatting_V4.Helper.PasswordHelper;
import com.tshegofatso.B_Geeks4Chatting_V4.Model.ResponseObject;
import com.tshegofatso.B_Geeks4Chatting_V4.Model.User;
import com.tshegofatso.B_Geeks4Chatting_V4.Model.LoginRequest;
import com.tshegofatso.B_Geeks4Chatting_V4.Model.LoginResponse;
import com.tshegofatso.B_Geeks4Chatting_V4.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    public ResponseObject<User> loginUser(LoginRequest userRequest){
        User user = userRepository.findByUsername(userRequest.getUsername());

        // Check if the user exists and the password matches
        if (user != null && PasswordHelper.matchPassword(userRequest.getPassword(), user.getPassword())) {
            // Return UserResponse
            return ResponseObject.<User>builder()
                    .status(HttpStatus.OK).
                    message("User logged in")
                    .Data(user).build();
        }else if(user != null){

            return ResponseObject.<User>builder()
                    .status(HttpStatus.UNAUTHORIZED).
                    message("Invalid Credentials ")
                    .Data(null).build();
        }

        return ResponseObject.<User>builder()
                .status(HttpStatus.NOT_FOUND).
                message("User with username/email does not exist")
                .Data(null).build();
    }

    public ResponseObject<?> register(User newUser){
        try {
            if(userRepository.findByUsername(newUser.getUsername()) != null)
            {
                return ResponseObject.builder().status(HttpStatus.CONFLICT)
                        .message("The username already exist")
                        .Data(null).build();
            }
            newUser.setPassword(PasswordHelper.encryptPassword(newUser.getPassword()));

            userRepository.save(newUser);
            return ResponseObject.builder().status(HttpStatus.CREATED)
                    .message("User created successfully")
                    .Data(new LoginResponse(newUser.getUserid(), newUser.getUsername())).build();

        } catch (Exception e) {
            // Handle invalid credentials or user
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST)
                    .message(e.getMessage())
                    .Data(null).build();
        }

    }
}
