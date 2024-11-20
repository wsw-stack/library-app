package com.library.spring_boot_library.controller;

import com.library.spring_boot_library.entity.Message;
import com.library.spring_boot_library.service.MessagesService;
import com.library.spring_boot_library.utils.ExtractJwt;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/messages")
public class MessageController {
    private MessagesService messagesService;

    public MessageController(MessagesService messagesService) {
        this.messagesService = messagesService;
    }

    @PostMapping("/secure/add/message")
    public void postMessage(@RequestHeader(value = "Authorization") String token,
                            @RequestBody Message messageRequest) {
        String userEmail = ExtractJwt.payloadJWTExtraction(token, "\"sub\"");
        messagesService.postMessage(messageRequest, userEmail);
    }
}
