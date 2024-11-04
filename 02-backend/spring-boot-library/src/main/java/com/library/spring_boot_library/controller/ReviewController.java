package com.library.spring_boot_library.controller;

import com.library.spring_boot_library.requestmodels.ReviewRequest;
import com.library.spring_boot_library.service.ReviewService;
import com.library.spring_boot_library.utils.ExtractJwt;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/reviews")
public class ReviewController {
    private ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/secure")
    public void postReview(@RequestHeader(value = "Authorization") String token,
                           @RequestBody ReviewRequest reviewRequest) throws Exception {
        String userEmail = ExtractJwt.payloadJWTExtraction(token, "\"sub\"");
        if(userEmail == null) {
            throw new Exception("User email is missing");
        }
        reviewService.postReview(userEmail, reviewRequest);
    }

    @GetMapping("/secure/user/book")
    public Boolean reviewBookByUser(@RequestHeader(value = "Authorization") String token,
                                    @RequestParam Long bookId) throws Exception {
        String userEmail = ExtractJwt.payloadJWTExtraction(token, "\"sub\"");
        if(userEmail == null) {
            throw new Exception("User email is missing");
        }
        return reviewService.userReviewListed(userEmail, bookId);
    }
}
