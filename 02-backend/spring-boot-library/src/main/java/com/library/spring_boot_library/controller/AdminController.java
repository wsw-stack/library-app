package com.library.spring_boot_library.controller;

import com.library.spring_boot_library.requestmodels.AddBookRequest;
import com.library.spring_boot_library.service.AdminService;
import com.library.spring_boot_library.utils.ExtractJwt;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http:/localhost:3000")
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/secure/add/book")
    public void postBook(@RequestHeader(value = "Authorization") String token,
                         @RequestBody AddBookRequest addBookRequest) throws Exception {
        String admin = ExtractJwt.payloadJWTExtraction(token, "\"sub\"");
        if(admin == null || !admin.equals("admin@email.com")) {
            throw new Exception("Administration page only");
        }
        adminService.postBook(addBookRequest);
    }
}
