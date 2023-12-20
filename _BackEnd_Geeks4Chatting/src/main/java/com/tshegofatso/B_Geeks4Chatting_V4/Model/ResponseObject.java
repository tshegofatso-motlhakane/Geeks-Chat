package com.tshegofatso.B_Geeks4Chatting_V4.Model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseObject<T> {

    private String message;
    private HttpStatus status;
    private T Data;
}
