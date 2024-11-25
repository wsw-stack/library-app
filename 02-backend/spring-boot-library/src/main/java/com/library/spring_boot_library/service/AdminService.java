package com.library.spring_boot_library.service;

import com.library.spring_boot_library.dao.BookRepository;
import com.library.spring_boot_library.entity.Book;
import com.library.spring_boot_library.requestmodels.AddBookRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    private BookRepository bookRepository;

    @Autowired
    public AdminService (BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public void postBook(AddBookRequest addBookRequest) {
        Book book = new Book();
        book.setTitle(addBookRequest.getTitle());
        book.setAuthor(addBookRequest.getAuthor());
        book.setDescription(addBookRequest.getDescription());
        book.setCopies(addBookRequest.getCopies());
        book.setCopiesAvailable(addBookRequest.getCopies());
        book.setCategory(addBookRequest.getCategory());
        book.setImage(addBookRequest.getImg());

        bookRepository.save(book);
    }
}
