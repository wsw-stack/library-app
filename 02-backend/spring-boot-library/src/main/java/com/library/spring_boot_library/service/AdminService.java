package com.library.spring_boot_library.service;

import com.library.spring_boot_library.dao.BookRepository;
import com.library.spring_boot_library.dao.CheckoutRepository;
import com.library.spring_boot_library.dao.ReviewRepository;
import com.library.spring_boot_library.entity.Book;
import com.library.spring_boot_library.requestmodels.AddBookRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminService {
    private BookRepository bookRepository;
    private ReviewRepository reviewRepository;
    private CheckoutRepository checkoutRepository;

    @Autowired
    public AdminService (BookRepository bookRepository, ReviewRepository reviewRepository, CheckoutRepository checkoutRepository) {
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
        this.checkoutRepository = checkoutRepository;
    }

    public void increaseBookQuantity(Long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);
        if(!book.isPresent()) {
            throw new Exception("Book not found!");
        }
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);
        book.get().setCopies(book.get().getCopies() + 1);

        bookRepository.save(book.get());
    }

    public void decreaseBookQuantity(Long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);
        if(!book.isPresent()) {
            throw new Exception("Book not found!");
        }
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        book.get().setCopies(book.get().getCopies() - 1);

        bookRepository.save(book.get());
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

    public void deleteBook(Long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);

        if(!book.isPresent()) {
            throw new Exception("Book not found");
        }
        // delete the book and corresponding checkouts, reviews
        bookRepository.delete(book.get());
        checkoutRepository.deleteAllByBookId(bookId);
        reviewRepository.deleteAllByBookId(bookId);
    }
}
