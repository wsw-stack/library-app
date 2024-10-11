import { useEffect, useState } from "react"
import BookModel from "../../models/BookModel"
import { SpinnerLoading } from "../Utils/SpinnerLoading"

export const BookCheckOutPage = () => {
    const [book, setBook] = useState<BookModel>()
    const [isLoading, setIsLoading] = useState(true) // by default it will display to the users that the page is loading
    const [httpError, setHttpError] = useState(null) // is not null if the API fails 
    // localhost:3000/checkout/2, so bookId refers to the third one   
    const bookId = (window.location.pathname).split('/')[2]

    useEffect(() => {
        const fetchBook = async () => {
            const baseUrl: string = `http://localhost:8080/api/books/${bookId}`
            const response = await fetch(baseUrl)
            if(!response.ok) {
                throw new Error('Something went wrong!')
            }
            const responseJson = await response.json() // parse the response into json, still this is an async function

            const loadedBook: BookModel = {
                id: responseJson.id,
                    title: responseJson.title,
                    author: responseJson.author,
                    description: responseJson.description,
                    copies: responseJson.copies,
                    copiesAvailable: responseJson.copiesAvailable,
                    category: responseJson.category,
                    img: responseJson.img
            }

            setBook(loadedBook)
            setIsLoading(false)
        }
        fetchBook().catch((error: any) => {
            // is called when there is an Http error
            setIsLoading(false) 
            setHttpError(error.message)
        })
    }, [])

    if(isLoading) {
        return (
            <SpinnerLoading />
        )
    } // Loading effect
    if(httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    } // error effect

    return (
        <div>
            <div className="container d-none d-lg-block">
                <div className="row mt-5">
                    <div className="col-sm-2 col-md-2">
                        {book?.img?
                            <img src={book?.img} width='226' height='349' alt='Book' />
                            :
                            <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226' height='349' alt='Book'/>
                        }
                    </div>
                    <div className="col-4 col-md-4 container">
                        <div className="ml-2">
                            <h2>{book?.title}</h2>
                            <h5 className="text-primary">{book?.author}</h5>
                            <p className="lead">{book?.description}</p>
                        </div>
                    </div>
                </div>
                <hr/>
                {/* for mobile */}
                <div className="container d-lg-none mt-5"> 
                    <div className="d-flex justify-content-center align-items-center">
                        {book?.img?
                            <img src={book?.img} width='226' height='349' alt='Book' />
                            :
                            <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226' height='349' alt='Book'/>
                        }
                    </div>
                    <div className="mt-4">
                        <div className="ml-2">
                            <h2>{book?.title}</h2>
                            <h5 className="text-primary">{book?.author}</h5>
                            <p className="lead">{book?.description}</p>
                        </div>
                    </div>
                    <hr/>
                </div>
            </div>
        </div>
    )
}