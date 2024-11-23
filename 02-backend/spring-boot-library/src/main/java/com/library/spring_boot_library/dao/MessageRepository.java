package com.library.spring_boot_library.dao;

import com.library.spring_boot_library.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

public interface MessageRepository extends JpaRepository<Message, Long> {
    Page<Message> findByUserEmail(@RequestParam("user_email") String userEmail, Pageable pageable);
    // check questions that have not been responded by the admin
    Page<Message> findByClosed(@RequestParam("closed") boolean closed, Pageable pageable);
}
