package com.library.spring_boot_library.service;

import com.library.spring_boot_library.dao.BookRepository;
import com.library.spring_boot_library.dao.CheckoutRepository;
import com.library.spring_boot_library.entity.Book;
import com.library.spring_boot_library.entity.Checkout;
import com.library.spring_boot_library.responsemodels.ShelfCurrentLoansResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Transactional
public class BookService {
    private BookRepository bookRepository;
    private CheckoutRepository checkoutRepository;

    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository) {
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
    }

    public Book checkoutBook(String userEmail, Long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        // makes sure that:
        // 1. the book exists
        // 2. the user does not have that book checked out
        // 3. the book has available copies
        // if not all conditions meet, throw an error and this will be processed by error handler
        if(!book.isPresent() || validateCheckout != null || book.get().getCopiesAvailable() < 0) {
            throw new Exception("Book doesn't exist or already checked out by user!");
        }
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        bookRepository.save(book.get());
        Checkout checkout = new Checkout(userEmail,
                LocalDate.now().toString(), LocalDate.now().plusDays(7).toString(),
                book.get().getId());
        checkoutRepository.save(checkout);
        return book.get();
    }

    public boolean checkoutBookByUser(String userEmail, Long bookId) {
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        return validateCheckout != null;
    }

    public int currentLoansCount(String userEmail) {
        return checkoutRepository.findBooksByUserEmail(userEmail).size();
    }

    public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception {
        List<ShelfCurrentLoansResponse> shelfCurrentLoansResponses = new ArrayList<>();
        List<Checkout> checkoutList = checkoutRepository.findBooksByUserEmail(userEmail);
        List<Long> bookIdList = new ArrayList<>();

        for(Checkout i: checkoutList) {
            bookIdList.add(i.getBookId());
        }
        List<Book> books = bookRepository.findBooksByBookIds(bookIdList);

        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        for (Book book : books) {
            Optional<Checkout> checkout = checkoutList.stream()
                    .filter(x -> x.getBookId() == book.getId()).findFirst();
            if(checkout.isPresent()) {
                // get the difference between the return date and current date
                Date d1 = format.parse(checkout.get().getReturnDate());
                Date d2 = format.parse(LocalDate.now().toString());
                TimeUnit time = TimeUnit.DAYS;
                long difference_in_time = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);
                shelfCurrentLoansResponses.add(new ShelfCurrentLoansResponse(book, (int)difference_in_time));
            }
        }
        return shelfCurrentLoansResponses;
    }

    public void returnBook(String userEmail, long bookId) throws Exception {
        Optional<Book> book = bookRepository.findById(bookId);
        Checkout validCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
        if(!book.isPresent() || validCheckout == null) {
            throw new Exception("Book does not exist or not checkout by user!");
        }
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1); // add the available copies
        checkoutRepository.deleteById(validCheckout.getId());
    }

    public void renewLoan(String userEmail, long bookId) throws Exception {
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if(validateCheckout == null) { // check if the user really has that book
            throw new Exception("Book does not exist or not checkout by user!");
        }

        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        Date d1 = format.parse(validateCheckout.getReturnDate());
        Date d2 = format.parse(LocalDate.now().toString());
        if(d1.compareTo(d2) >= 0) {
            validateCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());
            checkoutRepository.save(validateCheckout);
        }
    }
}
