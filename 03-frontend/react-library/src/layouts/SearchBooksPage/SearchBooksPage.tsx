import { useState, useEffect } from "react"
import BookModel from "../../models/BookModel"
import { SpinnerLoading } from "../Utils/SpinnerLoading"
import { SearchBook } from "./Components/SearchBook"
import { Pagination } from "../Utils/Pagination"

export const SearchBooksPage = () => {
    const [books, setBooks] = useState<BookModel[]>([])
    const [isLoading, setIsLoading] = useState(true) // by default it will display to the users that the page is loading
    const [httpError, setHttpError] = useState(null) // is not null if the API fails
    const [currentPage, setCurrentPage] = useState(1)
    const [booksPerPage, setBooksPerPage] = useState(5)
    const [totalPages, setTotalPages] = useState(5)
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0)
    const [search, setSearch] = useState('')
    const [searchUrl, setSearchUrl] = useState('')
    const [categorySelection, setCategorySelection] = useState('Book category')


    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = 'http://localhost:8080/api/books'
            let url: string = ''
            if (searchUrl === '') { // if the searchUrl is empty, simply return everything
                url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}` // 0 is the first page in pagination API
            } else { // url is base url and the search filters
                // replace the <PageNumber> in the template with the current page index
                let searchWithPage = searchUrl.replace('<PageNumber>', `${currentPage-1}`)
                url = baseUrl + searchWithPage
            }
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
        window.scrollTo(0, 0)
    }, [currentPage, searchUrl]) // is called every time something in this array changes

    if (isLoading) {
        return (
            <SpinnerLoading />
        )
    } // Loading effect
    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    } // error effect

    const searchHandleChange = () => {
        setCurrentPage(1)
        if (search === '') {
            setSearchUrl('')
        } else {
            setSearchUrl(`/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${booksPerPage}`)
        }
        setCategorySelection('Book Category') // reset the category filter if we search for title
    }

    const categoryField = (value: string) => {
        setCurrentPage(1)
        // do the query based on the selection of the dropdown menu
        if(value.toLowerCase() === 'fe' || value.toLowerCase() === 'be' || value.toLowerCase() === 'data' || value.toLowerCase() === 'devops') {
            setCategorySelection(value);
            setSearchUrl(`/search/findByCategory?category=${value}&page=<pageNumber>&size=${booksPerPage}`)
        } else{
            setCategorySelection('all');
            setSearchUrl(`?page=<pageNumber>&size=${booksPerPage}`)
        }
    }

    const indexOfLastBook: number = booksPerPage * currentPage
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage + 1
    let lastItem = booksPerPage * currentPage <= totalAmountOfBooks ? booksPerPage * currentPage : totalAmountOfBooks

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    return (
        <div>
            <div className="container">
                <div className="row mt-5">
                    <div className="col-6">
                        <div className="d-flex">
                            <input className="form-control me-2" type="search" placeholder="search" aria-labelledby="search"
                                onChange={e => setSearch(e.target.value)} />
                            <button className="btn btn-outline-success" onClick={() => searchHandleChange()}>
                                Search
                            </button>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button"
                                data-bs-toggle='dropdown' aria-expanded='false'>
                                {categorySelection}
                            </button>
                            <ul className="dropdown-menu">
                                <li>
                                    <a className="dropdown-item" href="#" onClick={() => categoryField('All')}>All</a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#" onClick={() => categoryField('fe')}>Front End</a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#" onClick={() => categoryField('be')}>Backend</a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#" onClick={() => categoryField('data')}>Data</a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#" onClick={() => categoryField('devops')}>DevOps</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* conditional rendering based on whether the search result is 0 */}
                {totalAmountOfBooks > 0 ?
                    <>
                        <div className="mt-3">
                            <h5>Number of results: {totalAmountOfBooks}</h5>
                        </div>
                        <p>
                            {indexOfFirstBook} to {lastItem} of {totalAmountOfBooks} items:
                        </p>
                        {books.map(book => (
                            <SearchBook book={book} key={book.id} />
                        ))}
                    </> // react tag
                    :
                    <div className="m-5">
                        <h3>
                            Can't find what you are looking for?
                        </h3>
                        <a type="button" className="btn main-color btn-md px-4 me-md-2 fw-bold text-white"
                            href="#">Library Services</a>
                    </div>}
                {/* pagination is rendered only when there is more than 1 page */}
                {totalPages > 1 &&
                    <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                }
            </div>
        </div>
    )
}