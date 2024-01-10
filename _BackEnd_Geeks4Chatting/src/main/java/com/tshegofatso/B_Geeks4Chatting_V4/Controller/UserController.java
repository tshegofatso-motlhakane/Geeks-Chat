package com.tshegofatso.B_Geeks4Chatting_V4.Controller;

import com.tshegofatso.B_Geeks4Chatting_V4.Model.ResponseObject;
import com.tshegofatso.B_Geeks4Chatting_V4.Model.User;
import com.tshegofatso.B_Geeks4Chatting_V4.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PutMapping("/{userId}/update")
    public ResponseObject<?> updateUserInfo(@RequestBody User userProfile , @PathVariable Integer userId)
    {
       try{
           System.out.println("Updating userdid : " + userProfile.toString());
          return this.userService.updateUserInfo(userId,userProfile);
       }catch (Exception e)
       {
           System.out.println(e.getMessage());
       }
        return null;
    }


}
