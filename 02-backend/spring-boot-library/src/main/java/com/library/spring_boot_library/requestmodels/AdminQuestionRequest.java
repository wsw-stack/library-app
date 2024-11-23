package com.library.spring_boot_library.requestmodels;

import lombok.Data;

// used to update the database after the admin has given a response
@Data
public class AdminQuestionRequest {
    private long id;
    private String response;
}
