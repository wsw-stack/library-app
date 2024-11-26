import { useEffect, useState } from "react"
import BookModel from "../../../models/BookModel"
import { SpinnerLoading } from "../../Utils/SpinnerLoading"
import { Pagination } from "../../Utils/Pagination"
import { ChangeBookQuantity } from "./ChangeBookQuantity"

export const ChangeBookQuantityPage = () => {
    const [books, setBooks] = useState<BookModel[]>([])
    const [isLoading, setIsLoading] = useState(true) // by default it will display to the users that the page is loading
    const [httpError, setHttpError] = useState(null) // is not null if the API fails
    const [currentPage, setCurrentPage] = useState(1)
    const [booksPerPage, setBooksPerPage] = useState(5)
    const [totalPages, setTotalPages] = useState(5)
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0)

    const [bookDelete, setBookDelete] = useState(false)

    useEffect(() => {
        const fetchBooks = async () => {
            const url: string = `http://localhost:8080/api/books?page=${currentPage - 1}&size=${booksPerPage}`
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error('Something went wrong!')
            }
            const responseJson = await response.json() // parse the response into json, still this is an async function
            const responseData = responseJson._embedded.books // get the books out of it
            setTotalAmountOfBooks(responseJson.page.totalElements)
            setTotalPages(responseJson.page.totalPages) // set them according to the response data

            const loadedBooks: BookModel[] = []
            for (const key in responseData) {
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copiesAvailable: responseData[key].copiesAvailable,
                    category: responseData[key].category,
                    img: responseData[key].img
                })
            }
            setBooks(loadedBooks)
            setIsLoading(false)
        }
        fetchBooks().catch((error: any) => {
            // is called when there is an Http error
            setIsLoading(false)
            setHttpError(error.message)
        })
    }, [currentPage, bookDelete]) // is called every time something in this array changes

    if(isLoading) {
        return (
            <SpinnerLoading />
        )
    }

    if(httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    const indexOfLastBook: number = booksPerPage * currentPage
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage + 1
    let lastItem = booksPerPage * currentPage <= totalAmountOfBooks ? booksPerPage * currentPage : totalAmountOfBooks

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    const deleteBook = () => setBookDelete(!bookDelete)

    return (
        <div className="container mt-5">
            {totalAmountOfBooks > 0?
                <>
                    <div className="mt-3">
                        <h3>Number of results: ({totalAmountOfBooks})</h3>
                    </div>
                    <p>
                        {indexOfFirstBook} to {lastItem} of {totalAmountOfBooks} items:
                    </p>
                    {books.map(book => (
                        <p><ChangeBookQuantity book={book} key={book.id} deleteBook={deleteBook}/></p>
                    ))}
                </>:
                <>
                    <h5>Add a book before changing quantity</h5>
                </>    
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}

        </div>
    )
}