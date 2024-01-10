package com.tshegofatso.B_Geeks4Chatting_V4.Service;

import com.tshegofatso.B_Geeks4Chatting_V4.Model.ResponseObject;
import com.tshegofatso.B_Geeks4Chatting_V4.Model.User;
import com.tshegofatso.B_Geeks4Chatting_V4.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;


    public ResponseObject<?> updateUserInfo(int userId, User updatedData){

        Optional<User> optionalUser = Optional.ofNullable(userRepository.findById(userId));

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // Update only the non-null fields from the DTO
            if (updatedData.getFirstname() != null) {
                user.setFirstname(updatedData.getFirstname());
            }
            if (updatedData.getLastname() != null) {
                user.setLastname(updatedData.getLastname());
            }
            if (updatedData.getEmail() != null) {
                user.setEmail(updatedData.getEmail());
            }
            if (updatedData.getUsername() != null) {
                user.setUsername(updatedData.getUsername());
            }
            if (updatedData.getAvatar() != null) {
                user.setAvatar(updatedData.getAvatar());
            }
            if (updatedData.getBio() != null) {
                user.setBio(updatedData.getBio());
            }

            // Save the updated user
            User updatedUser = userRepository.save(user);
            System.out.println("updated user : " + updatedUser.toString());
            return ResponseObject.builder().Data("").message("User updated sucessfully").status(HttpStatus.OK).build();
        } else {
            return ResponseObject.builder().Data("").message("User does not exist").status(HttpStatus.NOT_FOUND).build();
        }

    }
}
