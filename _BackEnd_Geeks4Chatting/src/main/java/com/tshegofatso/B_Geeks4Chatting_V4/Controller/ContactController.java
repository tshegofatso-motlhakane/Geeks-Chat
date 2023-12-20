package com.tshegofatso.B_Geeks4Chatting_V4.Controller;

import com.tshegofatso.B_Geeks4Chatting_V4.Model.Contact;
import com.tshegofatso.B_Geeks4Chatting_V4.Model.User;
import com.tshegofatso.B_Geeks4Chatting_V4.Repository.ContactRepository;
import com.tshegofatso.B_Geeks4Chatting_V4.Repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@Slf4j
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ContactRepository contactRepository;
    @GetMapping("/{userid}/search")
    public ResponseEntity<?> searchContacts(@RequestParam String searchTerm, @PathVariable int userid){

        try{
            List<User> userList = userRepository.findUsersNotInContactsByUsername(userid,searchTerm);
            if(userList.isEmpty())
            {
                log.info("no found contacts");
                return ResponseEntity.status(404).body("No users exist");
            }
            System.out.println("sending found contacts");
            return ResponseEntity.ok(userList);
        }catch (Exception e)
        {
            return ResponseEntity.status(401).body(e.toString());
        }

    }

    @PostMapping("/add")
    public ResponseEntity<?> addContact(@RequestBody Contact contact){

        try{

            contactRepository.save(contact);
            List<User> contacts = userRepository.findContactsForUser(contact.getUser1());
            if(!contacts.isEmpty())
            {
                for (User u : contacts) {
                    u.setPassword("");

                }
            }
            System.out.println("new contact " + contacts);
            return ResponseEntity.ok(contacts);


        }catch(Exception e)
        {
            System.out.println(e.toString());
            return ResponseEntity.status(401).body("Failed to add contact");
        }
    }

    @GetMapping("/get/{userid}/all")
    public ResponseEntity<?> getAllContacts(@PathVariable int userid){

        try{
         List<User> contacts = userRepository.findContactsForUser(userid);
         if(!contacts.isEmpty())
         {
             System.out.println("setting password to null");
             for (User u : contacts) {
                 u.setPassword("");

             }
         }
            System.out.println("sending contacts");
         return ResponseEntity.ok(contacts);

        }catch(Exception e)
        {
            System.out.println(e.toString());
            return ResponseEntity.status(403).body("Failed to get contacts");
        }

    }

    @GetMapping("/get/{userid}/conversationIDs")
    public ResponseEntity<?> getConversationIds(@PathVariable int userid){

        try{

            List<User> contacts = userRepository.findContactsForUser(userid);

            if(!contacts.isEmpty())
            {
               List<String> conversations = this.getConvId(contacts,userid);
                return ResponseEntity.ok(conversations);
            }

            return null;

        }catch(Exception e)
        {
            System.out.println(e.toString());
            return ResponseEntity.status(401).body("Failed to add contact");
        }

    }

    private List<String> getConvId(List<User> users , int userid){

         List<String> convIds = new ArrayList<>();

         for(User u : users){
             String id = "";
              if(u.getUserid() > userid)
              {
                  id = userid +"_"+u.getUserid();
              }else if(u.getUserid() < userid)
              {
                  id = u.getUserid()+"_"+userid ;
              }
              else{
                  System.out.println("Invalid conversation iD creation");
                  return null;
              }
              convIds.add(id);
         }

        return convIds;
    }

}
