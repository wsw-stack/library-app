package com.library.spring_boot_library.requestmodels;

import lombok.Data;

import java.util.Optional;

@Data
public class ReviewRequest {
    private double rating;
    private long bookId;
    // review is actually not required
    private Optional<String> reviewDescription;
}
