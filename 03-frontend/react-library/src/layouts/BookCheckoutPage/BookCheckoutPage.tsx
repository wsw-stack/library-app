import { useEffect, useState } from "react"
import BookModel from "../../models/BookModel"
import { SpinnerLoading } from "../Utils/SpinnerLoading"
import { StarsReview } from "../Utils/StarsReview"
import { CheckOutAndReviewBox } from "./CheckOutAndReviewBox"
import ReviewModel from "../../models/ReviewModel"
import { LatestReviews } from "./LatestReviews"

export const BookCheckOutPage = () => {
    const [book, setBook] = useState<BookModel>()
    const [isLoading, setIsLoading] = useState(true) // by default it will display to the users that the page is loading
    const [httpError, setHttpError] = useState(null) // is not null if the API fails 
    const [reviews, setReviews] = useState<ReviewModel[]>([]) // review state
    const [totalStars, setTotalStars] = useState(0)
    const [isLoadingReview, setIsLoadingReview] = useState(true)

    // localhost:3000/checkout/2, so bookId refers to the third one   
    const bookId = (window.location.pathname).split('/')[2]

    useEffect(() => {
        const fetchBook = async () => {
            const baseUrl: string = `http://localhost:8080/api/books/${bookId}`
            const response = await fetch(baseUrl)
            if (!response.ok) {
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
            setIsLoadingReview(false)
        }
        fetchBook().catch((error: any) => {
            // is called when there is an Http error
            setIsLoadingReview(false)
            setHttpError(error.message)
        })
    }, [])

    useEffect(() => {
        const fetchBookReviews = async () => {
            const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`
            const responseReviews = await fetch(reviewUrl)
            if (!responseReviews.ok) {
                throw new Error('Someting went wrong!')
            }
            const responseJsonReviews = await responseReviews.json()
            const responseData = responseJsonReviews._embedded.reviews
            const loadedReviews: ReviewModel[] = []
            let weightedStarReviews: number = 0

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    book_id: responseData[key].bookId, // use the column name defined in the backend
                    reviewDescription: responseData[key].reviewDescription
                })
                weightedStarReviews = weightedStarReviews + responseData[key].rating
            }

            if (loadedReviews) { // get the average star ratings
                // round the ratings to the nearest 0.5
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1)
                setTotalStars(Number(round))
            }

            setReviews(loadedReviews)
            setIsLoading(false)
        }

        fetchBookReviews().catch((error: any) => {
            setIsLoadingReview(false)
            setHttpError(error.message)
        })
    }, [])

    if (isLoading || isLoadingReview) {
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

    return (
        <div className="container d-none d-lg-block">
            <div className="row mt-5">
                <div className="col-sm-2 col-md-2">
                    {book?.img ?
                        <img src={book?.img} width='226' height='349' alt='Book' />
                        :
                        <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226' height='349' alt='Book' />
                    }
                </div>
                <div className="col-4 col-md-4 container">
                    <div className="ml-2">
                        <h2>{book?.title}</h2>
                        <h5 className="text-primary">{book?.author}</h5>
                        <p className="lead">{book?.description}</p>
                        <StarsReview rating={totalStars} size={32} />
                    </div>
                </div>
                <CheckOutAndReviewBox book={book} mobile={false} />
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
            </div>

            {/* for mobile */}
            <div className="container d-lg-none mt-5">
                <div className="d-flex justify-content-center align-items-center">
                    {book?.img ?
                        <img src={book?.img} width='226' height='349' alt='Book' />
                        :
                        <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226' height='349' alt='Book' />
                    }
                </div>
                <div className="mt-4">
                    <div className="ml-2">
                        <h2>{book?.title}</h2>
                        <h5 className="text-primary">{book?.author}</h5>
                        <p className="lead">{book?.description}</p>
                        <StarsReview rating={totalStars} size={32} />
                    </div>
                </div>
                <CheckOutAndReviewBox book={book} mobile={true} />
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
            </div>
        </div>
    )
}