package com.tshegofatso.B_Geeks4Chatting_V4.Repository;

import com.tshegofatso.B_Geeks4Chatting_V4.Model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository  extends JpaRepository<Contact, Integer> {
}
